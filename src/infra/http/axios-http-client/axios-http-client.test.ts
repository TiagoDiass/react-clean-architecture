import { AxiosHttpClient } from './axios-http-client';
import { mockAxios, mockHttpResponse } from '@/infra/test';
import { mockGetRequest, mockPostRequest } from '@/data/test';
import axios from 'axios';

jest.mock('axios');

type SutTypes = {
  sut: AxiosHttpClient;
  mockedAxios: jest.Mocked<typeof axios>;
};

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient();
  const mockedAxios = mockAxios();

  return {
    sut,
    mockedAxios,
  };
};

describe('AxiosHttpClient', () => {
  describe('POST', () => {
    it('should call axios.post with correct values', async () => {
      const request = mockPostRequest();
      const { sut, mockedAxios } = makeSut();
      await sut.post(request);
      expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body);
    });

    it('should return the correct response on axios.post', () => {
      const { sut, mockedAxios } = makeSut();
      const promise = sut.post(mockPostRequest());

      // Value mocked in the axios post method
      expect(promise).toEqual(mockedAxios.post.mock.results[0].value);
    });

    it('should return the correct error on failure of axios.post', () => {
      const { sut, mockedAxios } = makeSut();

      mockedAxios.post.mockRejectedValueOnce({
        response: mockHttpResponse(),
      });

      const promise = sut.post(mockPostRequest());

      // Value mocked in the axios post method
      expect(promise).toEqual(mockedAxios.post.mock.results[0].value);
    });
  });

  describe('GET', () => {
    it('should call axios.get with correct values', async () => {
      const request = mockGetRequest();
      const { sut, mockedAxios } = makeSut();
      await sut.get(request);
      expect(mockedAxios.get).toHaveBeenCalledWith(request.url);
    });
  });
});
