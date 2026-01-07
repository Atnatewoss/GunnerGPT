
import logging
import json
from typing import List, Dict, Any

# Configure a specific handler for this logger to ensure it prints to stdout
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RAG_TRACE")

class RAGLogger:
    """
    Specialized logger for visualizing the RAG pipeline steps in the terminal.
    Designed to provide "proof of work" by showing inputs, retrieval, and outputs.
    """

    @staticmethod
    def print_separator(char="=", length=80):
        print(f"\n{char * length}\n")

    @staticmethod
    def log_step(step_name: str, description: str = ""):
        RAGLogger.print_separator("-")
        print(f"🔄 STEP: {step_name}")
        if description:
            print(f"ℹ️  {description}")
        print("")

    @staticmethod
    def log_query(query: str):
        RAGLogger.print_separator("=")
        print(f"🔍 INCOMING QUERY: {query}")
        RAGLogger.print_separator("=")

    @staticmethod
    def log_retrieval_start(query_embedding_len: int, n_results: int):
        print(f"📡 RETRIEVAL STARTED")
        print(f"   - Query Embedding Length: {query_embedding_len}")
        print(f"   - Requested Results: {n_results}")

    @staticmethod
    def log_retrieved_documents(documents: List[Dict[str, Any]]):
        print(f"\n📚 DOCUMENTS RETRIEVED: {len(documents)}")
        for i, doc in enumerate(documents):
            score = doc.get('distance', 'N/A')
            similarity = f"{(1 - doc.get('distance', 1.0)):.4f}" if isinstance(score, (int, float)) else "N/A"
            source = doc.get('metadata', {}).get('source', 'Unknown')
            text_preview = doc.get('text', '')[:100].replace('\n', ' ')
            
            print(f"   [{i+1}] Source: {source}")
            print(f"       Similarity: {similarity} (Dist: {score})")
            print(f"       Preview: {text_preview}...")

    @staticmethod
    def log_context_assembly(context: str, token_estimate: int):
        print(f"\n🧩 CONTEXT ASSEMBLED ({token_estimate} est. tokens)")
        print(f"   --- BEGIN CONTEXT ---")
        # Print first 500 chars to avoid flooding if huge, or just print all if user wants full transparency
        print(context[:1000] + ("..." if len(context) > 1000 else ""))
        print(f"   --- END CONTEXT ---")

    @staticmethod
    def log_llm_call(prompt_len: int, model: str):
        print(f"\n🤖 LLM GENERATION REQUEST")
        print(f"   - Model: {model}")
        print(f"   - Prompt Length: {prompt_len} chars")

    @staticmethod
    def log_llm_response(response: str, latency_ms: float):
        print(f"\n✨ LLM RESPONSE RECEIVED ({int(latency_ms)}ms)")
        print(f"   --- RESPONSE ---")
        print(response)
        print(f"   --- END RESPONSE ---")
        RAGLogger.print_separator("=")

    @staticmethod
    def log_error(error_msg: str):
        print(f"\n❌ RAG ERROR: {error_msg}")
        RAGLogger.print_separator("!")
