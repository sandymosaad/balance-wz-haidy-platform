import {Prisma} from '@prisma/client';
import {ZodError} from 'zod';

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: {
    timestamp: string;
    version: string;
  };
}

export class ServerActionError extends Error {
  code: string;
  details?: Record<string, unknown>;

  constructor(message: string, code = 'SERVER_ACTION_ERROR', details?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

const API_VERSION = 'v1';

function baseMetadata() {
  return {
    timestamp: new Date().toISOString(),
    version: API_VERSION
  };
}

export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    metadata: baseMetadata()
  };
}

export function errorResponse(
  message: string,
  code: string,
  details?: Record<string, unknown>
): ApiResponse<never> {
  return {
    success: false,
    error: {
      message,
      code,
      details
    },
    metadata: baseMetadata()
  };
}

export function mapToApiError(error: unknown): ApiResponse<never> {
  if (error instanceof ServerActionError) {
    return errorResponse(error.message, error.code, error.details);
  }

  if (error instanceof ZodError) {
    return errorResponse('Validation failed. Please review your inputs.', 'VALIDATION_ERROR', {
      issues: error.flatten()
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return errorResponse('A unique field already exists.', 'CONFLICT_ERROR', {
        target: error.meta?.target
      });
    }

    if (error.code === 'P2025') {
      return errorResponse('Requested record was not found.', 'NOT_FOUND');
    }

    return errorResponse('A database error occurred.', 'DATABASE_ERROR', {
      code: error.code
    });
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return errorResponse('Database input validation failed.', 'DATABASE_VALIDATION_ERROR');
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 'UNEXPECTED_ERROR');
  }

  return errorResponse('An unknown server error occurred.', 'UNKNOWN_ERROR');
}
