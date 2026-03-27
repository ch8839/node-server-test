interface FetcherOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, any>;
  params?: Record<string, any>;
  body?: any;
  host?: string;
  timeout?: number;
  abortController? : AbortController
}
const DefaultHost = "http://localhost:3100";

export const fetcher = async <T>(url: string, options: FetcherOptions = {}) => {
  const {
    method = "GET",
    headers = {},
    params,
    body,
    host = DefaultHost,
    timeout = 3000,
    abortController,
  } = options;
  const queryString = params ? "?" + new URLSearchParams(params).toString() : '';
  const requestUrl = `${host}${url}${queryString}`;
  const controller = abortController || new AbortController();
  // 结合 setTimeout 调用 controller.abort() 实现请求超时中止
  const timeId = setTimeout(() => controller.abort(), timeout);
  const fetchOptions = {
    method,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
    // 通过 AbortController 创建的 signal 传递给 fetch，可以在稍后通过 AbortController 取消该请求
    signal: controller.signal,
  }
  console.log('>>>fetchOptions', fetchOptions)
  try {
    const response = await fetch(requestUrl, fetchOptions);
    
    clearTimeout(timeId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${
          errorData.message || "Unknown error"
        }`
      );
    }

    const res = (await response.json()) as T;
    console.log('>>>res', res)
    return res
  } catch (error: any) {
    // 处理超时
    if (error.name === "AbortError") {
      throw new Error("Request timeout");
    } else {
      throw new Error(`Fetch error: ${error.message}`);
    }
  }
};
