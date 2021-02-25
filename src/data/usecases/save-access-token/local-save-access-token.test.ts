import { LocalSaveAccessToken } from './local-save-access-token';
import faker from 'faker';
import { SetStorageSpy } from '@/data/test';

type SutTypes = {
  sut: LocalSaveAccessToken;
  setStorageSpy: SetStorageSpy;
};

const makeSut = (): SutTypes => {
  const setStorageSpy = new SetStorageSpy();
  const sut = new LocalSaveAccessToken(setStorageSpy);

  return {
    sut,
    setStorageSpy,
  };
};

describe('LocalSaveAcessToken', () => {
  it('should call SetStorage with correct values', async () => {
    const { sut, setStorageSpy } = makeSut();
    const accessToken = faker.random.uuid();

    await sut.save(accessToken);

    expect(setStorageSpy.key).toBe('accessToken');
    expect(setStorageSpy.value).toBe(accessToken);
  });
});