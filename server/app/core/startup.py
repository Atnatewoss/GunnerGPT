"""
Application startup and dependency injection
"""

import logging
from sentence_transformers import SentenceTransformer
import chromadb
from .config import settings

# Configure logging
logging.basicConfig(level=getattr(logging, settings.log_level))
logger = logging.getLogger(__name__)

# Global instances
embedding_model: SentenceTransformer = None
chroma_client = None
collection = None


async def initialize_embedding_model():
    """Initialize the embedding model"""
    global embedding_model
    try:
        embedding_model = SentenceTransformer(settings.embedding_model_name)
        logger.info(f"Loaded embedding model: {settings.embedding_model_name}")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize embedding model: {e}")
        return False


async def initialize_chroma_client():
    """Initialize ChromaDB client"""
    global chroma_client, collection
    try:
        # Check if Chroma Cloud credentials are available
        if not all([settings.chroma_api_key, settings.chroma_tenant, settings.chroma_db]):
            logger.warning("Chroma Cloud credentials not found. ChromaDB features will be disabled.")
            return False
        
        chroma_client = chromadb.CloudClient(
            tenant=settings.chroma_tenant,
            database=settings.chroma_db,
            api_key=settings.chroma_api_key
        )
        
        collection = chroma_client.get_or_create_collection(
            name=settings.collection_name,
            metadata={"description": "Arsenal FC knowledge base for GunnerGPT"}
        )
        logger.info("Connected to Chroma Cloud successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize Chroma client: {e}")
        return False


async def initialize_services():
    """Initialize all services"""
    embedding_success = await initialize_embedding_model()
    chroma_success = await initialize_chroma_client()
    
    # Initialize LLM service
    from ..services.llm_service import llm_service
    llm_success = await llm_service.initialize()
    
    if not embedding_success or not chroma_success:
        logger.warning("Some core services failed to initialize")
    
    if not llm_success:
        logger.warning("LLM service failed to initialize - fallback responses will be used")
    
    overall_success = embedding_success and chroma_success
    if overall_success:
        logger.info("Core services initialized successfully")
    else:
        logger.warning("Some services failed to initialize on startup")
    
    return overall_success


def get_embedding_model():
    """Get the embedding model instance"""
    if embedding_model is None:
        raise RuntimeError("Embedding model not initialized")
    return embedding_model


def get_chroma_collection():
    """Get the Chroma collection instance"""
    if collection is None:
        raise RuntimeError("Chroma collection not initialized")
    return collection
