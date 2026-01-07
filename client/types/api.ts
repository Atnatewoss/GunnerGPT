export interface DocumentResult {
  text: string;
  metadata: {
    source?: string;
    page?: number;
    chapter?: string;
    [key: string]: any;
  };
  distance: number;
}

export interface ChatRequest {
  message: string;
  context_length?: number;
}

export interface ChatResponse {
  response: string;
  sources: DocumentResult[];
  query: string;
  evaluation_metrics?: {
    latency: string;
    relevance: string;
    context_length: number;
    [key: string]: any;
  };
}

export interface QueryResponse {
  results: DocumentResult[];
  query: string;
}

export interface HealthResponse {
  status: string;
  chroma_connected: boolean;
  model_loaded: boolean;
  collection_info?: any;
}

export interface KnowledgeStats {
  total_documents: number;
  total_sources: number;
  last_updated: string;
  categories: string[];
}
