/** This file is automatically generated. Do not edit. */
import classNames from 'classnames';
import React from 'react';

import { ComponentClassNames } from '../../shared/constants';

export const IconGradient = (props) => {
  const { className, size, fill = 'currentColor', ariaLabel, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(ComponentClassNames.Icon, className)}
      viewBox="0 0 24 24"
      data-size={size}
      aria-label={ariaLabel}
      fill={fill}
      {...rest}
    >
      <path d="M11 9h2v2h-2zm-2 2h2v2H9zm4 0h2v2h-2zm2-2h2v2h-2zM7 9h2v2H7zm12-6H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 18H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm2-7h-2v2h2v2h-2v-2h-2v2h-2v-2h-2v2H9v-2H7v2H5v-2h2v-2H5V5h14v6z" />
    </svg>
  );
};
