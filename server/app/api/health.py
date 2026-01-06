"""
Health check API routes
"""

import logging
from fastapi import APIRouter, HTTPException
from ..models.chat import HealthResponse
from ..core.startup import embedding_model, collection
from ..rag.vectorstore import vector_store

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/", response_model=HealthResponse)
async def health_check():
    """Comprehensive health check endpoint"""
    try:
        # Check embedding model
        model_loaded = embedding_model is not None
        
        # Check Chroma connection
        chroma_connected = collection is not None
        
        # Get collection info if available
        collection_info = None
        if chroma_connected:
            try:
                collection_info = await vector_store.get_collection_info()
            except Exception as e:
                logger.warning(f"Failed to get collection info: {e}")
        
        # Determine overall status
        status = "healthy" if model_loaded and chroma_connected else "unhealthy"
        
        return HealthResponse(
            status=status,
            chroma_connected=chroma_connected,
            model_loaded=model_loaded,
            collection_info=collection_info
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")
