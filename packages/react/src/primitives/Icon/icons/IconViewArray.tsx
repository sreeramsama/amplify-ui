/** This file is automatically generated. Do not edit. */
import classNames from 'classnames';
import React from 'react';

import { ComponentClassNames } from '../../shared/constants';

export const IconViewArray = (props) => {
  const { className, size, fill = 'currentColor', ariaLabel, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 20 20"
      className={classNames(ComponentClassNames.Icon, className)}
      viewBox="0 0 20 20"
      data-size={size}
      aria-label={ariaLabel}
      fill={fill}
      {...rest}
    >
      <rect fill="none" height="20" width="20" />
      <path d="M3,5h2v10H3V5z M15,5v10h2V5H15z M6,5h8v10H6V5z" />
    </svg>
  );
};
