"""
Business logic for chat operations
"""

import logging
import time
from typing import List
from fastapi import HTTPException
from ..rag.retriever import retrieve_documents
from ..rag.prompts import format_chat_prompt, SYSTEM_PROMPT
from ..models.chat import DocumentResult, ChatRequest, ChatResponse
from .llm_service import llm_service
from ..core.rag_logger import RAGLogger

logger = logging.getLogger(__name__)


class ChatService:
    """Service for handling chat interactions with RAG"""
    
    async def process_query(self, request: ChatRequest) -> ChatResponse:
        """
        Process a chat query using RAG
        
        Args:
            request: Chat request with message and context settings
            
        Returns:
            Chat response with AI answer and sources
        """
        try:
            RAGLogger.log_query(request.message)
            RAGLogger.log_step("ORCHESTRATION", "Processing query via RAG pipeline")
            
            start_time = time.time()
            
            # Retrieve relevant documents
            documents = await retrieve_documents(
                query=request.message,
                n_results=5
            )
            
            # Format context from retrieved documents
            context = self._format_context(documents, request.context_length)
            
            # Generate response using LLM
            response = await self._generate_llm_response(request.message, context)
            
            # Calculate metrics
            total_time = (time.time() - start_time) * 1000  # ms
            
            RAGLogger.log_llm_response(response, total_time)
            
            # Calculate average relevance (1 - distance)
            avg_relevance = 0.0
            if documents:
                distances = [doc.get("distance", 1.0) for doc in documents]
                similarities = [1 - d for d in distances]
                avg_relevance = sum(similarities) / len(similarities)
            
            # Convert to DocumentResult models
            source_results = [
                DocumentResult(
                    text=doc["text"],
                    metadata=doc["metadata"],
                    distance=doc["distance"]
                )
                for doc in documents
            ]
            
            return ChatResponse(
                response=response,
                sources=source_results,
                query=request.message,
                evaluation_metrics={
                    "latency": f"{int(total_time)}ms",
                    "relevance": f"{avg_relevance:.2f}",
                    "context_length": len(context.split())  # approximate token count
                }
            )
            
        except HTTPException as he:
            raise he
            
        except Exception as e:
            logger.error(f"Chat processing failed: {e}")
            # Return fallback response
            return ChatResponse(
                response=self._get_fallback_response(request.message),
                sources=[],
                query=request.message,
                evaluation_metrics=None
            )
    
    def _format_context(self, documents: List[dict], max_length: int) -> str:
        """Format retrieved documents into context string"""
        context_parts = []
        current_length = 0
        
        for doc in documents:
            doc_text = f"Source: {doc['metadata'].get('source', 'Unknown')}\n{doc['text']}\n"
            
            if current_length + len(doc_text) <= max_length:
                context_parts.append(doc_text)
                current_length += len(doc_text)
            else:
                # Add partial document if space allows
                remaining_space = max_length - current_length
                if remaining_space > 100:  # Only add if meaningful space remains
                    truncated_text = doc_text[:remaining_space - 3] + "..."
                    context_parts.append(truncated_text)
                break
        
                if remaining_space > 100:  # Only add if meaningful space remains
                    truncated_text = doc_text[:remaining_space - 3] + "..."
                    context_parts.append(truncated_text)
                break
        
        final_context = "\n".join(context_parts)
        RAGLogger.log_context_assembly(final_context, len(final_context.split()))
        return final_context
    
    async def _generate_llm_response(self, question: str, context: str) -> str:
        """Generate response using LLM service"""
        if not await llm_service.is_available():
            return self._get_fallback_response(question)
        
        # Format prompt for LLM
        prompt = format_chat_prompt(context, question)
        
        # Generate response
        response = await llm_service.generate_response(prompt)
        
        if response:
            return response
        else:
            logger.warning("LLM generation failed, using fallback")
            return self._get_fallback_response(question)
    
    def _get_fallback_response(self, query: str) -> str:
        """Provide a simple fallback if the LLM fails."""
        # Simple error message that the frontend can handle or display gracefully
        return "I'm currently unable to generate a response due to high traffic or a temporary system issue. Please try again in a moment."
