import { AccountModel } from '@/domain/models';
import { AddAccount, AddAccountParams } from '@/domain/usecases';

export class AddAccountSpy implements AddAccount {
  params: AddAccountParams;

  add(params: AddAccountParams): Promise<AccountModel> {
    this.params = params;
    return null;
  }
}
