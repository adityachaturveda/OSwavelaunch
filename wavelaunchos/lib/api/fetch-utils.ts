export type ApiSuccessEnvelope<T> = {
  success: true;
  data: T;
};

export type ApiErrorEnvelope = {
  success: false;
  error?: string;
  code?: string;
  details?: unknown;
};

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

/**
 * Safely parse a JSON response body, tolerating empty payloads (e.g. 204).
 */
export async function parseJsonSafe<T>(response: Response): Promise<ApiEnvelope<T> | null> {
  const rawBody = await response.text();
  const trimmed = rawBody.trim();

  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed) as ApiEnvelope<T>;
  } catch (error) {
    console.error("Failed to parse API response", error, trimmed);
    throw new Error("Received an invalid response from the server.");
  }
}

export function extractErrorMessage(
  payload: ApiEnvelope<unknown> | null,
  fallback: string
): string {
  if (payload && payload.success === false && payload.error) {
    return payload.error;
  }

  return fallback;
}
