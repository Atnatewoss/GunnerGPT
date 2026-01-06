"""
GunnerGPT FastAPI Backend - Main Application

Endpoints:
- POST /ingest - Trigger knowledge base ingestion
- POST /query - Query the knowledge base
- GET /health - Health check
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import chromadb
from sentence_transformers import SentenceTransformer
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="GunnerGPT API",
    description="Arsenal FC Knowledge Base API",
    version="1.0.0"
)

# Global variables for models and clients
embedding_model = None
chroma_client = None
collection = None

# Configuration
KB_PATH = Path("../arsenal_kb")
COLLECTION_NAME = "gunnergpt_arsenal_kb"
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
CHUNK_SIZE = 600
CHUNK_OVERLAP = 120

# Pydantic models
class QueryRequest(BaseModel):
    query: str
    n_results: int = 5

class QueryResponse(BaseModel):
    results: List[dict]
    query: str

class IngestResponse(BaseModel):
    message: str
    chunks_ingested: int

class HealthResponse(BaseModel):
    status: str
    chroma_connected: bool
    model_loaded: bool


def initialize_models():
    """Initialize embedding model and ChromaDB connection"""
    global embedding_model, chroma_client, collection
    
    try:
        # Load embedding model
        embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
        logger.info(f"Loaded embedding model: {EMBEDDING_MODEL_NAME}")
        
        # Connect to Chroma Cloud
        CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")
        CHROMA_TENANT = os.getenv("CHROMA_TENANT")
        CHROMA_DB = os.getenv("CHROMA_DB")
        
        if not all([CHROMA_API_KEY, CHROMA_TENANT, CHROMA_DB]):
            raise ValueError("Missing Chroma Cloud environment variables")
        
        chroma_client = chromadb.CloudClient(
            tenant=CHROMA_TENANT,
            database=CHROMA_DB,
            api_key=CHROMA_API_KEY
        )
        
        collection = chroma_client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"description": "Arsenal FC knowledge base for GunnerGPT"}
        )
        logger.info("Connected to Chroma Cloud successfully")
        
        return True
    except Exception as e:
        logger.error(f"Failed to initialize models: {e}")
        return False


def chunk_text(text: str, chunk_size: int, overlap: int) -> List[str]:
    """Split text into overlapping character-based chunks"""
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    
    return chunks


def ingest_knowledge_base():
    """Ingest knowledge base files into Chroma"""
    try:
        # Load documents
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
        
        if not documents:
            raise ValueError("No documents found in knowledge base")
        
        # Chunk documents
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
        
        # Generate embeddings
        texts = [doc["text"] for doc in chunked_documents]
        embeddings = embedding_model.encode(
            texts,
            show_progress_bar=True,
            normalize_embeddings=True,
        )
        
        # Clear existing collection and upload new data
        collection.delete()
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
        
        return len(chunked_documents)
        
    except Exception as e:
        logger.error(f"Ingestion failed: {e}")
        raise


@app.on_event("startup")
async def startup_event():
    """Initialize models on startup"""
    success = initialize_models()
    if not success:
        logger.warning("Failed to initialize models on startup")


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy" if chroma_client and embedding_model else "unhealthy",
        chroma_connected=chroma_client is not None,
        model_loaded=embedding_model is not None
    )


@app.post("/ingest", response_model=IngestResponse)
async def trigger_ingestion(background_tasks: BackgroundTasks):
    """Trigger knowledge base ingestion"""
    if not chroma_client or not embedding_model:
        raise HTTPException(status_code=503, detail="Services not initialized")
    
    try:
        # Run ingestion in background
        def ingest_task():
            chunks_count = ingest_knowledge_base()
            logger.info(f"Successfully ingested {chunks_count} chunks")
        
        background_tasks.add_task(ingest_task)
        
        return IngestResponse(
            message="Ingestion started successfully",
            chunks_ingested=0  # Will be updated when task completes
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")


@app.post("/ingest/sync", response_model=IngestResponse)
async def trigger_ingestion_sync():
    """Trigger knowledge base ingestion synchronously"""
    if not chroma_client or not embedding_model:
        raise HTTPException(status_code=503, detail="Services not initialized")
    
    try:
        chunks_count = ingest_knowledge_base()
        return IngestResponse(
            message="Ingestion completed successfully",
            chunks_ingested=chunks_count
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")


@app.post("/query", response_model=QueryResponse)
async def query_knowledge_base(request: QueryRequest):
    """Query the knowledge base"""
    if not chroma_client or not embedding_model:
        raise HTTPException(status_code=503, detail="Services not initialized")
    
    try:
        # Generate query embedding
        query_embedding = embedding_model.encode(
            [request.query],
            normalize_embeddings=True,
        )
        
        # Query Chroma
        results = collection.query(
            query_embeddings=query_embedding.tolist(),
            n_results=request.n_results,
        )
        
        # Format results
        formatted_results = []
        for i in range(len(results['documents'][0])):
            formatted_results.append({
                "text": results['documents'][0][i],
                "metadata": results['metadatas'][0][i],
                "distance": results['distances'][0][i] if 'distances' in results else None,
            })
        
        return QueryResponse(
            results=formatted_results,
            query=request.query
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
