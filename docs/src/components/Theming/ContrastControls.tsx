import * as React from 'react';
import { Flex, Text, Radio, RadioGroupField } from '@aws-amplify/ui-react';
import { ColorPicker } from './ColorPicker';
import { ContrastControlProps } from './types';

export const ContrastControls = ({
  contrastType,
  handleContrastTypeChange,
  handleBgColorChange,
  contrastBgColor,
}: ContrastControlProps) => {
  return (
    <Flex
      role="region"
      aria-label="Contrast controls for color values"
      className="docs-contrastControls"
    >
      <RadioGroupField
        size="small"
        label={<Text fontWeight="bold">WCAG 2.1</Text>}
        name="WCAG"
        direction="row"
        value={contrastType}
        onChange={handleContrastTypeChange}
      >
        <Radio value="textContrast">4.5:1</Radio>
        <Radio value="uiContrast">3:1</Radio>
      </RadioGroupField>
      <ColorPicker
        contrastBgColor={contrastBgColor}
        handleBgColorChange={handleBgColorChange}
      />
    </Flex>
  );
};
