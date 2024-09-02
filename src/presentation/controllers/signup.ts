import { InvalidParamError } from "../erros/invalid-param-error copy";
import { MissingParamError } from "../erros/missing-param-error";
import { badRequest } from "../helpers/http-helper";
import type { IController } from "../protocols/controller";
import type { IEmailValidator } from "../protocols/email-validator";
import type { IHttpRequest, IHttpResponse } from "../protocols/http";

export class SignUpController implements IController {
	private readonly emailValidator: IEmailValidator;

	constructor(emailValidator: IEmailValidator) {
		this.emailValidator = emailValidator;
	}

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

		if (!this.emailValidator.isValid(httpRequest.body.email)) {
			return badRequest(new InvalidParamError("email"));
		}

		return {
			statusCode: 200,
			body: {},
		};
	}
}
