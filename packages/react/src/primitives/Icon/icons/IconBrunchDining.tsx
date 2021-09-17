/** This file is automatically generated. Do not edit. */
import classNames from 'classnames';
import React from 'react';

import { ComponentClassNames } from '../../shared/constants';

export const IconBrunchDining = (props) => {
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
      <g>
        <rect fill="none" height="20" width="20" />
      </g>
      <g>
        <g>
          <rect height="1" width="10" x="3" y="16" />
          <polygon points="9,13 7,13 7,14 3,14 3,15 13,15 13,14 9,14" />
          <path d="M17,9.76V3h-4v6.76c0,1.17,0.57,2.25,1.5,2.93V17H17v-1h-1.5v-3.31C16.43,12.02,17,10.94,17,9.76z M14,7V4h2v3H14z" />
        </g>
      </g>
    </svg>
  );
};
