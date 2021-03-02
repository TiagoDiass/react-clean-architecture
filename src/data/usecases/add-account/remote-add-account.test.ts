import { RemoteAddAccount } from './remote-add-account';
import { HttpPostClientSpy } from '@/data/test';
import { AddAccountParams } from '@/domain/usecases';
import { AccountModel } from '@/domain/models';
import { mockAddAccountParams } from '@/domain/test';
import { HttpStatusCode } from '@/data/protocols/http';
import { EmailInUseError } from '@/domain/errors';
import faker from 'faker';

type SutTypes = {
  sut: RemoteAddAccount;
  httpPostClientSpy: HttpPostClientSpy<AddAccountParams, AccountModel>;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AddAccountParams, AccountModel>();
  const sut = new RemoteAddAccount(url, httpPostClientSpy);

  return {
    sut,
    httpPostClientSpy,
  };
};

describe('AddAccount', () => {
  it('should call HttpPostClient with the correct URL', async () => {
    const url = faker.internet.url();

    const { sut, httpPostClientSpy } = makeSut(url);

    await sut.add(mockAddAccountParams());
    expect(httpPostClientSpy.url).toBe(url);
  });

  it('should call HttpPostClient with the correct body', async () => {
    const { sut, httpPostClientSpy } = makeSut();

    const addAccountParams = mockAddAccountParams();

    await sut.add(addAccountParams);
    expect(httpPostClientSpy.body).toEqual(addAccountParams);
  });

  it('should throws EmailInUseError if HttpPostClient returns a 403 status', async () => {
    const { sut, httpPostClientSpy } = makeSut();

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };

    const promise = sut.add(mockAddAccountParams());

    await expect(promise).rejects.toThrow(new EmailInUseError());
  });
});
