import axios from 'axios';
import type {ApiResponse} from '@/types';
import {getSiteUrl} from '@/lib/site-url';

export const apiClient = axios.create({
  baseURL: getSiteUrl(),
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
