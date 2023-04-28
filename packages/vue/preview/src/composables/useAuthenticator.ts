import { createSharedComposable } from '@vueuse/core';

import { watchEffect, ref, Ref } from 'vue';
import { useMachine } from '@xstate/vue';
import { createAuthenticatorMachine, getServiceFacade } from '@aws-amplify/ui';
import { stat } from 'fs';

function useAuthenticator(): Ref<ReturnType<typeof getServiceFacade>> {
  const { state, send } = useMachine(createAuthenticatorMachine);
  const facade = ref(getServiceFacade({ state: state.value, send }));

  watchEffect(() => {
    console.log('[useAuthenticator]', 'updated facade value');
    console.log(
      '[useAuthenticator]',
      getServiceFacade({ state: state.value, send }).route
    );
    facade.value = getServiceFacade({ state: state.value, send });
  });

  return facade;
}

export default createSharedComposable(useAuthenticator);
