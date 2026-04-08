/** 后端统一响应格式 */
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type QueryValue = string | number | boolean | undefined | null;

interface FetcherOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, QueryValue>;
  body?: Record<string, unknown> | Array<unknown>;
  host?: string;
  timeout?: number;
  abortController?: AbortController;
}

const DEFAULT_HOST = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_TIMEOUT = 3000;
const isDev = import.meta.env.DEV;

function buildQueryString(params: Record<string, QueryValue>): string {
  const filtered: Record<string, string> = {};
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined) {
      filtered[key] = String(val);
    }
  }
  const qs = new URLSearchParams(filtered).toString();
  return qs ? `?${qs}` : '';
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export async function fetcher<T = unknown>(
  url: string,
  options: FetcherOptions = {},
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    params,
    body,
    host = DEFAULT_HOST,
    timeout = DEFAULT_TIMEOUT,
    abortController,
  } = options;

  const queryString = params ? buildQueryString(params) : '';
  const requestUrl = `${host}${url}${queryString}`;

  const controller = abortController ?? new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(requestUrl, {
      method,
      headers: { 'content-type': 'application/json', ...headers },
      body: body ? JSON.stringify(body) : null,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData: ApiResponse = await response
        .json()
        .catch(() => ({ code: response.status, data: null, message: response.statusText }));
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`,
      );
    }

    const res = (await response.json()) as ApiResponse<T>;
    if (isDev) console.log(`[fetcher] ${method} ${url}`, res);
    return res;
  } catch (error: unknown) {
    if (isAbortError(error)) {
      throw new Error(`Request timeout: ${method} ${url}`);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Fetch error: ${String(error)}`);
  } finally {
    clearTimeout(timerId);
  }
}
