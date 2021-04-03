import { AccountModel } from '../models';
import faker from 'faker';

export const mockAccountModel = (): AccountModel => ({
  accessToken: faker.random.uuid(),
  name: faker.name.findName(),
});
