import { describe, expect, spyOn, test } from "bun:test";
import validator from "validator";
import { EmailValidatorAdapter } from "./email-validator-adapter";

const makeSut = (): EmailValidatorAdapter => {
	return new EmailValidatorAdapter();
};

describe("EmailValidator Adapter", () => {
	test("Should return false if validator returns false", () => {
		const sut = makeSut();
		spyOn(validator, "isEmail").mockReturnValueOnce(false);
		const isValid = sut.isValid("invalid@mail.com");

		expect(isValid).toBe(false);
	});

	test("Should return true if validator returns true", () => {
		const sut = makeSut();
		spyOn(validator, "isEmail").mockReturnValueOnce(true);
		const isValid = sut.isValid("valid@mail.com");

		expect(isValid).toBe(true);
	});

	test("Should call validator with correct email", () => {
		const sut = makeSut();
		const isEmailSpy = spyOn(validator, "isEmail");
		sut.isValid("any@mail.com");

		expect(isEmailSpy).toHaveBeenCalledWith("any@mail.com");
	});
});
