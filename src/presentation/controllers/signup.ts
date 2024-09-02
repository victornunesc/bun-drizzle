import type { IAddAccount } from "../../domain/usercases/add-account";
import { InvalidParamError } from "../erros/invalid-param-error";
import { MissingParamError } from "../erros/missing-param-error";
import { badRequest, serverError } from "../helpers/http-helper";
import type { IController } from "../protocols/controller";
import type { IEmailValidator } from "../protocols/email-validator";
import type { IHttpRequest, IHttpResponse } from "../protocols/http";

export class SignUpController implements IController {
	private readonly emailValidator: IEmailValidator;
	private readonly addAccount: IAddAccount;

	constructor(emailValidator: IEmailValidator, addAccount: IAddAccount) {
		this.emailValidator = emailValidator;
		this.addAccount = addAccount;
	}

	public handle(httpRequest: IHttpRequest): IHttpResponse {
		try {
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
			const { name, email, password, passwordConfirmation } = httpRequest.body;

			if (password !== passwordConfirmation) {
				return badRequest(new InvalidParamError("passwordConfirmation"));
			}

			const isValid = this.emailValidator.isValid(email);

			if (!isValid) {
				return badRequest(new InvalidParamError("email"));
			}

			this.addAccount.add({
				name,
				email,
				password,
			});

			return {
				statusCode: 200,
				body: {},
			};
		} catch (error) {
			// console.error(error);
			return serverError();
		}
	}
}
