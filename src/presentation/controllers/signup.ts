import { MissingParamError } from "../erros/missing-param-error";
import { badRequest } from "../helpers/http-helper";
import type { IController } from "../protocols/controller";
import type { IHttpRequest, IHttpResponse } from "../protocols/http";

export class SignUpController implements IController {
	public handle(httpRequest: IHttpRequest): IHttpResponse {
		const requiredFields = [
			"name",
			"email",
			"password",
			"passwordConfirmation",
		];
		for (const field of requiredFields) {
			if (!httpRequest.body[field]) {
				return badRequest(new MissingParamError(field));
			}
		}

		return {
			statusCode: 200,
			body: {},
		};
	}
}
