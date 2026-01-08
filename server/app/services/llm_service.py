"""
LLM service for Hugging Face Inference API integration with rate limiting
"""

import asyncio
import time
import logging
from typing import Optional, Dict, Any
from huggingface_hub import InferenceClient
from fastapi import HTTPException
from ..core.config import settings
from ..core.rag_logger import RAGLogger

logger = logging.getLogger(__name__)


class RateLimiter:
    """Rate limiter for API calls"""
    
    def __init__(self, per_minute: int, per_day: int):
        self.per_minute = per_minute
        self.per_day = per_day
        self.requests = []
        self.daily_count = 0
        self.daily_reset_time = time.time() + (24 * 60 * 60)  # 24 hours from now
    
    async def acquire(self) -> bool:
        """Check if request can be made"""
        current_time = time.time()
        
        # Reset daily counter if needed
        if current_time >= self.daily_reset_time:
            self.daily_count = 0
            self.daily_reset_time = current_time + (24 * 60 * 60)
        
        # Clean old requests (older than 1 minute)
        self.requests = [req_time for req_time in self.requests if current_time - req_time < 60]
        
        # Check rate limits
        if len(self.requests) >= self.per_minute:
            wait_time = 60 - (current_time - self.requests[0])
            logger.warning(f"Rate limit reached. Wait {wait_time:.1f} seconds")
            return False
        
        if self.daily_count >= self.per_day:
            logger.warning("Daily rate limit reached")
            return False
        
        # Record this request
        self.requests.append(current_time)
        self.daily_count += 1
        return True


class LLMService:
    """Service for LLM interactions with Hugging Face Inference API"""
    
    def __init__(self):
        # HF Free Tier has generous but variable limits. We'll set a safe default.
        self.rate_limiter = RateLimiter(
            per_minute=20,
            per_day=1000
        )
        self._client: Optional[InferenceClient] = None
        self._initialized = False
    
    async def initialize(self):
        """Initialize the Hugging Face client"""
        try:
            if not settings.huggingface_api_key:
                logger.warning("Hugging Face API key not provided. LLM features will be disabled.")
                return False
            
            # Initialize client with API key
            self._client = InferenceClient(
                model=settings.huggingface_model,
                token=settings.huggingface_api_key
            )
            self._initialized = True
            logger.info(f"Initialized Hugging Face client with model: {settings.huggingface_model}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize Hugging Face client: {e}")
            return False
    
    async def generate_response(self, prompt: str) -> Optional[str]:
        """
        Generate response using Hugging Face Inference API with rate limiting
        
        Args:
            prompt: The prompt to send to the LLM
            
        Returns:
            Generated response or None if failed
        """
        if not self._initialized:
            if not await self.initialize():
                return None
        
        # Proactive rate limit check disabled by user request
        # if not await self.rate_limiter.acquire():
        #     return None
        
        try:
            RAGLogger.log_llm_call(len(prompt), settings.huggingface_model)
            
            # Generate response using chat completion pattern
            messages = [{"role": "user", "content": prompt}]
            
            # Hugging Face Inference API call
            response = await asyncio.to_thread(
                self._client.chat.completions.create,
                messages=messages,
                max_tokens=1000,
                temperature=0.7
            )
            
            text = ""
            if response and response.choices:
                text = response.choices[0].message.content
            
            if text:
                cleaned_text = self._clean_response(text)
                logger.info(f"Generated response of length: {len(cleaned_text)}")
                return cleaned_text
            else:
                logger.warning("Empty response from Hugging Face API")
                return None
                
        except Exception as e:
            error_message = str(e)
            logger.error(f"Hugging Face API error: {error_message}")
            
            # Check for specific HF errors
            if "Too Many Requests" in error_message or "429" in error_message:
                logger.warning("Hugging Face API quota exceeded")
                raise HTTPException(status_code=429, detail="Hugging Face rate limit exceeded. Please try again later.")
            
            return None
    
    def _clean_response(self, text: str) -> str:
        """Clean and format the response text"""
        if not text:
            return ""
        
        # Remove extra whitespace and newlines
        cleaned = text.strip()
        
        # Remove any markdown code blocks if present
        if cleaned.startswith("```"):
            lines = cleaned.split('\n')
            if len(lines) > 1:
                cleaned = '\n'.join(lines[1:-1]) if lines[-1].startswith("```") else '\n'.join(lines[1:])
        
        return cleaned
    
    async def is_available(self) -> bool:
        """Check if LLM service is available"""
        return self._initialized and settings.gemini_api_key is not None


# Global LLM service instance
llm_service = LLMService()
