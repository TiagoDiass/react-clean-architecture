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

    it('should return the correct response on axios.post', async () => {
      const { sut, mockedAxios } = makeSut();
      const httpResponse = await sut.post(mockPostRequest());
      const axiosResponse = await mockedAxios.post.mock.results[0].value;

      // Value mocked in the axios post method
      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data,
      });
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
      expect(mockedAxios.get).toHaveBeenCalledWith(request.url, { headers: request.headers });
    });

    it('should return the correct response on axios.get', async () => {
      const { sut, mockedAxios } = makeSut();
      const httpResponse = await sut.get(mockGetRequest());
      const axiosResponse = await mockedAxios.get.mock.results[0].value;

      // Value mocked in the axios get method
      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data,
      });
    });

    it('should return the correct error on failure of axios.get', () => {
      const { sut, mockedAxios } = makeSut();

      mockedAxios.get.mockRejectedValueOnce({
        response: mockHttpResponse(),
      });

      const promise = sut.get(mockGetRequest());

      // Value mocked in the axios post method
      expect(promise).toEqual(mockedAxios.get.mock.results[0].value);
    });
  });
});
