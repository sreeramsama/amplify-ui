import { createContextUtility } from '@aws-amplify/ui-react-core';

import { TOTPViewContextType } from './types';

const [TOTPViewContext, useTOTPViewContext] =
  createContextUtility<TOTPViewContextType>({
    initialValue: {
      totpIssuer: undefined,
      totpSecretCode: undefined,
      totpUsername: undefined,
    },
  });

export { TOTPViewContext, useTOTPViewContext };
