/** This file is automatically generated. Do not edit. */
import classNames from 'classnames';
import React from 'react';

import { ComponentClassNames } from '../../shared/constants';

export const IconMarkAsUnread = (props) => {
  const { className, size, fill = 'currentColor', ariaLabel, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(ComponentClassNames.Icon, className)}
      viewBox="0 0 20 20"
      data-size={size}
      aria-label={ariaLabel}
      fill={fill}
      {...rest}
    >
      <path d="M0 0h20v20H0V0z" fill="none" />
      <path d="M17.5 6h-12C4.67 6 4 6.67 4 7.5v9c0 .83.67 1.5 1.5 1.5h12c.83 0 1.5-.67 1.5-1.5v-9c0-.83-.67-1.5-1.5-1.5zM17 9.67L11.5 13 6 9.67V8l5.5 3.33L17 8v1.67zM17 5h-3L9 3 3 5.4V15h-.5c-.83 0-1.5-.67-1.5-1.5V5.17c0-.53.3-1.09.76-1.34L9 1l7.24 2.83c.41.23.7.7.76 1.17z" />
    </svg>
  );
};
