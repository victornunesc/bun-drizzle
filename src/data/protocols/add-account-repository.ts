import type { IAddAccountModel } from "../../domain/usercases/add-account";
import type { IAccountModel } from "../../models/account";

export interface IAddAccountRepository {
	add(accountData: IAddAccountModel): Promise<IAccountModel>;
}
