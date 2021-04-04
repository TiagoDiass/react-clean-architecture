import { AuthorizeHttpGetClientDecorator } from '@/main/decorators';
import { makeLocalStorageAdapter } from '../cache/local-storage-adapter-factory';
import { makeAxiosHttpClient } from '../http/axios-http-client-factory';
import { HttpGetClient } from '@/data/protocols/http';

export const makeAuthorizeHttpGetClientDecorator = (): HttpGetClient => {
  return new AuthorizeHttpGetClientDecorator(makeLocalStorageAdapter(), makeAxiosHttpClient());
};
