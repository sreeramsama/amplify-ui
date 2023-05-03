import * as React from 'react';
import { View, Text } from '@aws-amplify/ui-react';
import { ColorSwatch } from './ColorSwatch';
import {
  GenericBlockProps,
  SpaceBlockProps,
  BorderWidthBlockProps,
  FontBlockProps,
  FontSizeBlockProps,
  FontWeightBlockProps,
  FontFamilyBlockProps,
  LineHeightBlockProps,
  RadiusBlockProps,
  TokenBlockProps,
} from './types';

export function GenericBlock({ value }: GenericBlockProps) {
  return <div>{value}</div>;
}

export function SpaceBlock({ value }: SpaceBlockProps) {
  return (
    <View className="docs-spaceBlock">
      <View className="docs-spaceBlock-inner" width={value}></View>
    </View>
  );
}

export function BorderWidthBlock({ value }: BorderWidthBlockProps) {
  return (
    <View
      className="docs-borderBlock"
      backgroundColor="var(--amplify-colors-teal-80)"
      height={value}
    ></View>
  );
}

export function FontBlock({ children }: FontBlockProps) {
  return (
    <View className="docs-fontBlock" aria-hidden="true">
      {children}
    </View>
  );
}

export function FontSizeBlock({ value }: FontSizeBlockProps) {
  return (
    <FontBlock>
      <View width="4rem" align="right" fontSize={value}>
        Aa
      </View>
    </FontBlock>
  );
}

export function LineHeightBlock({ value }: LineHeightBlockProps) {
  return (
    <FontBlock>
      <View
        style={{ display: 'inline-Block' }}
        backgroundColor="var(--amplify-colors-teal-20)"
        fontSize="var(--amplify-fontSizes-large"
        lineHeight={value}
      >
        Aa
      </View>
    </FontBlock>
  );
}

export function FontFamilyBlock({ value }: FontFamilyBlockProps) {
  return (
    <FontBlock>
      <Text fontSize="var(--amplify-font-sizes-xxl" fontFamily={value}>
        The quick brown fox jumps over the lazy dog.
      </Text>
    </FontBlock>
  );
}

export function FontWeightBlock({ value }: FontWeightBlockProps) {
  return (
    <FontBlock>
      <Text fontSize="var(--amplify-font-sizes-large" fontWeight={value}>
        Aa
      </Text>
    </FontBlock>
  );
}

export function RadiusBlock({ value }: RadiusBlockProps) {
  const minBlockSize = 'calc(2rem + 1px)';
  const svgDims = `max(${minBlockSize}, calc(2 * ${value} + 1px))`;
  const rectDims = `max(4rem, calc(4 * ${value}))`;
  const circleCenter = `calc(${value} + 1px)`;

  return (
    <div className="docs-radiusBlock">
      <svg width={svgDims} height={svgDims} xmlns="http://www.w3.org/2000/svg">
        <rect
          x="1"
          y="1"
          strokeWidth="1px"
          stroke="var(--amplify-colors-neutral-60)"
          className="docs-radiusBlock-border"
          fill="transparent"
          width={rectDims}
          height={rectDims}
          rx={value}
        ></rect>
        <circle
          fill="hsla(340, 50%, 50%, 60%)"
          cx={`calc(${svgDims} - ${circleCenter}`}
          cy={circleCenter}
          r={value}
        ></circle>
      </svg>
    </div>
  );
}

const TokenBlockPrimitive = (
  { namespace, value }: TokenBlockProps,
  ref: React.Ref<HTMLDivElement>
) => {
  switch (namespace) {
    case 'fontWeights':
      return <FontWeightBlock value={value} />;
    case 'fontSizes':
      return <FontSizeBlock value={value} />;
    case 'fonts':
      return <FontFamilyBlock value={value} />;
    case 'lineHeights':
      return <LineHeightBlock value={value} />;
    case 'borderWidths':
      return <BorderWidthBlock value={value} />;
    case 'space':
      return <SpaceBlock value={value} />;
    case 'colors':
      return <ColorSwatch color={value} ref={ref} />;
    case 'radii':
      return <RadiusBlock value={value} />;
    default:
      return <GenericBlock value={value} />;
  }
};

export const TokenBlock = React.forwardRef(TokenBlockPrimitive);
