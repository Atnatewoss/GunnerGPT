"""
Vector store abstraction for ChromaDB
"""

from typing import List, Dict, Any, Optional
from ..core.startup import get_chroma_collection
from ..core.config import settings


class VectorStore:
    """Abstraction layer for ChromaDB vector operations"""
    
    def __init__(self):
        self.collection = None
    
    async def initialize(self):
        """Initialize the vector store connection"""
        self.collection = get_chroma_collection()
    
    async def add_documents(
        self,
        documents: List[str],
        embeddings: List[List[float]],
        metadatas: List[Dict[str, Any]],
        ids: List[str]
    ):
        """Add documents to the vector store"""
        if self.collection is None:
            await self.initialize()
        
        # Clear existing collection - use empty where clause to matches all
        try:
            # First try getting all IDs
            get_result = self.collection.get()
            if get_result and get_result['ids']:
                self.collection.delete(ids=get_result['ids'])
        except Exception as e:
            # Fallback or ignore if empty
            pass
        
        # Add new documents
        self.collection.add(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
    
    async def query(
        self,
        query_embedding: List[float],
        n_results: int = 5,
        category: str = "all"
    ) -> Dict[str, Any]:
        """Query the vector store for similar documents"""
        if self.collection is None:
            await self.initialize()
        
        # Build where clause for category filtering
        where_clause = None
        if category and category != "all":
            where_clause = {"category": category}
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where=where_clause
        )
        
        return results
    
    async def get_collection_info(self) -> Dict[str, Any]:
        """Get information about the collection"""
        if self.collection is None:
            await self.initialize()
        
        try:
            count = self.collection.count()
            return {
                "name": settings.collection_name,
                "count": count,
                "metadata": self.collection.metadata
            }
        except Exception:
            return {
                "name": settings.collection_name,
                "count": 0,
                "metadata": None
            }


# Global vector store instance
vector_store = VectorStore()
