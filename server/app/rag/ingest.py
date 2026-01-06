"""
Knowledge base ingestion functionality
"""

import logging
from pathlib import Path
from typing import List, Dict, Any
from ..core.config import settings
from .embeddings import embedding_service
from .vectorstore import vector_store

logger = logging.getLogger(__name__)


def chunk_text(text: str, chunk_size: int, overlap: int) -> List[str]:
    """Split text into overlapping character-based chunks"""
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    
    return chunks


async def load_documents() -> List[Dict[str, Any]]:
    """Load documents from the knowledge base directory"""
    documents = []
    
    for txt_file in settings.kb_path.rglob("*.txt"):
        try:
            with open(txt_file, "r", encoding="utf-8") as f:
                text = f.read().strip()
            
            if not text:
                continue
            
            documents.append({
                "text": text,
                "source": txt_file.name,
                "category": txt_file.parent.name,
            })
        except Exception as e:
            logger.error(f"Failed to load file {txt_file}: {e}")
    
    if not documents:
        raise ValueError("No documents found in knowledge base")
    
    logger.info(f"Loaded {len(documents)} documents from {settings.kb_path}")
    return documents


async def chunk_documents(documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Chunk documents into semantic units"""
    chunked_documents = []
    
    for doc in documents:
        chunks = chunk_text(
            doc["text"], 
            settings.chunk_size, 
            settings.chunk_overlap
        )
        
        for i, chunk in enumerate(chunks):
            chunked_documents.append({
                "text": chunk,
                "source": doc["source"],
                "category": doc["category"],
                "chunk_id": i,
            })
    
    logger.info(f"Created {len(chunked_documents)} chunks from {len(documents)} documents")
    return chunked_documents


async def ingest_knowledge_base() -> int:
    """Main ingestion function"""
    try:
        # Load documents
        documents = await load_documents()
        
        # Chunk documents
        chunked_documents = await chunk_documents(documents)
        
        # Generate embeddings
        texts = [doc["text"] for doc in chunked_documents]
        embeddings = await embedding_service.generate_embeddings(texts)
        
        # Prepare metadata and IDs
        metadatas = [
            {
                "source": doc["source"],
                "category": doc["category"],
                "chunk_id": doc["chunk_id"],
            }
            for doc in chunked_documents
        ]
        
        ids = [
            f"{doc['source']}_{doc['chunk_id']}"
            for doc in chunked_documents
        ]
        
        # Add to vector store
        await vector_store.add_documents(
            documents=texts,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
        
        logger.info(f"Successfully ingested {len(chunked_documents)} chunks")
        return len(chunked_documents)
        
    except Exception as e:
        logger.error(f"Ingestion failed: {e}")
        raise
