import { LocalUpdateCurrentAccount } from './local-update-current-account';
import { SetStorageMock } from '@/data/test';
import { UnexpectedError } from '@/domain/errors';
import faker from 'faker';
import { mockAccountModel } from '@/domain/test';

type SutTypes = {
  sut: LocalUpdateCurrentAccount;
  setStorageMock: SetStorageMock;
};

const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock();
  const sut = new LocalUpdateCurrentAccount(setStorageMock);

  return {
    sut,
    setStorageMock,
  };
};

describe('LocalSaveAcessToken', () => {
  it('should call SetStorage with correct value', async () => {
    const { sut, setStorageMock } = makeSut();
    const account = mockAccountModel();

    await sut.update(account);

    expect(setStorageMock.key).toBe('account');
    expect(setStorageMock.value).toBe(JSON.stringify(account));
  });

  it('should throw if SetStorage throws an error', async () => {
    const { sut, setStorageMock } = makeSut();
    jest.spyOn(setStorageMock, 'set').mockRejectedValueOnce(new Error());

    const promise = sut.update(mockAccountModel());

    await expect(promise).rejects.toThrow(new Error());
  });

  it('should throw if accessToken is falsy', async () => {
    const { sut } = makeSut();

    const promise = sut.update(undefined);

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });
});
