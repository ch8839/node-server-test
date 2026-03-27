export default function (url: string, options: RequestInit) {
	options = options || {};
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		const keys: string[] = [];
		const headers: Record<string, string> = {};

		const response = () => ({
			ok: ((request.status / 100) | 0) == 2, // 200-299
			statusText: request.statusText,
			status: request.status,
			url: request.responseURL,
			text: () => Promise.resolve(request.responseText),
			json: () => Promise.resolve(request.responseText).then(JSON.parse),
			blob: () => Promise.resolve(new Blob([request.response])),
			clone: response,
			headers: {
				keys: () => keys,
				entries: () => keys.map((n) => [n, request.getResponseHeader(n)]),
				get: (n: string) => request.getResponseHeader(n),
				has: (n: string) => request.getResponseHeader(n) != null,
			},
		});

		request.open(options.method || "get", url, true);

		request.onload = () => {
			request
				.getAllResponseHeaders()
				.toLowerCase()
				.replace(/^(.+?):/gm, (_, key: string) => {
					headers[key] = key;
					keys.push(key);
					return key;
				});
			resolve(response());
		};

		request.onerror = reject;

		request.withCredentials = options.credentials == "include";

		for (const i in options.headers) {
			request.setRequestHeader(i, (options.headers as Record<string, string>)[i]);
		}

		request.send(options.body as XMLHttpRequestBodyInit | null);
	});
}