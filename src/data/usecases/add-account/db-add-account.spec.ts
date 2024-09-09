import { describe, expect, spyOn, test } from "bun:test";
import type {
	IAddAccount,
	IAddAccountModel,
} from "../../../domain/usercases/add-account";
import type { IAccountModel } from "../../../models/account";
import type { IAddAccountRepository } from "../../protocols/add-account-repository";
import type { IEncrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

const makeEncrypter = (): IEncrypter => {
	class EncrypterStub implements IEncrypter {
		async encrypt(_value: string): Promise<string> {
			return new Promise((resolve) => resolve("hashed_value"));
		}
	}

	return new EncrypterStub();
};

const makeAddAccountRepository = (): IAddAccountRepository => {
	class AddAccountRepositoryStub implements IAddAccountRepository {
		async add(accountData: IAddAccountModel): Promise<IAccountModel> {
			const fakeAccount = {
				id: "valid_id",
				name: accountData.name,
				email: accountData.email,
				password: "hashed_value",
			};

			return new Promise((resolve) => resolve(fakeAccount));
		}
	}

	return new AddAccountRepositoryStub();
};

interface sutTypes {
	sut: IAddAccount;
	encrypterStub: IEncrypter;
	addAccountRepositoryStub: IAddAccountRepository;
}

const makeSut = (): sutTypes => {
	const encrypterStub = makeEncrypter();
	const addAccountRepositoryStub = makeAddAccountRepository();
	const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

	return { sut, encrypterStub, addAccountRepositoryStub };
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

	test("Should throw if Encryper throws", async () => {
		const { sut, encrypterStub } = makeSut();
		spyOn(encrypterStub, "encrypt").mockImplementationOnce(async () => {
			throw new Error();
		});

		const accountData = {
			name: "valid_name",
			email: "valid@mail.com",
			password: "valid_password",
		};
		const promise = sut.add(accountData);

		expect(promise).rejects.toThrow();
	});

	test("Should call AddAccountRepository with correct values", async () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		const addSpy = spyOn(addAccountRepositoryStub, "add");
		const accountData = {
			name: "valid_name",
			email: "valid_email",
			password: "valid_password",
		};

		await sut.add(accountData);

		expect(addSpy).toHaveBeenCalledWith({
			name: "valid_name",
			email: "valid_email",
			password: "hashed_value",
		});
	});

	test("Should throw if AddAccountRepository throws", async () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		spyOn(addAccountRepositoryStub, "add").mockImplementationOnce(async () => {
			throw new Error();
		});

		const accountData = {
			name: "valid_name",
			email: "valid@mail.com",
			password: "valid_password",
		};
		const promise = sut.add(accountData);

		expect(promise).rejects.toThrow();
	});

	test("Should return an account on success", async () => {
		const { sut } = makeSut();
		const accountData = {
			name: "valid_name",
			email: "valid_email",
			password: "valid_password",
		};

		const account = await sut.add(accountData);

		expect(account).toEqual({
			id: "valid_id",
			name: accountData.name,
			email: accountData.email,
			password: "hashed_value",
		});
	});
});
