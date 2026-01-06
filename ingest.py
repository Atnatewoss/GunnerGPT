"""
GunnerGPT Knowledge Base Ingestion Script

This script performs the following steps:
1. Loads local text files from the Arsenal knowledge base
2. Splits documents into overlapping semantic chunks
3. Generates vector embeddings locally
4. Uploads embeddings and metadata to Chroma Cloud for persistent storage
"""

from pathlib import Path
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

# ---------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------

KB_PATH = Path("arsenal_kb")
COLLECTION_NAME = "gunnergpt_arsenal_kb"
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

CHUNK_SIZE = 600
CHUNK_OVERLAP = 120

CHROMA_API_KEY = "YOUR_CHROMA_API_KEY"

# ---------------------------------------------------------------------
# Step 1: Load knowledge base files
# ---------------------------------------------------------------------

documents = []

for txt_file in KB_PATH.rglob("*.txt"):
    with open(txt_file, "r", encoding="utf-8") as f:
        text = f.read().strip()

        documents.append({
            "text": text,
            "source": txt_file.name,
            "category": txt_file.parent.name
        })

# ---------------------------------------------------------------------
# Step 2: Chunk documents into semantic units
# ---------------------------------------------------------------------

def chunk_text(text, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap

    return chunks


chunked_documents = []

for doc in documents:
    chunks = chunk_text(doc["text"])

    for i, chunk in enumerate(chunks):
        chunked_documents.append({
            "text": chunk,
            "source": doc["source"],
            "category": doc["category"],
            "chunk_id": i
        })

# ---------------------------------------------------------------------
# Step 3: Generate embeddings locally
# ---------------------------------------------------------------------

embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)

texts = [doc["text"] for doc in chunked_documents]

embeddings = embedding_model.encode(
    texts,
    show_progress_bar=True,
    normalize_embeddings=True
)

# ---------------------------------------------------------------------
# Step 4: Connect to Chroma Cloud
# ---------------------------------------------------------------------

client = chromadb.Client(
    Settings(
        chroma_api_impl="rest",
        chroma_server_host="api.trychroma.com",
        chroma_server_http_port=443,
        chroma_server_ssl_enabled=True,
        anonymized_telemetry=False
    )
)

client.set_api_key(CHROMA_API_KEY)

collection = client.get_or_create_collection(
    name=COLLECTION_NAME,
    metadata={"description": "Arsenal FC knowledge base for GunnerGPT"}
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
            "chunk_id": doc["chunk_id"]
        }
        for doc in chunked_documents
    ],
    ids=[
        f"{doc['source']}_{doc['chunk_id']}"
        for doc in chunked_documents
    ]
)

print(f"Ingested {len(chunked_documents)} chunks into Chroma Cloud.")
