<script setup lang="ts">
import { onMounted, reactive, computed, ComputedRef, useAttrs, ref } from 'vue';
import QRCode from 'qrcode';

import { Logger } from 'aws-amplify';
import {
  authenticatorTextUtil,
  getActorState,
  getFormDataFromEvent,
  SignInState,
  translate,
  getTotpCodeURL,
} from '@aws-amplify/ui';

import { useAuth, useAuthenticator } from '../composables/useAuth';
import BaseFormFields from './primitives/base-form-fields.vue';

const logger = new Logger('SetupTOTP-logger');

const props = useAuthenticator();

const attrs = useAttrs();
const emit = defineEmits(['confirmSetupTOTPSubmit', 'backToSignInClicked']);

const { state, send } = useAuth();
const {
  value: { context },
} = state;

const actorState = computed(() =>
  getActorState(state.value)
) as ComputedRef<SignInState>;
const { totpSecretCode, user } = actorState.value.context;

const formOverrides = context?.config?.formFields?.setupTOTP;
const { totpIssuer = 'AWSCognito', totpUsername = user?.username } =
  formOverrides?.['QR'] ?? {};

const totpCodeURL =
  typeof totpSecretCode === 'string' && typeof totpUsername === 'string'
    ? getTotpCodeURL(totpIssuer, totpUsername, totpSecretCode)
    : null;

const qrCode = reactive({
  qrCodeImageSource: '',
  isLoading: true,
});

// Text Util
const { getCopyText, getCopiedText, getBackToSignInText, getConfirmText } =
  authenticatorTextUtil;

const copyTextLabel = ref(getCopyText());

function copyText() {
  if (typeof totpSecretCode === 'string') {
    navigator.clipboard.writeText(totpSecretCode);
  }
  copyTextLabel.value = getCopiedText();
}

// lifecycle hooks
onMounted(async () => {
  if (!user || !totpCodeURL) {
    return;
  }
  try {
    qrCode.qrCodeImageSource = await QRCode.toDataURL(totpCodeURL);
  } catch (error) {
    logger.error(error);
  } finally {
    qrCode.isLoading = false;
  }
});

// Computed Properties
const backSignInText = computed(() => getBackToSignInText());
const confirmText = computed(() => getConfirmText());

// Methods
const onInput = (e: Event): void => {
  const { name, value } = e.target as HTMLInputElement;
  send({ type: 'CHANGE', data: { name, value } });
};

const onSetupTOTPSubmit = (e: Event): void => {
  if (attrs?.onConfirmSetupTOTPSubmit) {
    emit('confirmSetupTOTPSubmit', e);
  } else {
    submit(e);
  }
};

const submit = (e: Event): void => {
  props.submitForm(getFormDataFromEvent(e));
};

const onBackToSignInClicked = (): void => {
  if (attrs?.onBackToSignInClicked) {
    emit('backToSignInClicked');
  } else {
    send({ type: 'SIGN_IN' });
  }
};
</script>

<template>
  <slot v-bind="$attrs" name="confirmSetupTOTPI">
    <base-wrapper v-bind="$attrs">
      <base-form
        data-amplify-authenticator-setup-totp
        @input="onInput"
        @submit.prevent="onSetupTOTPSubmit"
      >
        <base-field-set
          class="amplify-flex amplify-authenticator__column"
          :disabled="actorState.matches('confirmSignIn.pending')"
        >
          <base-wrapper class="amplify-flex amplify-authenticator__column">
            <slot name="header">
              <base-heading class="amplify-heading" :level="3">
                Setup TOTP
              </base-heading>
            </slot>

            <base-wrapper class="amplify-flex amplify-authenticator__column">
              <template v-if="qrCode.isLoading">
                <p>Loading...</p>
              </template>
              <template v-else>
                <img
                  class="amplify-image"
                  data-amplify-qrcode
                  :src="qrCode.qrCodeImageSource"
                  alt="qr code"
                  width="228"
                  height="228"
                />
              </template>
              <base-wrapper class="amplify-flex" data-amplify-copy>
                <div>{{ totpSecretCode }}</div>
                <base-wrapper data-amplify-copy-svg @click="copyText">
                  <div data-amplify-copy-tooltip>{{ copyTextLabel }}</div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM15 5H8C6.9 5 6.01 5.9 6.01 7L6 21C6 22.1 6.89 23 7.99 23H19C20.1 23 21 22.1 21 21V11L15 5ZM8 21V7H14V12H19V21H8Z"
                    />
                  </svg>
                </base-wrapper>
              </base-wrapper>
              <base-form-fields route="setupTOTP"></base-form-fields>
            </base-wrapper>
            <base-footer class="amplify-flex amplify-authenticator__column">
              <base-alert v-if="actorState.context?.remoteError">
                {{ translate(actorState.context.remoteError) }}
              </base-alert>
              <amplify-button
                class="amplify-field-group__control amplify-authenticator__font"
                :fullwidth="false"
                :loading="false"
                :variation="'primary'"
                type="submit"
                :disabled="actorState.matches('confirmSignIn.pending')"
              >
                {{ confirmText }}
              </amplify-button>
              <amplify-button
                class="amplify-field-group__control amplify-authenticator__font"
                :fullwidth="false"
                :size="'small'"
                :variation="'link'"
                style="font-weight: normal"
                type="button"
                @click.prevent="onBackToSignInClicked"
              >
                {{ backSignInText }}</amplify-button
              >
              <slot
                name="footer"
                :onBackToSignInClicked="onBackToSignInClicked"
                :onSetupTOTPSubmit="onSetupTOTPSubmit"
              >
              </slot>
            </base-footer>
          </base-wrapper>
        </base-field-set>
      </base-form>
    </base-wrapper>
  </slot>
</template>
