import { FieldValues } from '../types';
import { UseFormRegisterReturn, UseFormGetFieldState } from 'react-hook-form';

import { Prettify } from '@aws-amplify/ui';

export type FormControlContextType<Values extends FieldValues = FieldValues> =
  Prettify<UseFormRegisterReturn & ReturnType<UseFormGetFieldState<Values>>>;

export type Validator<T extends FieldValues = FieldValues> = (
  value: string,
  values: T
) => string | undefined;

export type Validate = Validator | Record<string, Validator>;

export interface FormControlProps {
  children: React.ReactNode;
  name: string;
  // setValueAs?: (value: string) => string;
  validate?: Validate;
}
