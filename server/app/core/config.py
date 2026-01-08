"""
Application configuration settings
"""

import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import Optional


# Get the path to the .env file
env_path = Path(__file__).parent.parent.parent / ".env"


class Settings(BaseSettings):
    """Application settings"""
    
    # Knowledge Base
    kb_path: Path = Path("../arsenal_kb")
    collection_name: str = "gunnergpt_arsenal_kb"
    
    # Embedding Model
    embedding_model_name: str = "all-MiniLM-L6-v2"
    chunk_size: int = 600
    chunk_overlap: int = 120
    
    # Chroma Cloud
    chroma_api_key: Optional[str] = None
    chroma_tenant: Optional[str] = None
    chroma_db: Optional[str] = None
    
    # LLM APIs
    gemini_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    huggingface_api_key: Optional[str] = None
    huggingface_model: str = "mistralai/Mistral-7B-Instruct-v0.2"
    # gemini_model: str = "gemini-2.0-flash"  # Keep for reference but not primary
    gemini_rate_limit_per_minute: int = 15
    gemini_rate_limit_per_day: int = 1500
    
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_title: str = "GunnerGPT API"
    api_description: str = "Arsenal FC Knowledge Base API"
    api_version: str = "1.0.0"
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = env_path
        case_sensitive = False


# Global settings instance
settings = Settings()
