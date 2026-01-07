"""
Standalone RAG Pipeline Runner

This script allows you to test the RAG system independently without
running the full web server. Perfect for demonstrations and evaluations.

Usage:
    python run_rag_pipeline.py "Your question here"
    or
    python run_rag_pipeline.py (for interactive mode)
"""

import asyncio
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.startup import initialize_services
from app.core.rag_logger import RAGLogger
from app.services.chat_service import ChatService
from app.models.chat import ChatRequest


async def run_rag_pipeline(query: str):
    """
    Run the RAG pipeline for a single query and display results.
    
    Args:
        query: The question to process through RAG
    """
    print("\n" + "="*80)
    print("🚀 STANDALONE RAG PIPELINE RUNNER")
    print("="*80 + "\n")
    
    # Initialize services
    print("📦 Initializing RAG components...")
    await initialize_services()
    print("✅ Initialization complete!\n")
    
    # Create chat service instance
    chat_service = ChatService()
    
    # Create request
    request = ChatRequest(
        message=query,
        context_length=4000
    )
    
    # Process query through RAG pipeline
    try:
        response = await chat_service.process_query(request)
        
        # Display final results summary
        print("\n" + "="*80)
        print("📊 FINAL RESULTS SUMMARY")
        print("="*80)
        print(f"\n📝 QUERY: {response.query}")
        print(f"\n💬 RESPONSE:\n{response.response}")
        print(f"\n📚 SOURCES USED: {len(response.sources)}")
        
        if response.evaluation_metrics:
            print("\n📈 METRICS:")
            for key, value in response.evaluation_metrics.items():
                print(f"   - {key}: {value}")
        
        print("\n" + "="*80 + "\n")
        
        return response
        
    except Exception as e:
        RAGLogger.log_error(str(e))
        print(f"\n❌ Pipeline failed: {e}\n")
        raise


async def interactive_mode():
    """Run in interactive mode, accepting multiple queries."""
    print("\n" + "="*80)
    print("🎯 INTERACTIVE RAG PIPELINE MODE")
    print("="*80)
    print("\nType your questions below. Type 'exit' or 'quit' to stop.\n")
    
    # Initialize once
    print("📦 Initializing RAG components...")
    await initialize_services()
    print("✅ Initialization complete!\n")
    
    chat_service = ChatService()
    
    while True:
        try:
            # Get query from user
            query = input("\n🔍 Enter your question: ").strip()
            
            if not query:
                continue
                
            if query.lower() in ['exit', 'quit', 'q']:
                print("\n👋 Exiting RAG pipeline. Goodbye!\n")
                break
            
            # Process query
            request = ChatRequest(message=query, context_length=4000)
            response = await chat_service.process_query(request)
            
            # Display summary
            print("\n" + "-"*80)
            print("📊 RESULTS")
            print("-"*80)
            print(f"\n💬 RESPONSE:\n{response.response}")
            print(f"\n📚 Sources: {len(response.sources)}")
            if response.evaluation_metrics:
                print(f"⚡ Latency: {response.evaluation_metrics.get('latency', 'N/A')}")
                print(f"🎯 Relevance: {response.evaluation_metrics.get('relevance', 'N/A')}")
            print("-"*80)
            
        except KeyboardInterrupt:
            print("\n\n👋 Interrupted. Exiting...\n")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}\n")
            continue


def main():
    """Main entry point for the standalone RAG runner."""
    
    # Check if query provided as argument
    if len(sys.argv) > 1:
        # Single query mode
        query = " ".join(sys.argv[1:])
        asyncio.run(run_rag_pipeline(query))
    else:
        # Interactive mode
        asyncio.run(interactive_mode())


if __name__ == "__main__":
    main()
