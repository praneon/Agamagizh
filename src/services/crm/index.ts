export * from './CrmDataProvider';
export * from './LocalCrmDataProvider';
export * from './HttpCrmDataProvider';

import { CrmDataProvider } from './CrmDataProvider';
import { LocalCrmDataProvider } from './LocalCrmDataProvider';
import { HttpCrmDataProvider } from './HttpCrmDataProvider';

export function createCrmDataProvider(
  mode: 'local' | 'real' = 'local',
  accountId: number = 1
): CrmDataProvider {
  if (mode === 'real') {
    return new HttpCrmDataProvider(accountId);
  }
  return new LocalCrmDataProvider();
}
