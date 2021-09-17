/** This file is automatically generated. Do not edit. */
import classNames from 'classnames';
import React from 'react';

import { ComponentClassNames } from '../../shared/constants';

export const IconPlayDisabled = (props) => {
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
      <path
        d="M0 0h24v24H0V0zm0 0h24v24H0V0zm11.75 11.47l-.11-.11.11.11z"
        fill="none"
      />
      <path d="M8 5.19V5l11 7-2.55 1.63L8 5.19zm12 14.54l-5.11-5.11L8 7.73 4.27 4 3 5.27l5 5V19l5.33-3.4 5.4 5.4L20 19.73z" />
    </svg>
  );
};
