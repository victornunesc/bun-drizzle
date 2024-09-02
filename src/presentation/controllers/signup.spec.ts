import { describe, expect, spyOn, test } from "bun:test";
import type {
	IAddAccount,
	IAddAccountArgs,
} from "../../domain/usercases/add-account";
import type { IAccountModel } from "../../models/account";
import { InvalidParamError } from "../erros/invalid-param-error";
import { MissingParamError } from "../erros/missing-param-error";
import { ServerError } from "../erros/server-error";
import type { IEmailValidator } from "../protocols/email-validator";
import { SignUpController } from "./signup";

const makeAddAccount = (): IAddAccount => {
	class AddAccountStub implements IAddAccount {
		add(_account: IAddAccountArgs): IAccountModel {
			const fakeAccount = {
				id: "valid_id",
				name: "valid_name",
				email: "valid_email@mail.com",
				password: "valid_password",
			};

			return fakeAccount;
		}
	}

	return new AddAccountStub();
};

const makeEmailValidator = (): IEmailValidator => {
	class EmailValidatorStub implements IEmailValidator {
		isValid(_email: string): boolean {
			return true;
		}
	}

	return new EmailValidatorStub();
};

interface SutTypes {
	sut: SignUpController;
	emailValidatorStub: IEmailValidator;
	addAccountStub: IAddAccount;
}

const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator();
	const addAccountStub = makeAddAccount();
	const sut = new SignUpController(emailValidatorStub, addAccountStub);

	return {
		sut,
		emailValidatorStub,
		addAccountStub,
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

	test("Should return 400 if password confirmation fails", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "John Doe",
				email: "john_doe@mail.com",
				password: "my_password",
				passwordConfirmation: "invalid_password",
			},
		};
		const httpResponse = sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body.message).toBe(
			new InvalidParamError("passwordConfirmation").message,
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

	test("Should call EmailValidator with correct email", () => {
		const { sut, emailValidatorStub } = makeSut();
		const isValidSpy = spyOn(emailValidatorStub, "isValid");

		const httpRequest = {
			body: {
				name: "John Doe",
				email: "john_doe@mail.com",
				password: "my_password",
				passwordConfirmation: "my_password",
			},
		};

		sut.handle(httpRequest);

		expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
	});

	test("Should return 500 if EmailValidator throws", () => {
		const { sut, emailValidatorStub } = makeSut();
		spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
			throw new Error("");
		});

		const httpRequest = {
			body: {
				name: "John Doe",
				email: "john_doe@mail.com",
				password: "my_password",
				passwordConfirmation: "my_password",
			},
		};

		const httpResponse = sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body.message).toBe(new ServerError().message);
	});

	test("Should call AddAccount with correct values", () => {
		const { sut, addAccountStub } = makeSut();
		const addSpy = spyOn(addAccountStub, "add");

		const httpRequest = {
			body: {
				name: "John Doe",
				email: "john_doe@mail.com",
				password: "my_password",
				passwordConfirmation: "my_password",
			},
		};

		sut.handle(httpRequest);

		expect(addSpy).toHaveBeenCalledWith({
			name: "John Doe",
			email: "john_doe@mail.com",
			password: "my_password",
		});
	});
});
