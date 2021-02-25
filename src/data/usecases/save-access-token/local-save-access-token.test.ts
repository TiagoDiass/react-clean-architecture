import { LocalSaveAccessToken } from './local-save-access-token';
import faker from 'faker';
import { SetStorageMock } from '@/data/test';

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
  it('should call SetStorage with correct values', async () => {
    const { sut, setStorageMock } = makeSut();
    const accessToken = faker.random.uuid();

    await sut.save(accessToken);

    expect(setStorageMock.key).toBe('accessToken');
    expect(setStorageMock.value).toBe(accessToken);
  });

  it('should ', async () => {});
});
