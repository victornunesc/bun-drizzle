import { describe, expect, test } from "bun:test";
import { MissingParamError } from "../erros/missing-param-error";
import { SignUpController } from "./signup";

const makeSut = () => new SignUpController();

describe("SignUp Controoler", () => {
	test("Should return 400 if no name is provided", () => {
		const sut = makeSut();
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
		const sut = makeSut();
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
		const sut = makeSut();
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
		const sut = makeSut();
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
});
