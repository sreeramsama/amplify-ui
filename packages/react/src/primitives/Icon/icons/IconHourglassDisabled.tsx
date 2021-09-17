/** This file is automatically generated. Do not edit. */
import classNames from 'classnames';
import React from 'react';

import { ComponentClassNames } from '../../shared/constants';

export const IconHourglassDisabled = (props) => {
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
          <polygon points="7,4 13,4 13,6.59 10.5,9.09 11.21,9.79 14,7 14,7 14,3 6,3 6,4.59 7,5.59" />
          <path d="M2.93,2.93L2.22,3.64l6.57,6.57L6,13h0v4h8v-1.59l2.36,2.36l0.71-0.71L2.93,2.93z M13,16H7l0-2.59l2.5-2.5l3.5,3.5V16z" />
        </g>
      </g>
    </svg>
  );
};
