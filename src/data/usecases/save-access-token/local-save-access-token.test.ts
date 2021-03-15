import { LocalSaveAccessToken } from './local-save-access-token';
import { SetStorageMock } from '@/data/test';
import { UnexpectedError } from '@/domain/errors';
import faker from 'faker';

type SutTypes = {
  sut: LocalSaveAccessToken;
  setStorageMock: SetStorageMock;
};

const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock();
  const sut = new LocalSaveAccessToken(setStorageMock);

  return {
    sut,
    setStorageMock,
  };
};

describe('LocalSaveAcessToken', () => {
  it('should call SetStorage with correct value', async () => {
    const { sut, setStorageMock } = makeSut();
    const accessToken = faker.random.uuid();

    await sut.save(accessToken);

    expect(setStorageMock.key).toBe('accessToken');
    expect(setStorageMock.value).toBe(accessToken);
  });

  it('should throw if SetStorage throws an error', async () => {
    const { sut, setStorageMock } = makeSut();
    jest.spyOn(setStorageMock, 'set').mockRejectedValueOnce(new Error());

    const promise = sut.save(faker.random.uuid());

    await expect(promise).rejects.toThrow(new Error());
  });

  it('should throw if accessToken is falsy', async () => {
    const { sut } = makeSut();

    const promise = sut.save(undefined);

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });
});
