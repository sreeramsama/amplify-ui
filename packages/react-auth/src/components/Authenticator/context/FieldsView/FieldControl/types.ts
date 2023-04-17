import { FieldValues } from '../../FormView/types';
import { UseFormRegisterReturn, UseFormGetFieldState } from 'react-hook-form';

import { Prettify } from '@aws-amplify/ui';

export type FieldControlContextType<Values extends FieldValues = FieldValues> =
  Prettify<UseFormRegisterReturn & ReturnType<UseFormGetFieldState<Values>>>;

export type Validator<T extends FieldValues = FieldValues> = (
  value: string,
  values: T
) => string | undefined;

export type Validate = Validator | Record<string, Validator>;

export interface FieldControlProps {
  children: React.ReactNode;
  name: string;
  // setValueAs?: (value: string) => string;
  validate?: Validate;
}
