import * as React from 'react';
import { configureComponent } from '@aws-amplify/ui';

import { Heading } from '@aws-amplify/ui-react';
import {
  AuthenticatorProvider as Provider,
  useAuthenticator,
  isAuthenticatorComponentRouteKey,
  useAuthenticatorInitMachine,
} from '@aws-amplify/ui-react-core-auth';

import { VERSION } from '../../version';

import { defaultDisplayText } from './displayText';
import {
  ContainerView as DefaultContainerView,
  CopyButton,
  Fields as DefaultFields,
  Field,
  Form as DefaultForm,
  SubmitButton as DefaultSubmitButton,
  ErrorView as DefaultErrorView,
  LinkView as DefaultLinkView,
  getLinkButtonOptions,
  getFederatedProviderOptions,
  FederatedProviderView as DefaultFederatedProviderView,
  TOTPView as DefaultTOTPView,
} from './ui';
import { getDefaultFields } from './utils';
import { AuthenticatorProps } from './types';

// type RouteLinkButtonProps<Route extends AuthenticatorRoute> = Route extends
//   | 'signIn'
//   | 'signUp'
//   | 'resetPassword'
//   | 'forceNewPassword'
//   ? LinkButtonProps[]
//   : undefined;

// `AuthenticatorInternal` exists to give access to the context returned via `useAuthenticator`,
// which allows the `Authenticator` to just return `children` if a user is authenticated.
// Once the `Provider` is removed from the `Authenticator` component and exported as
// `AuthenticatorProvider`, this component should be renamed to `Authenticator`.
export function AuthenticatorInternal({
  // hideSignUp,
  children,
  displayText: overrideDisplayText,
  ContainerView = DefaultContainerView,
  ErrorView = DefaultErrorView,
  FederatedProviderView = DefaultFederatedProviderView,
  Form = DefaultForm,
  formFields,
  initialState,
  LinkView = DefaultLinkView,
  loginMechanisms,
  TOTPView = DefaultTOTPView,
  services,
  signUpAttributes,
  socialProviders,
  SubmitButton = DefaultSubmitButton,
  variation,
}: AuthenticatorProps): JSX.Element | null {
  // @todo rename error to submitError (or similar)?
  const { error, isPending, route, setNavigableRoute, submitForm } =
    useAuthenticator(({ error, isPending, route }) => [
      error,
      isPending,
      route,
    ]);

  React.useEffect(() => {
    configureComponent({
      packageName: '@aws-amplify/ui-react',
      version: VERSION,
    });
  }, []);

  useAuthenticatorInitMachine({
    initialState,
    // @todo how to surface this back to the UI for passing to getDefaultFields
    loginMechanisms,
    services,
    signUpAttributes,
    socialProviders,
    formFields,
  });

  // const props = useAuthenticatorProps({ route });

  const displayText = React.useMemo(
    () => ({ ...overrideDisplayText, ...defaultDisplayText }),
    [overrideDisplayText]
  );

  const fields = React.useMemo(
    () => getDefaultFields({ route, loginMechanism: loginMechanisms?.[0] }),
    [route, loginMechanisms]
  );

  const formRef = React.useRef<React.ElementRef<typeof DefaultForm>>(null);

  // @todo clear `Form` on initial mount or unmount
  // @todo prevemt reset on submit events
  React.useEffect(() => {
    // @todo any componentrecieving this needs to be wrapped forwardRef
    // return () => {
    // formRef.current?.reset();
    // };
  });

  const isAuthenticatedRoute = route === 'authenticated' || route === 'signOut';

  if (isAuthenticatedRoute) {
    if (!children) {
      return null;
    }

    return <>{children}</>;
  }

  if (!isAuthenticatorComponentRouteKey(route)) {
    return null;
  }

  const { headingText, submitButtonText } = displayText[route];

  const hasFederatedProviders = route === 'signIn' || route === 'signUp';

  const totpProps = {
    totpSecretCode: 'Secret!',
    // totpSecretCode: undefined,
    totpIssuer: 'AWSCognito',
    totpUsername: 'username',
  };

  const links = getLinkButtonOptions({ displayText, route, setNavigableRoute });
  const providers = hasFederatedProviders
    ? getFederatedProviderOptions(
        socialProviders,
        displayText[route].getFederatedProviderButtonText,
        (provider) => {
          // eslint-disable-next-line no-console
          console.log('provider', provider);
        }
      )
    : undefined;

  const handleSubmit = (data: Record<string, string>) => {
    // eslint-disable-next-line no-console
    console.log('Sbbbbbbbbmit', data);

    submitForm(data);
  };

  // const Override = components?.[route];
  // if (Override) {
  //   return <Override {...props} />;
  // }

  return (
    <ContainerView variation={variation}>
      {/* <CustomHeaderProp /> */}
      <Form onSubmit={handleSubmit} ref={formRef}>
        <Heading level={3}>{headingText}</Heading>

        <FederatedProviderView providerOptions={providers} />

        <TOTPView {...totpProps}>
          <CopyButton target="secret code">
            {displayText['setupTOTP'].getCopyTooltipText}
          </CopyButton>
        </TOTPView>
        <DefaultFields fields={fields} />
        <ErrorView>{error}</ErrorView>
        <DefaultForm.ButtonControl type="submit">
          <SubmitButton isDisabled={isPending}>{submitButtonText}</SubmitButton>
        </DefaultForm.ButtonControl>
        <LinkView links={links} />
      </Form>
    </ContainerView>
  );
}

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/connected-components/authenticator)
 */
export function Authenticator(props: AuthenticatorProps): JSX.Element {
  return (
    <Provider>
      <AuthenticatorInternal {...props} />
    </Provider>
  );
}

Authenticator.Provider = Provider;
Authenticator.Field = Field;
Authenticator.Form = DefaultForm;
Authenticator.ErrorView = DefaultErrorView;
Authenticator.SubmitButton = DefaultSubmitButton;
Authenticator.TOTPView = DefaultTOTPView;
Authenticator.FederatedProviderView = DefaultFederatedProviderView;

// Authenticator.Container = ...;

// should these take children?
// Authenticator.Field = ...;