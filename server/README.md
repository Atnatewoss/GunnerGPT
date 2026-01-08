# GunnerGPT FastAPI Server

A production-ready FastAPI backend for managing and querying the Arsenal FC knowledge base using RAG (Retrieval-Augmented Generation).

## Directory Structure

```
server/
├── app/
│   ├── main.py              # FastAPI entrypoint
│   ├── api/                 # HTTP layer (routes only)
│   │   ├── chat.py         # Chat and query endpoints
│   │   └── health.py       # Health check endpoints
│   ├── rag/                 # 🧠 RAG domain (core functionality)
│   │   ├── ingest.py       # Offline/admin ingestion
│   │   ├── retriever.py    # Similarity search
│   │   ├── embeddings.py   # Embedding logic
│   │   ├── vectorstore.py  # Chroma abstraction
│   │   └── prompts.py      # Prompt templates
│   ├── services/            # Business logic
│   │   └── chat_service.py # Chat processing logic
│   ├── core/                # Config, env, startup
│   │   ├── config.py       # Application settings
│   │   └── startup.py      # Service initialization
│   └── models/              # Pydantic schemas
│       └── chat.py         # Request/response models
├── requirements.txt         # Server dependencies
├── test_client.py          # Test client script
└── README.md               # This file
```

## Architecture

The application follows a clean layered architecture:

- **API Layer**: FastAPI routes handling HTTP requests/responses
- **Services Layer**: Business logic and orchestration
- **RAG Domain**: Core retrieval and generation functionality
- **Core Layer**: Configuration, startup, and shared utilities
- **Models**: Pydantic schemas for type safety

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

# Hugging Face Settings
HUGGING_FACE_API_KEY=your_hf_api_key
HUGGING_FACE_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

4. Start the server:
```bash
python -m app.main
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /health/
```

Returns comprehensive health status including service states and collection info.

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

### Chat with RAG
```
POST /chat
```

Chat with the AI using Retrieval-Augmented Generation.

**Request Body:**
```json
{
  "message": "Tell me about Arsenal's history",
  "context_length": 1500
}
```

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

## Testing

Run the test client to verify API functionality:
```bash
python test_client.py
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Configuration

Key configuration parameters in `app/core/config.py`:

- `embedding_model_name`: "all-MiniLM-L6-v2"
- `llm_model`: "mistralai/Mistral-7B-Instruct-v0.2" (via Hugging Face)
- `chunk_size`: 600 characters
- `chunk_overlap`: 120 characters
- `collection_name`: "gunnergpt_arsenal_kb"
- `kb_path`: "../arsenal_kb" (relative to server directory)

## Evaluation Metrics

GunnerGPT implements a principled RAG evaluation pipeline:

- **Quality Score**: A weighted roll-up (40% Retrieval, 40% Grounding, 20% Coverage).
- **Recall@5**: Retrieval effectiveness using a 0.3 similarity threshold.
- **Hallucination Rate**: Sentence-level logic check against source grounding.
- **Grounding Score**: N-gram phrase overlap between response and sources.
- **Coverage**: Semantic satisfaction of query terms in the response.

## Knowledge Base Structure

The server expects TXT files in the `../arsenal_kb/` directory:
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

Files are automatically chunked and categorized based on their directory structure.

## Features

- **Semantic Search**: Advanced similarity search using embeddings
- **RAG Chat**: Intelligent responses with context awareness
- **Async Processing**: Background ingestion support
- **Health Monitoring**: Comprehensive service health checks
- **Type Safety**: Full Pydantic model validation
- **Modular Design**: Clean separation of concerns
- **Production Ready**: CORS middleware, proper error handling, logging
