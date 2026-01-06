
# The main goal of this app: to have our knowledge base be stored in a db in a semantically searchable way. (read kb + embed + store)

# --- LOAD TEXT ---
# Step-1: We have a knowledge base - /arsenal_kb locally that we want to read each content and have that in memory (basically loading text)

# Walk the directory and read files
from pathlib import Path
KB_PATH = Path("arsenal_kb")

documents = []

for txt_file in KB_PATH.rglob("*.txt"):
    with open(txt_file, "r", encoding="utf-8") as f:
        text = f.read().strip()

        documents.append({
            "text": text,
            "source": txt_file.name,
            "category": txt_file.parent.name
        })

# What we have now is: documents, a list of dicts with everything in memory.

# Each entry still contains a full file too big for emeddings, this is why chunking is mandatory.

# Why chunking exists? because embedding models work best when the text is focused, 1 chunk = 1 idea, and retrieval returns just enough context.

# If we embed whole file, retrieval becomes noisy, answers become vague, and we lose precision



# --- CHUNKING ---
# Step-2: Then we chunk that in-memory loaded text in portions
# How to chunk? we'll use character-based chunking with overlap.
# Recommended values (chunk size: 500-700 characters, overlap: 100-150 characters) this balances context continuty, and retrieval precision.

def chunk_text(text, chunk_size=600, overlap=120):
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap

    return chunks

# Applying chunking to our documents
chunked_documents = []

for doc in documents:
    chunks = chunk_text(doc["text"])

    for i, chunk in enumerate(chunks):
        chunked_documents.append({
            "id": f"{doc['source']}_{i}",
            "text": chunk,
            "source": doc["source"],
            "category": doc["category"],
            "chunk_id": i
        })

# We now have small semantic units, metadata preserved, and ready for embedding. And this is the list that gets sent to the embedding model.

# _________________________________

# TXT files
#    ↓
# Read into memory
#    ↓
# Chunked text + metadata   ← WE ARE HERE
# _________________________________

# SUMMARY: We load local text files, split them into overlapping semantic chunks, preserve metadata, and embed each chunk into a vector database for similarity-based retrieval.

# Next step:
# ________________________________________________
# Chunked text
#    ↓
# Embedding model
#    ↓
# Vectors
#    ↓
# Chroma DB
# ________________________________________________


# --- EMEDDING ---
# Step-3: Then we embed that chunk (meaning change the text into vector representations)
from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Why: Fast, Strong semantic quality, CPU-friendly, Industry standard


# Step-4: Then store those vector representations in a vector-db supporting db (for our case chroma)
# Initialize Chroma Cloud client

import chromadb
from chromadb.config import Settings
import os

chroma_client = chromadb.Client(
    Settings(
        chroma_api_impl="rest",
        chroma_server_host="api.trychroma.com",
        chroma_server_http_port=443,
        chroma_server_ssl_enabled=True,
        tenant=os.environ["CHROMA_TENANT"],
        database=os.environ["CHROMA_DATABASE"],
        api_key=os.environ["CHROMA_API_KEY"],
    )
)

# Step-5: Create / get your collection, Collections are like tables.
collection = chroma_client.get_or_create_collection(
    name="arsenal_kb"
)

# If it exists → reused
# If not → created


# Step-6: Embed + store chunks in chroma cloud (this is the key loop)
from sentence_transformers import SentenceTransformer
import uuid

model = SentenceTransformer("all-MiniLM-L6-v2")

texts = [doc["text"] for doc in chunked_documents]
embeddings = model.encode(texts, show_progress_bar=True)

collection.add(
    ids=[str(uuid.uuid4()) for _ in texts],
    documents=texts,
    embeddings=embeddings.tolist(),
    metadatas=[
        {
            "source": doc["source"],
            "category": doc["category"],
            "chunk_id": doc["chunk_id"],
        }
        for doc in chunked_documents
    ]
)



# Our final pipeline (conceptually)
# TXT files
#    ↓
# Normalized text
#    ↓
# Overlapping semantic chunks
#    ↓
# SentenceTransformer embeddings
#    ↓
# Chroma vector store
