import type {
	IAddAccount,
	IAddAccountModel,
} from "../../../domain/usercases/add-account";
import type { IAccountModel } from "../../../models/account";
import type { IEncrypter } from "../../protocols/encrypter";

export class DbAddAccount implements IAddAccount {
	private readonly encrypter: IEncrypter;

	constructor(encrypter: IEncrypter) {
		this.encrypter = encrypter;
	}

	async add(account: IAddAccountModel): Promise<IAccountModel> {
		await this.encrypter.encrypt(account.password);
		return new Promise((resolve) => resolve(null));
	}
}
