import { ServerError } from "../erros/server-error";
import type { IHttpResponse } from "../protocols/http";

export const badRequest = (error: Error): IHttpResponse => ({
	statusCode: 400,
	body: error,
});

export const serverError = (): IHttpResponse => ({
	statusCode: 500,
	body: new ServerError(),
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const ok = (data: any): IHttpResponse => ({
	statusCode: 200,
	body: data,
});
