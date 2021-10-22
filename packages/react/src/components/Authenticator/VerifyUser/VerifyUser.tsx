import {
  authInputAttributes,
  censorAllButFirstAndLast,
  censorPhoneNumber,
  ContactMethod,
  getActorContext,
  SignInContext,
  translate,
} from '@aws-amplify/ui';

import { useAuthenticator } from '..';
import { Flex, Form, Heading, Radio, RadioGroupField } from '../../..';
import { RemoteErrorMessage, TwoButtonSubmitFooter } from '../shared';

const censorContactInformation = (
  type: ContactMethod,
  value: string
): string => {
  const translated = translate(type);
  let newVal = value;

  if (type === 'Phone Number') {
    newVal = censorPhoneNumber(value);
  } else if (type === 'Email') {
    const splitEmail = value.split('@');
    const censoredName = censorAllButFirstAndLast(splitEmail[0]);

    newVal = `${censoredName}@${splitEmail[1]}`;
  }

  return `${translated}: ${newVal}`;
};

const generateRadioGroup = (
  attributes: Record<string, string>
): JSX.Element[] => {
  const radioButtons: JSX.Element[] = [];

  for (const [key, value] of Object.entries(attributes)) {
    const radio = (
      <Radio name="unverifiedAttr" value={key} key={key}>
        {censorContactInformation(authInputAttributes[key].label, value)}
      </Radio>
    );

    radioButtons.push(radio);
  }

  return radioButtons;
};

export const VerifyUser = (): JSX.Element => {
  const { _state, isPending, submitForm, updateForm } = useAuthenticator();
  const context = getActorContext(_state) as SignInContext;

  const footerSubmitText = isPending ? (
    <>Verifying&hellip;</>
  ) : (
    <>{translate('Verify')}</>
  );

  const verificationRadioGroup = (
    <RadioGroupField
      label={translate('Verify Contact')}
      labelHidden={true}
      name="verify_context"
      isDisabled={isPending}
    >
      {generateRadioGroup(context.unverifiedAttributes)}
    </RadioGroupField>
  );

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
      data-amplify-authenticator-verifyuser=""
      method="post"
      onChange={handleChange}
      onSubmit={handleSubmit}
    >
      <Flex direction="column">
        <Heading level={3}>
          {translate('Account recovery requires verified contact information')}
        </Heading>

        {verificationRadioGroup}

        <RemoteErrorMessage />

        <TwoButtonSubmitFooter
          cancelButtonText={translate('Skip')}
          cancelButtonSendType="SKIP"
          submitButtonText={footerSubmitText}
        />
      </Flex>
    </Form>
  );
};
