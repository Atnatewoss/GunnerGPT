"""
Business logic for chat operations
"""

import logging
from typing import List
from ..rag.retriever import retrieve_documents
from ..rag.prompts import format_chat_prompt, SYSTEM_PROMPT
from ..models.chat import DocumentResult, ChatRequest, ChatResponse
from .llm_service import llm_service

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
            # Retrieve relevant documents
            documents = await retrieve_documents(
                query=request.message,
                n_results=5
            )
            
            # Format context from retrieved documents
            context = self._format_context(documents, request.context_length)
            
            # Generate response using LLM
            response = await self._generate_llm_response(request.message, context)
            
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
                query=request.message
            )
            
        except Exception as e:
            logger.error(f"Chat processing failed: {e}")
            # Return fallback response
            return ChatResponse(
                response=self._get_fallback_response(request.message),
                sources=[],
                query=request.message
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
        
        return "\n".join(context_parts)
    
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
    
    def _get_fallback_response(self, question: str) -> str:
        """Get fallback response when LLM is unavailable"""
        question_lower = question.lower()
        
        if "manager" in question_lower or "coach" in question_lower:
            return "Based on the information available, Mikel Arteta is the current manager of Arsenal FC. He has been in charge since December 2019 and has led the team to significant success including FA Cup and Community Shield victories."
        
        elif "history" in question_lower or "founded" in question_lower:
            return "Arsenal Football Club was founded in 1886 and is one of England's most successful clubs. The team has won numerous league titles, FA Cups, and European trophies throughout its rich history."
        
        elif "stadium" in question_lower or "emirates" in question_lower:
            return "Arsenal currently plays at Emirates Stadium, which opened in 2006. The stadium has a capacity of over 60,000 spectators and is one of the premier football venues in England."
        
        else:
            return f"I understand you're asking about: '{question}'. While I have access to Arsenal's knowledge base, I'm currently experiencing technical difficulties with my advanced AI capabilities. You can try asking about Arsenal's history, players, manager, or stadium for basic information."
