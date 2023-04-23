import * as React from 'react';

import { configureComponent } from '@aws-amplify/ui';
import {
  AuthenticatorProvider as Provider,
  useAuthenticator,
  isAuthenticatorComponentRouteKey,
  useAuthenticatorInitMachine,
} from '@aws-amplify/ui-react-core-auth';

import { VERSION } from '../../version';

import {
  // withFieldsView,
  withFormView,
  // withSubmitView,
  withTOTPView,
} from './context';
import { FormHandle } from './BaseForm';
import {
  ContainerView as DefaultContainerView,
  FieldsView as BaseFieldsView,
  Field,
  Heading as DefaultHeading,
  SubmitButton as DefaultSubmitButton,
  ErrorView,
  LinksView,
  FederatedProvidersView,
  SubHeading as DefaultSubHeading,
  TOTPView as BaseTOTPView,
  FormView as BaseFormView,
  SubmitButton,
} from './ui';

import { AuthenticatorProps } from './types';
import { Auth } from 'aws-amplify';

export const useFetchUser = (): void => {
  const [user, setUser] = React.useState<Record<string, any> | undefined>();
  // eslint-disable-next-line no-console
  console.log('user', user);

  const fetchUser = React.useCallback(async () => {
    const output = (await Auth.currentAuthenticatedUser()) as
      | Record<string, any>
      | undefined;
    setUser(output);
  }, []);

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);
};

// const createAUthenticator = ({ views, options }) => {
//   const DefaultTOTPView = createTOTPView(BaseTOTPView);

//   Authenticator
// }

// const totpProps = {
//   totpSecretCode: 'Secret!',
//   // totpSecretCode: undefined,
//   totpIssuer: 'AWSCognito',
//   totpUsername: 'username',
// };

const DefaultFormView = withFormView(BaseFormView);
const DefaultTOTPView = withTOTPView(BaseTOTPView);

export function AuthenticatorInternal({
  // @todo create example showing how to do this without prop
  // hideSignUp,
  children,
  displayText: overrideDisplayText,
  ContainerView: OverrideContainerView,
  // ErrorView = DefaultErrorView,
  // FederatedProvidersView = DefaultFederatedProvidersView,
  // Form = DefaultForm,
  initialState,
  // Links = DefaultLinks,
  loginMechanisms,
  TOTPView: OverrideTOTPView,
  services,
  signUpAttributes,
  socialProviders,
  // SubmitButton = DefaultSubmitButton,
  variation,
}: AuthenticatorProps): JSX.Element | null {
  // eslint-disable-next-line no-console
  console.count('A.Render');

  // useFetchUser();
  const { ContainerView, TOTPView } = React.useMemo(
    () => ({
      ContainerView: OverrideContainerView ?? DefaultContainerView,
      TOTPView: OverrideTOTPView
        ? withTOTPView(OverrideTOTPView)
        : DefaultTOTPView,
    }),
    [OverrideContainerView, OverrideTOTPView]
  );

  const { route } = useAuthenticator(({ route }) => [route]);

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
  });

  const formRef = React.useRef<FormHandle>(null);

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

  // const Override = components?.[route];
  // if (Override) {
  //   // @todo "props" will match the context value that is passed to ContainerView Context
  //   // DisplayTextProvider and RouteContext.Provider will wrap both
  //   return <Override {...props} />;
  // }

  return (
    <DefaultFormView displayText={overrideDisplayText} ref={formRef}>
      <ContainerView variation={variation}>
        <DefaultHeading />
        <DefaultSubHeading />
        <FederatedProvidersView />
        <TOTPView />
        {/* No HOC here, fomr needs access */}
        <BaseFieldsView />
        <ErrorView />
        <SubmitButton />
        <LinksView />
      </ContainerView>
    </DefaultFormView>
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

// @todo should Form be part of the wrapping component, and not a static property

// do not require a View context
Authenticator.Provider = Provider;
Authenticator.Heading = DefaultHeading;
Authenticator.SubHeading = DefaultSubHeading;

// require a View context
Authenticator.ContainerView = DefaultContainerView;
Authenticator.ErrorView = ErrorView;
Authenticator.FieldsView = BaseFieldsView;
// Authenticator.Field = BaseFieldsView;
Authenticator.TOTPView = DefaultTOTPView;
Authenticator.FederatedProvidersView = FederatedProvidersView;

Authenticator.Field = Field;
Authenticator.SubmitButton = DefaultSubmitButton;
