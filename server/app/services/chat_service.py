"""
Business logic for chat operations
"""

import logging
from typing import List
from ..rag.retriever import retrieve_documents
from ..rag.prompts import format_chat_prompt, SYSTEM_PROMPT
from ..models.chat import DocumentResult, ChatRequest, ChatResponse

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
            
            # Generate response (placeholder for now - could integrate with LLM)
            response = self._generate_response(request.message, context)
            
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
            raise
    
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
    
    def _generate_response(self, question: str, context: str) -> str:
        """
        Generate response based on context and question
        This is a placeholder implementation that could be enhanced with an LLM
        """
        if not context.strip():
            return "I don't have specific information about that in my knowledge base. Could you try asking about Arsenal's history, players, or recent matches?"
        
        # Simple rule-based response for demonstration
        question_lower = question.lower()
        
        if "manager" in question_lower or "coach" in question_lower:
            return "Based on the information available, Mikel Arteta is the current manager of Arsenal FC. He has been in charge since December 2019 and has led the team to significant success including the FA Cup and Community Shield victories."
        
        elif "history" in question_lower or "founded" in question_lower:
            return "Arsenal Football Club was founded in 1886 and is one of England's most successful clubs. The team has won numerous league titles, FA Cups, and European trophies throughout its rich history."
        
        elif "stadium" in question_lower or "emirates" in question_lower:
            return "Arsenal currently plays at the Emirates Stadium, which opened in 2006. The stadium has a capacity of over 60,000 spectators and is one of the premier football venues in England."
        
        else:
            # Generic response based on available context
            return f"Based on the Arsenal knowledge base I have access to, here's what I can tell you about your question: {question}. The information available suggests this relates to Arsenal FC, one of England's most historic football clubs."
