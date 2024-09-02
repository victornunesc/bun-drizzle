import type { IAccountModel } from "../../models/account";

export interface IAddAccountArgs {
	name: string;
	email: string;
	password: string;
}

export interface IAddAccount {
	add: (account: IAddAccountArgs) => IAccountModel;
}
