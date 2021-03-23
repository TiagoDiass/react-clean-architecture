import { LocalUpdateCurrentAccount } from '@/data/usecases/update-current-account/local-update-current-account';
import { makeLocalStorageAdapter } from '@/main/factories/cache/local-storage-adapter-factory';

export const makeLocalUpdateCurrentAccount = () => {
  return new LocalUpdateCurrentAccount(makeLocalStorageAdapter());
};
