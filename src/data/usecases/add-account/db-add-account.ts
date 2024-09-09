import type {
	IAddAccount,
	IAddAccountModel,
} from "../../../domain/usercases/add-account";
import type { IAccountModel } from "../../../models/account";
import type { IAddAccountRepository } from "../../protocols/add-account-repository";
import type { IEncrypter } from "../../protocols/encrypter";

export class DbAddAccount implements IAddAccount {
	private readonly encrypter: IEncrypter;
	private readonly addAccountRepository: IAddAccountRepository;

	constructor(
		encrypter: IEncrypter,
		addAccountRepository: IAddAccountRepository,
	) {
		this.encrypter = encrypter;
		this.addAccountRepository = addAccountRepository;
	}

	async add(accountData: IAddAccountModel): Promise<IAccountModel> {
		const hashedPassword = await this.encrypter.encrypt(accountData.password);
		const account = await this.addAccountRepository.add(
			Object.assign({}, accountData, { password: hashedPassword }),
		);

		return account;
	}
}
