/** This file is automatically generated. Do not edit. */
import classNames from 'classnames';
import React from 'react';

import { ComponentClassNames } from '../../shared/constants';

export const IconExplicit = (props) => {
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
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h4v2h-4v2h4v2H9V7h6v2z" />
    </svg>
  );
};
