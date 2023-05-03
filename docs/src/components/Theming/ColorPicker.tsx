import * as React from 'react';
import {
  View,
  Flex,
  Grid,
  VisuallyHidden,
  Text,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@aws-amplify/ui-react';
import { ColorPickerProps } from './types';
import { Popover } from '@/components/Popover';
import { ColorSwatch } from './ColorSwatch';

const contrastColors = [
  'background.primary',
  'background.secondary',
  'background.tertiary',
  'background.quaternary',
  'background.disabled',
  'background.info',
  'background.warning',
  'background.error',
  'background.success',
];

export const ColorPicker = ({
  contrastBgColor,
  handleBgColorChange,
}: ColorPickerProps) => {
  return (
    <>
      <Popover
        title="Contrast color options"
        triggerEl={
          <ColorSwatch
            as="button"
            color={contrastBgColor}
            aria-label={`Selected color: ${contrastBgColor}. Click to select a new contrast color.`}
          />
        }
        ariaLabelledBy="colorOptions"
      >
        <Grid
          gap="small"
          templateColumns="repeat( auto-fit, minmax(24px, 1fr) )"
        >
          {contrastColors.map((color, index) => {
            return <ColorSwatch key={index} color={color} as="button" />;
          })}
        </Grid>
      </Popover>
    </>
  );
};
