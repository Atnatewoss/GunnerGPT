"""
Test client for GunnerGPT FastAPI Backend
"""

import requests
import json

# API base URL
BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_ingest():
    """Test ingestion endpoint"""
    print("Testing ingestion endpoint...")
    response = requests.post(f"{BASE_URL}/ingest/sync")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_query():
    """Test query endpoint"""
    print("Testing query endpoint...")
    query_data = {
        "query": "Who is Arsenal's current manager?",
        "n_results": 3
    }
    response = requests.post(
        f"{BASE_URL}/query",
        json=query_data
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

if __name__ == "__main__":
    print("GunnerGPT API Test Client")
    print("=" * 30)
    
    try:
        test_health()
        test_query()
        # Uncomment to test ingestion (this will re-ingest all data)
        # test_ingest()
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API server.")
        print("Make sure the FastAPI server is running on http://localhost:8000")
        print("Run: python main.py")
