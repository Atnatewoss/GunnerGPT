"""
Document retrieval functionality
"""

import logging
from typing import List, Dict, Any
from .embeddings import embedding_service
from .vectorstore import vector_store

logger = logging.getLogger(__name__)


async def retrieve_documents(query: str, n_results: int = 5, category: str = "all") -> List[Dict[str, Any]]:
    """
    Retrieve relevant documents for a given query
    
    Args:
        query: The search query
        n_results: Number of results to return
        category: Category scope for retrieval
        
    Returns:
        List of retrieved documents with metadata
    """
    try:
        # Generate query embedding
        query_embedding = await embedding_service.generate_query_embedding(query)
        
        # Query vector store with category filter
        results = await vector_store.query(query_embedding, n_results, category=category)
        
        # Format results
        formatted_results = []
        if results['documents'] and results['documents'][0]:
            for i in range(len(results['documents'][0])):
                formatted_results.append({
                    "text": results['documents'][0][i],
                    "metadata": results['metadatas'][0][i] if results['metadatas'] else {},
                    "distance": results['distances'][0][i] if results.get('distances') else None,
                })
        
        logger.info(f"Retrieved {len(formatted_results)} documents for query: {query[:50]}...")
        return formatted_results
        
    except Exception as e:
        logger.error(f"Document retrieval failed: {e}")
        raise
