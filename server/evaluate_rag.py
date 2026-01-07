
import asyncio
import os
import sys

# Add the server directory to the python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.config import settings
from app.core.startup import initialize_services, get_chroma_collection, get_embedding_model
from app.rag.vectorstore import vector_store

async def evaluate_rag():
    print("Initializing services...")
    success = await initialize_services()
    if not success:
        print("Failed to initialize services. Check your .env file.")
        return

    test_queries = [
        "Who is the manager of Arsenal?",
        "Tell me about Arsenal's recent form.",
        "What is the stadium capacity?",
        "Key players for Arsenal this season"
    ]

    print("\n--- Starting RAG Evaluation ---\n")
    
    collection = get_chroma_collection()
    print(f"Collection: {collection.name}")
    print(f"Metrics: {collection.metadata}")
    
    for query in test_queries:
        print(f"\nQuery: {query}")
        
        # 1. Embed Query
        model = get_embedding_model()
        query_embedding = model.encode(query).tolist()
        
        # 2. Retrieve
        results = await vector_store.query(query_embedding, n_results=3)
        
        # 3. Analyze Results
        if not results or not results['documents']:
            print("  No results found.")
            continue
            
        documents = results['documents'][0]
        distances = results['distances'][0]
        metadatas = results['metadatas'][0]
        
        for i, (doc, dist, meta) in enumerate(zip(documents, distances, metadatas)):
            # Cosine distance in Chroma is 1 - cosine_similarity
            # So similarity = 1 - distance
            similarity = 1 - dist
            print(f"  Rank {i+1}:")
            print(f"    Similarity: {similarity:.4f} (Distance: {dist:.4f})")
            print(f"    Source: {meta.get('source', 'Unknown')}")
            print(f"    Text: {doc[:150]}...")

    print("\n--- Evaluation Complete ---")

if __name__ == "__main__":
    asyncio.run(evaluate_rag())
