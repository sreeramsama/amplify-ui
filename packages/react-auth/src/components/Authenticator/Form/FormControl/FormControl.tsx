import React from 'react';
import { useFormContext } from 'react-hook-form';

import { FormControlContext } from './FormControlContext';
import { FormControlProps } from './types';

export default function FormControl({
  children,
  name,
  // setValueAs,
  validate,
}: FormControlProps): JSX.Element {
  const { formState, getFieldState, register } = useFormContext();

  // destructure the field state return to avoid recalculating `value` on each call to `getFieldState`
  // @todo call getFieldState from useMemo?
  const { error, isDirty, isTouched, invalid } = getFieldState(name, formState);

  // @todo don't think useRef is needed but keeping the code in case it all falls apart again
  // const valueRef = React.useRef(register(name, { validate }));
  const value = React.useMemo(
    // () => ({ ...valueRef.current, error, invalid, isDirty, isTouched }),
    () => ({
      ...register(name, { validate }),
      error,
      invalid,
      isDirty,
      isTouched,
    }),
    // [error, invalid, isDirty, isTouched]
    [error, invalid, isDirty, isTouched, name, register, validate]
  );

  return (
    <FormControlContext.Provider value={value}>
      {children}
    </FormControlContext.Provider>
  );
}
