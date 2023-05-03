import * as React from 'react';
import { View } from '@aws-amplify/ui-react';
import classNames from 'classnames';
import { ColorSwatchProps } from './types';

export const ColorSwatchPrimitive = (
  { color, className, ...rest }: ColorSwatchProps,
  ref: React.Ref<HTMLDivElement>
) => {
  return (
    <View
      className={classNames('docs-colorSwatch', className)}
      backgroundColor={color}
      ref={ref}
      {...rest}
    ></View>
  );
};

export const ColorSwatch = React.forwardRef(ColorSwatchPrimitive);
