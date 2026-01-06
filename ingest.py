"""
GunnerGPT Knowledge Base Ingestion Script

Pipeline:
1. Load local TXT files
2. Chunk documents into overlapping semantic segments
3. Generate embeddings locally
4. Upload embeddings + metadata to Chroma Cloud (v2 API)
"""

from pathlib import Path
import os
from dotenv import load_dotenv

from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings


# ---------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------

# Local knowledge base directory
KB_PATH = Path("arsenal_kb")

# Chroma collection name (auto-created if missing)
COLLECTION_NAME = "gunnergpt_arsenal_kb"

# Local embedding model
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

# Chunking parameters
CHUNK_SIZE = 600
CHUNK_OVERLAP = 120


# ---------------------------------------------------------------------
# Environment variables
# ---------------------------------------------------------------------

load_dotenv()

CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")
CHROMA_TENANT = os.getenv("CHROMA_TENANT")
CHROMA_DB = os.getenv("CHROMA_DB")

if not all([CHROMA_API_KEY, CHROMA_TENANT, CHROMA_DB]):
    raise ValueError("Missing required Chroma Cloud environment variables")


# ---------------------------------------------------------------------
# Step 1: Load knowledge base files
# ---------------------------------------------------------------------

documents = []

for txt_file in KB_PATH.rglob("*.txt"):
    with open(txt_file, "r", encoding="utf-8") as f:
        text = f.read().strip()

    if not text:
        continue

    documents.append({
        "text": text,
        "source": txt_file.name,
        "category": txt_file.parent.name,
    })


# ---------------------------------------------------------------------
# Step 2: Chunk documents into semantic units
# ---------------------------------------------------------------------

def chunk_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    """
    Split text into overlapping character-based chunks.
    """
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap

    return chunks


chunked_documents = []

for doc in documents:
    chunks = chunk_text(doc["text"], CHUNK_SIZE, CHUNK_OVERLAP)

    for i, chunk in enumerate(chunks):
        chunked_documents.append({
            "text": chunk,
            "source": doc["source"],
            "category": doc["category"],
            "chunk_id": i,
        })


# ---------------------------------------------------------------------
# Step 3: Generate embeddings locally
# ---------------------------------------------------------------------

embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)

texts = [doc["text"] for doc in chunked_documents]

embeddings = embedding_model.encode(
    texts,
    show_progress_bar=True,
    normalize_embeddings=True,
)


# ---------------------------------------------------------------------
# Step 4: Connect to Chroma Cloud (v2 API)
# ---------------------------------------------------------------------

client = chromadb.CloudClient(
    tenant=CHROMA_TENANT,
    database=CHROMA_DB,
    api_key=CHROMA_API_KEY
)

collection = client.get_or_create_collection(
    name=COLLECTION_NAME,
    metadata={"description": "Arsenal FC knowledge base for GunnerGPT"},
)


# ---------------------------------------------------------------------
# Step 5: Upload embeddings and metadata
# ---------------------------------------------------------------------

collection.add(
    documents=[doc["text"] for doc in chunked_documents],
    embeddings=embeddings.tolist(),
    metadatas=[
        {
            "source": doc["source"],
            "category": doc["category"],
            "chunk_id": doc["chunk_id"],
        }
        for doc in chunked_documents
    ],
    ids=[
        f"{doc['source']}_{doc['chunk_id']}"
        for doc in chunked_documents
    ],
)

print(f"Ingested {len(chunked_documents)} chunks into Chroma Cloud.")
