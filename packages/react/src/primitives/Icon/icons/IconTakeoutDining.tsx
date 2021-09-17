/** This file is automatically generated. Do not edit. */
import classNames from 'classnames';
import React from 'react';

import { ComponentClassNames } from '../../shared/constants';

export const IconTakeoutDining = (props) => {
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
          <g>
            <polygon fill-rule="evenodd" points="5.22,9 6,16 14,16 14.78,9" />
          </g>
          <g>
            <polygon
              fill-rule="evenodd"
              points="16.3,6 15.14,7.14 12,4 8,4 4.86,7.14 3.7,6 3,6.71 4.31,8 15.69,8 17,6.71"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
