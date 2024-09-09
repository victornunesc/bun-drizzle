import validator from "validator";
import type { IEmailValidator } from "../presentation/controllers/signup/protocols/email-validator";

export class EmailValidatorAdapter implements IEmailValidator {
	isValid(email: string): boolean {
		return validator.isEmail(email);
	}
}
