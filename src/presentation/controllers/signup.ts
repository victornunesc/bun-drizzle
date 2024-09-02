export class SignUpController {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public handle(httpRequest: any): any {
		return {
			statusCode: 400,
			body: new Error("Missing param: name"),
		};
	}
}
