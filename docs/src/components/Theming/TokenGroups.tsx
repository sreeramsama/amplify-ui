import { TokenList } from './TokenList';

// Utility components since MDX doesn't support typechecking :(

// Size
export const TokensSizeSpace = () => <TokenList namespace="space" />;
export const TokensSizeBorderWidths = () => (
  <TokenList namespace="borderWidths" />
);
export const TokensSizeRadii = () => <TokenList namespace="radii" />;

// Typography
export const TokensTypographyFontWeights = () => (
  <TokenList namespace="fontWeights" />
);
export const TokensTypographyFontSizes = () => (
  <TokenList namespace="fontSizes" />
);
export const TokensTypographyLineHeights = () => (
  <TokenList namespace="lineHeights" />
);
export const TokensTypographyFonts = () => <TokenList namespace="fonts" />;
