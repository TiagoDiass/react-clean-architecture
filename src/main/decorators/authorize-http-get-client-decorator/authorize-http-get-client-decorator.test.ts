import { GetStorageSpy, HttpGetClientSpy, mockGetRequest } from '@/data/test';
import { AuthorizeHttpGetClientDecorator } from './authorize-http-get-client-decorator';
import faker from 'faker';
import { HttpGetParams } from '@/data/protocols/http';

const makeSut = () => {
  const getStorageSpy = new GetStorageSpy();
  const httpGetClientSpy = new HttpGetClientSpy();
  const sut = new AuthorizeHttpGetClientDecorator(getStorageSpy, httpGetClientSpy);

  return {
    getStorageSpy,
    sut,
    httpGetClientSpy,
  };
};

describe('AuthorizeHttpGetClientDecorator', () => {
  it('should call GetStorage with correct value', async () => {
    const { sut, getStorageSpy } = makeSut();

    await sut.get(mockGetRequest());
    expect(getStorageSpy.key).toBe('account');
  });

  it("should not add headers if GetStorage doesn't return an account with accessToken", async () => {
    const { sut, httpGetClientSpy } = makeSut();
    const httpRequest: HttpGetParams = {
      url: faker.internet.url(),
      headers: {
        field: faker.random.words(),
      },
    };

    await sut.get(httpRequest);

    expect(httpGetClientSpy.url).toBe(httpRequest.url);
    expect(httpGetClientSpy.headers).toEqual(httpRequest.headers);
  });
});
