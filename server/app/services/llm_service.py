"""
LLM service for Gemini API integration with rate limiting
"""

import asyncio
import time
import logging
from typing import Optional, Dict, Any
import google.genai as genai
from fastapi import HTTPException
from ..core.config import settings

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
    """Service for LLM interactions with Gemini API"""
    
    def __init__(self):
        self.rate_limiter = RateLimiter(
            per_minute=settings.gemini_rate_limit_per_minute,
            per_day=settings.gemini_rate_limit_per_day
        )
        self._client: Optional[genai.GenerativeModel] = None
        self._initialized = False
    
    async def initialize(self):
        """Initialize the Gemini client"""
        try:
            if not settings.gemini_api_key:
                logger.warning("Gemini API key not provided. LLM features will be disabled.")
                return False
            
            # Initialize client with API key
            self._client = genai.Client(api_key=settings.gemini_api_key)
            self._initialized = True
            logger.info(f"Initialized Gemini client with model: {settings.gemini_model}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize Gemini client: {e}")
            return False
    
    async def generate_response(self, prompt: str) -> Optional[str]:
        """
        Generate response using Gemini API with rate limiting
        
        Args:
            prompt: The prompt to send to the LLM
            
        Returns:
            Generated response or None if failed
        """
        if not self._initialized:
            if not await self.initialize():
                return None
        
        # Check rate limit
        if not await self.rate_limiter.acquire():
            return None
        
        try:
            # Generate response using new SDK pattern
            response = await asyncio.to_thread(
                self._client.models.generate_content,
                model=settings.gemini_model,
                contents=prompt
            )
            
            # Robustly extract text following your JavaScript pattern
            text = ""
            if response and hasattr(response, 'text'):
                text = response.text
            elif (hasattr(response, 'candidates') and 
                  response.candidates and 
                  len(response.candidates) > 0 and
                  hasattr(response.candidates[0], 'content') and
                  hasattr(response.candidates[0].content, 'parts') and
                  len(response.candidates[0].content.parts) > 0 and
                  hasattr(response.candidates[0].content.parts[0], 'text')):
                text = response.candidates[0].content.parts[0].text
            
            if text:
                cleaned_text = self._clean_response(text)
                logger.info(f"Generated response of length: {len(cleaned_text)}")
                return cleaned_text
            else:
                logger.warning("Empty response from Gemini API")
                return None
                
        except Exception as e:
            error_message = str(e)
            logger.error(f"Gemini API error: {error_message}")
            
            # Check for quota exceeded error
            if ("quota exceeded" in error_message.lower() or 
                "429" in error_message or 
                "resource exhausted" in error_message.lower()):
                logger.warning("API quota exceeded")
                raise HTTPException(status_code=429, detail="Rate limit exceeded. Please try again later.")
            
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
