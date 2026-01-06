"""
Pydantic models for chat and query operations
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    """Request model for querying the knowledge base"""
    query: str = Field(..., description="The search query")
    n_results: int = Field(default=5, ge=1, le=20, description="Number of results to return")


class DocumentResult(BaseModel):
    """Model for a single document result"""
    text: str = Field(..., description="The document text")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Document metadata")
    distance: Optional[float] = Field(None, description="Similarity distance")


class QueryResponse(BaseModel):
    """Response model for query results"""
    results: List[DocumentResult] = Field(..., description="List of retrieved documents")
    query: str = Field(..., description="The original query")
    total_results: int = Field(..., description="Total number of results returned")


class IngestResponse(BaseModel):
    """Response model for ingestion operations"""
    message: str = Field(..., description="Status message")
    chunks_ingested: int = Field(..., description="Number of chunks ingested")


class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str = Field(..., description="Overall health status")
    chroma_connected: bool = Field(..., description="ChromaDB connection status")
    model_loaded: bool = Field(..., description="Embedding model status")
    collection_info: Optional[Dict[str, Any]] = Field(None, description="Collection information")


class ChatRequest(BaseModel):
    """Request model for chat interactions"""
    message: str = Field(..., description="User message")
    context_length: int = Field(default=2000, ge=500, le=4000, description="Context length for RAG")


class ChatResponse(BaseModel):
    """Response model for chat interactions"""
    response: str = Field(..., description="AI response")
    sources: List[DocumentResult] = Field(..., description="Source documents used")
    query: str = Field(..., description="Original user query")
