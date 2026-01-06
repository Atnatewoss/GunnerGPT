# GunnerGPT FastAPI Server

A FastAPI backend for managing and querying the Arsenal FC knowledge base.

## Directory Structure

```
server/
├── main.py           # Main FastAPI application
├── requirements.txt  # Server dependencies
├── test_client.py   # Test client script
└── README.md        # This file
```

## Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables in the root `.env` file:
```
CHROMA_API_KEY=your_chroma_api_key
CHROMA_TENANT=your_tenant
CHROMA_DB=your_database
```

4. Start the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /health
```

Returns the health status of the service.

### Ingest Knowledge Base

#### Synchronous Ingestion
```
POST /ingest/sync
```

Triggers knowledge base ingestion and waits for completion.

#### Asynchronous Ingestion
```
POST /ingest
```

Triggers knowledge base ingestion in the background.

### Query Knowledge Base
```
POST /query
```

Query the knowledge base with semantic search.

**Request Body:**
```json
{
  "query": "Who is Arsenal's current manager?",
  "n_results": 5
}
```

## Testing

Run the test client to verify API functionality:
```bash
python test_client.py
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Knowledge Base Structure

The server expects TXT files in the `../arsenal_kb/` directory (relative to server directory):
```
../arsenal_kb/
├── players/
│   ├── player1.txt
│   └── player2.txt
├── history/
│   ├── history1.txt
│   └── history2.txt
└── management/
    ├── manager_info.txt
    └── staff.txt
```

## Configuration

Key configuration parameters in `main.py`:

- `EMBEDDING_MODEL_NAME`: "all-MiniLM-L6-v2"
- `CHUNK_SIZE`: 600 characters
- `CHUNK_OVERLAP`: 120 characters
- `COLLECTION_NAME`: "gunnergpt_arsenal_kb"
