export interface IHttpResponse {
	statusCode: number;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	body: any;
}

export interface IHttpRequest {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	body?: any;
}
