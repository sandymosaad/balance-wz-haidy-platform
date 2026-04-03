import axios from 'axios';
import type {ApiResponse} from '@/types';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });

  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    return {
      success: false,
      error:
        data.error ?? {
          message: 'Request failed',
          code: 'HTTP_ERROR'
        }
    };
  }

  return data;
}
