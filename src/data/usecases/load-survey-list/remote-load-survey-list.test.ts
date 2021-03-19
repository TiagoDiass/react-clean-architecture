import { RemoteLoadSurveyList } from './remote-load-survey-list';
import { SurveyModel } from '@/domain/models';
import { UnexpectedError } from '@/domain/errors';
import { HttpGetClientSpy } from '@/data/test';
import { HttpStatusCode } from '@/data/protocols/http';
import faker from 'faker';

type SutTypes = {
  sut: RemoteLoadSurveyList;
  httpGetClientSpy: HttpGetClientSpy<SurveyModel[]>;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<SurveyModel[]>();
  const sut = new RemoteLoadSurveyList(url, httpGetClientSpy);

  return {
    httpGetClientSpy,
    sut,
  };
};

describe('RemoteLoadSurveyList', () => {
  it('should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url();
    const { sut, httpGetClientSpy } = makeSut(url);

    await sut.loadAll();

    expect(httpGetClientSpy.url).toBe(url);
  });

  it('should throw UnexpectedError if HttpGetClient returns 403', async () => {
    const { sut, httpGetClientSpy } = makeSut();

    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };

    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });
});
