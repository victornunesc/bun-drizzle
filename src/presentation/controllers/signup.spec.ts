import { describe, expect, spyOn, test } from "bun:test";
import { InvalidParamError } from "../erros/invalid-param-error copy";
import { MissingParamError } from "../erros/missing-param-error";
import type { IEmailValidator } from "../protocols/email-validator";
import { SignUpController } from "./signup";

interface SutTypes {
	sut: SignUpController;
	emailValidatorStub: IEmailValidator;
}

const makeSut = (): SutTypes => {
	class EmailValidatorStub implements IEmailValidator {
		isValid(_email: string): boolean {
			return true;
		}
	}

	const emailValidatorStub = new EmailValidatorStub();
	const sut = new SignUpController(emailValidatorStub);

	return {
		sut,
		emailValidatorStub,
	};
};

describe("SignUp Controoler", () => {
	test("Should return 400 if no name is provided", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: "john_doe@mail.com",
				password: "my_password",
				passwordConfirmation: "my_password",
			},
		};
		const httpResponse = sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body.message).toBe(
			new MissingParamError("name").message,
		);
	});

	test("Should return 400 if no email is provided", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "John Doe",
				password: "my_password",
				passwordConfirmation: "my_password",
			},
		};
		const httpResponse = sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body.message).toBe(
			new MissingParamError("email").message,
		);
	});

	test("Should return 400 if no password is provided", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "John Doe",
				email: "john_doe@mail.com",
				passwordConfirmation: "my_password",
			},
		};
		const httpResponse = sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body.message).toBe(
			new MissingParamError("password").message,
		);
	});

	test("Should return 400 if no passwordConfirmation is provided", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "John Doe",
				email: "john_doe@mail.com",
				password: "my_password",
			},
		};
		const httpResponse = sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body.message).toBe(
			new MissingParamError("passwordConfirmation").message,
		);
	});

	test("Should return 400 if an invalid email is provided", () => {
		const { sut, emailValidatorStub } = makeSut();
		spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

		const httpRequest = {
			body: {
				name: "John Doe",
				email: "invalid@mail.com",
				password: "my_password",
				passwordConfirmation: "my_password",
			},
		};

		const httpResponse = sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body.message).toBe(
			new InvalidParamError("email").message,
		);
	});
});
