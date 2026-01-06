"""
Chat and query API routes
"""

import logging
import time
from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from ..models.chat import (
    QueryRequest, QueryResponse, DocumentResult,
    ChatRequest, ChatResponse, IngestResponse
)
from ..services.chat_service import ChatService
from ..rag.ingest import ingest_knowledge_base
from ..rag.retriever import retrieve_documents
from ..core.startup import embedding_model, collection

logger = logging.getLogger(__name__)

# Rate limiter: 10 requests per minute per IP
limiter = Limiter(key_func=get_remote_address, default_limits=["10/minute"])

router = APIRouter(tags=["chat", "query"])
chat_service = ChatService()


@router.post("/query", response_model=QueryResponse)
@limiter.limit("10/minute")
async def query_knowledge_base(request: QueryRequest, http_request: Request):
    """Query the knowledge base with semantic search"""
    if not embedding_model or not collection:
        raise HTTPException(status_code=503, detail="Services not initialized")
    
    try:
        # Log the request with category info
        logger.info(f"Query request from {get_remote_address(http_request)}: '{request.query}'")
        
        # Retrieve documents
        documents = await retrieve_documents(request.query, request.n_results)
        
        # Convert to DocumentResult models
        results = [
            DocumentResult(
                text=doc["text"],
                metadata=doc["metadata"],
                distance=doc["distance"]
            )
            for doc in documents
        ]
        
        return QueryResponse(
            results=results,
            query=request.query,
        )
        
    except Exception as e:
        logger.error(f"Query failed: {e}")
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@router.post("/chat", response_model=ChatResponse)
async def chat_with_rag(request: ChatRequest):
    """Chat with the AI using RAG (Retrieval-Augmented Generation)"""
    if not embedding_model or not collection:
        raise HTTPException(status_code=503, detail="Services not initialized")
    
    try:
        response = await chat_service.process_query(request)
        return response
        
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


@router.post("/ingest", response_model=IngestResponse)
async def trigger_ingestion(background_tasks: BackgroundTasks):
    """Trigger knowledge base ingestion in background"""
    if not embedding_model or not collection:
        raise HTTPException(status_code=503, detail="Services not initialized")
    
    try:
        # Run ingestion in background
        def ingest_task():
            import asyncio
            chunks_count = asyncio.run(ingest_knowledge_base())
            logger.info(f"Successfully ingested {chunks_count} chunks")
        
        background_tasks.add_task(ingest_task)
        
        return IngestResponse(
            message="Ingestion started successfully",
            chunks_ingested=0
        )
        
    except Exception as e:
        logger.error(f"Ingestion trigger failed: {e}")
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")


@router.post("/ingest/sync", response_model=IngestResponse)
async def trigger_ingestion_sync():
    """Trigger knowledge base ingestion synchronously"""
    if not embedding_model or not collection:
        raise HTTPException(status_code=503, detail="Services not initialized")
    
    try:
        chunks_count = await ingest_knowledge_base()
        return IngestResponse(
            message="Ingestion completed successfully",
            chunks_ingested=chunks_count
        )
        
    except Exception as e:
        logger.error(f"Sync ingestion failed: {e}")
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")
