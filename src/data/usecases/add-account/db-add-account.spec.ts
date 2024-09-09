import { describe, expect, spyOn, test } from "bun:test";
import type { IAddAccount } from "../../../domain/usercases/add-account";
import type { IEncrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface sutTypes {
	sut: IAddAccount;
	encrypterStub: IEncrypter;
}

const makeEncrypter = (): IEncrypter => {
	class EncrypterStub implements IEncrypter {
		async encrypt(_value: string): Promise<string> {
			return new Promise((resolve) => resolve("hashed_value"));
		}
	}

	return new EncrypterStub();
};

const makeSut = (): sutTypes => {
	const encrypterStub = makeEncrypter();
	const sut = new DbAddAccount(encrypterStub);

	return { sut, encrypterStub };
};

describe("DbAddAccount Usecase", () => {
	test("Should call Encryper with correct password", async () => {
		const { sut, encrypterStub } = makeSut();
		const encryptSpy = spyOn(encrypterStub, "encrypt");
		const accountData = {
			name: "valid_name",
			email: "valid@mail.com",
			password: "valid_password",
		};
		await sut.add(accountData);

		expect(encryptSpy).toHaveBeenCalledWith("valid_password");
	});
});
