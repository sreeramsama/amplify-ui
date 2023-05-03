import {
  ColorValue,
  FontWeightValue,
  FontValue,
  LineHeightValue,
  FontSizeValue,
  BorderWidthValue,
  SpaceValue,
  RadiusValue,
} from '@aws-amplify/ui';

import { ViewProps } from '@aws-amplify/ui-react';

export type Namespace =
  | 'colors'
  | 'radii'
  | 'space'
  | 'borderWidths'
  | 'lineHeights'
  | 'fonts'
  | 'fontSizes'
  | 'fontWeights';

export type TokenItemProps = {
  namespace: Namespace;
  value: string;
  path: string[];
  name: string;
  contrastType?: ContrastType;
  contrastBgColor?: ColorValue;
  showContrast?: boolean;
};

export interface TokenPathProps {
  path: Array<string>;
}

export interface TokenMetaProps {
  children: React.ReactNode;
  className?: string;
}

export interface TokenListProps {
  namespace: Namespace;
  /**
   * TODO: better type for childNamespace? This should be children
   * of whatever namespace you chose. e.g. namespace: 'colors', childNamespace: 'brand,primary'
   */
  childNamespace?: Array<string>;
  contrastType?: ContrastType;
  contrastBgColor?: ColorValue;
  showContrast?: boolean;
}

export interface GenericBlockProps {
  value: string;
}

export interface SpaceBlockProps {
  value: SpaceValue;
}

export interface BorderWidthBlockProps {
  value: BorderWidthValue;
}

export interface FontBlockProps {
  children: React.ReactNode;
}

export interface FontSizeBlockProps {
  value: FontSizeValue;
}

export interface LineHeightBlockProps {
  value: LineHeightValue;
}

export interface FontFamilyBlockProps {
  value: FontValue;
}

export interface FontWeightBlockProps {
  value: FontWeightValue;
}

// export interface ColorBlockProps {
//   value: ColorValue;
// }

export interface RadiusBlockProps {
  value: RadiusValue;
}

export interface TokenBlockProps {
  namespace: Namespace;
  value: string;
}

export interface ColorPickerProps {
  contrastBgColor: ColorValue;
  handleBgColorChange: ((value: string | undefined) => void) | undefined;
}

export type ContrastType = 'uiContrast' | 'textContrast';

export interface ContrastControlProps extends ColorPickerProps {
  contrastType: ContrastType;
  handleContrastTypeChange:
    | React.ChangeEventHandler<HTMLInputElement>
    | undefined;
}

export interface ColorSwatchProps extends ViewProps {
  color: ColorValue;
  className?: string | undefined;
}
