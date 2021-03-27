import { mockSurveyListModel } from '@/domain/test';
import { LoadSurveyList } from '@/domain/usecases';

export class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0;
  surveys = mockSurveyListModel();

  async loadAll() {
    this.callsCount++;

    return this.surveys;
  }
}
