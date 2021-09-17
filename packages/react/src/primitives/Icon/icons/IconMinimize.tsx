/** This file is automatically generated. Do not edit. */
import classNames from 'classnames';
import React from 'react';

import { ComponentClassNames } from '../../shared/constants';

export const IconMinimize = (props) => {
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
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M6 19h12v2H6z" />
    </svg>
  );
};
