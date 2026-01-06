"""
Embedding generation and management
"""

from typing import List
from sentence_transformers import SentenceTransformer
from ..core.startup import get_embedding_model


class EmbeddingService:
    """Service for handling text embeddings"""
    
    def __init__(self):
        self.model = None
    
    async def initialize(self):
        """Initialize the embedding model"""
        self.model = get_embedding_model()
    
    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts"""
        if self.model is None:
            await self.initialize()
        
        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True,
            show_progress_bar=True
        )
        return embeddings.tolist()
    
    async def generate_query_embedding(self, query: str) -> List[float]:
        """Generate embedding for a single query"""
        if self.model is None:
            await self.initialize()
        
        embedding = self.model.encode(
            [query],
            normalize_embeddings=True
        )
        return embedding.tolist()[0]


# Global embedding service instance
embedding_service = EmbeddingService()
