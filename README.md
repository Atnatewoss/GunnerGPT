# GunnerGPT: Arsenal FC Intelligence Layer
### Group 6 - RAG System Assignment

![Project Badge](https://img.shields.io/badge/Status-Operational-green) ![Tech Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20Next.js%20%7C%20ChromaDB%20%7C%20Gemini-red)

## 1. Domain & Problem Statement

### Selected Domain
**Elite Football Analytics & Club History (Arsenal FC)**

### The Problem
Football knowledge is fragmented across scattered unstructured sources: match reports, tactical analyses, historical archives, and player statistics. For fans and analysts, synthesizing this information into coherent answers is time-consuming and prone to hallucination when using generic LLMs.

### Proposed Solution
**GunnerGPT** is a Retrieval-Augmented Generation (RAG) system specialized in Arsenal FC. It ingests verified domain documents into a vector store to provide grounded, fact-based answers.
-   **Why RAG?**: Standard LLMs have a knowledge cutoff and lack specific, granular tactical data from recent matches. RAG allows us to inject real-time "verified evidence" into the model's context.

---

## 2. Knowledge Base Preparation

### Data Sources
The system utilizes a curated dataset (`arsenal_kb`) comprising:
*   **Tactical Reports**: Structured text files on "Arteta Ball," pressing structures (4-4-2 OOP), and build-up patterns.
*   **Player Profiles**: Individual analysis files (e.g., `odegard.txt`, `jsaka.txt`) detailing stats, roles, and heatmaps.
*   **Historical Archives**: Season summaries and trophy records.

### Preprocessing Pipeline
1.  **Ingestion**: Raw `.txt` files are loaded from the `arsenal_kb/` directory.
2.  **Chunking**: Documents are split into **600-character chunks** with **120-character overlap** to preserve semantic context across boundaries.
3.  **Embedding**: Chunks are encoded using the `all-MiniLM-L6-v2` model (384 dimensions) for efficient dense vector representation.

---

## 3. RAG Pipeline Architecture

The system implements a standard RAG pipeline with a "Traceable" UI for verification.

### Architecture Components
1.  **Retriever**:
    *   **Vector Store**: **ChromaDB Cloud** (Serverless).
    *   **Query Expansion**: User queries are cleaned and embedded.
    *   **Search**: Cosine similarity search retrieves the top **k=5** most relevant chunks.

2.  **Generator**:
    *   **LLM**: **Google Gemini 1.5 Flash** (via `google-genai` SDK).
    *   **Prompt Engineering**: A strict system prompt enforces the persona of an "Elite Tactical Analyst" and mandates citations from the provided context.

3.  **Frontend (Next.js)**:
    *   **"Intelligence Trace"**: A custom UI component that visualizes the RAG steps (Query -> Embedding -> Retrieval -> Generation).
    *   **Source Verification**: Users can expand retrieved chunks to verify the source text against the generated answer.

---

## 4. Implementation & Setup

### Prerequisites
*   **Python 3.10+**
*   **Node.js 18+**
*   **API Keys**: ChromaDB Cloud & Google Gemini

### Backend Setup (FastAPI)
```bash
cd server
python -m venv venv
source venv\Scripts\activate  # or venv/bin/activate on Mac
pip install -r requirements.txt

# Create .env file with your credentials
# CHROMA_API_KEY=...
# CHROMA_TENANT=...
# CHROMA_DB=...
# GEMINI_API_KEY=...

# Run the server
python -m app.main
```

### Frontend Setup (Next.js)
```bash
cd client
npm install

# Run the development server
npm run dev
```
Access the application at `http://localhost:3000`.

### Ingestion
To populate the database with the knowledge base:
```bash
# Trigger ingestion via API
curl -X POST http://localhost:8000/ingest/sync
```

---

## 5. Evaluation

We evaluate the system using a visible "Intelligence Trace" panel in the UI, measuring:

*   **Relevance**: Cosine similarity scores (0-1) displayed for each source. High scores (>0.4) indicate strong semantic matches.
*   **Latency**: End-to-end request time (target < 2s).
*   **Hallucination Rate**: Monitored by checking if the generated answer cites the retrieved sources. The system is prompted to say "I don't know" if context is missing.

### Qualitative Results
*   **Query**: "Who is the manager?"
*   **Result**: Correctly identifies Mikel Arteta, citing "Community Shield" and "Tactical Evolution" documents.
*   **Trace**: Shows 5 evaluated chunks with similarity scores ranging from 0.35 to 0.52.

---

## Deliverables Checklist
- [x] **Problem Statement**: Defined specific domain (Arsenal FC).
- [x] **Knowledge Base**: Curated `arsenal_kb` with player and tactical data.
- [x] **RAG Pipeline**: Implemented using ChromaDB + Gemini.
- [x] **Source Code**: Fully runnable repo with conventional commits.
- [x] **Verification**: "Intelligence Trace" UI for transparency.
