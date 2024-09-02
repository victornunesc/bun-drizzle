import type { IAddAccount } from "../../../domain/usercases/add-account";
import { InvalidParamError } from "../../erros/invalid-param-error";
import { MissingParamError } from "../../erros/missing-param-error";
import { badRequest, ok, serverError } from "../../helpers/http-helper";
import type { IController } from "../../protocols/controller";
import type { IHttpRequest, IHttpResponse } from "../../protocols/http";
import type { IEmailValidator } from "./protocols/email-validator";

export class SignUpController implements IController {
	private readonly emailValidator: IEmailValidator;
	private readonly addAccount: IAddAccount;

	constructor(emailValidator: IEmailValidator, addAccount: IAddAccount) {
		this.emailValidator = emailValidator;
		this.addAccount = addAccount;
	}

	public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
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

			const account = await this.addAccount.add({
				name,
				email,
				password,
			});

			return ok(account);
		} catch (error) {
			// console.error(error);
			return serverError();
		}
	}
}
