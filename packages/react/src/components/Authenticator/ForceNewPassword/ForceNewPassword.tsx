import { getActorContext, SignInContext, translate } from '@aws-amplify/ui';

import { useAuthenticator } from '..';
import { Button, Flex, Form, Heading, PasswordField, Text } from '../../..';

export const ForceNewPassword = (): JSX.Element => {
  const { _state, error, isPending, toSignIn, submitForm, updateForm } =
    useAuthenticator();
  const { validationError } = getActorContext(_state) as SignInContext;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    updateForm({ name, value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitForm();
  };

  return (
    <Form
      data-amplify-authenticator-forcenewpassword=""
      method="post"
      onChange={handleChange}
      onSubmit={handleSubmit}
    >
      <Flex direction="column">
        <Heading level={3}>{translate('Change Password')}</Heading>

        <Flex direction="column">
          <PasswordField
            data-amplify-password
            placeholder={translate('Password')}
            required
            name="password"
            label={translate('Password')}
            labelHidden={true}
            hasError={!!validationError['confirm_password']}
          />
          <PasswordField
            data-amplify-confirmpassword
            placeholder={translate('Confirm Password')}
            required
            name="confirm_password"
            label={translate('Confirm Password')}
            labelHidden={true}
            hasError={!!validationError['confirm_password']}
          />

          {!!validationError['confirm_password'] && (
            <Text variation="error">{validationError['confirm_password']}</Text>
          )}
        </Flex>

        {error && (
          <Text className="forceNewPasswordErrorText" variation="error">
            {error}
          </Text>
        )}

        <Button
          isDisabled={isPending}
          type="submit"
          variation="primary"
          isLoading={isPending}
          loadingText={translate('Changing')}
          fontWeight="normal"
        >
          {translate('Change Password')}
        </Button>
        <Button
          onClick={toSignIn}
          type="button"
          fontWeight="normal"
          variation="link"
          size="small"
        >
          {translate('Back to Sign In')}
        </Button>
      </Flex>
    </Form>
  );
};
