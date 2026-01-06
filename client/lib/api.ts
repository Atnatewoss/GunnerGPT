import { ChatRequest, ChatResponse, QueryResponse, HealthResponse } from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(
      `API Error: ${response.statusText}`,
      response.status,
      response.statusText
    );
  }

  return response.json();
}

export const api = {
  // Health check
  health: () => apiRequest<HealthResponse>('/health'),

  // Knowledge query
  query: (request: { message: string; n_results?: number }) =>
    apiRequest<QueryResponse>('/query', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  // Chat with RAG
  chat: (request: ChatRequest) =>
    apiRequest<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  // Sync knowledge base
  ingest: () =>
    apiRequest<{ message: string }>('/ingest/sync', {
      method: 'POST',
    }),
};

export { ApiError };
