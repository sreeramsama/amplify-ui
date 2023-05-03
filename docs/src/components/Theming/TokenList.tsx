import React, { useMemo } from 'react';
import { useTheme } from '@aws-amplify/ui-react';
import { createTokenList } from './utils';
import { TokenItem } from './TokenItem';
import { TokenListProps } from './types';

export function TokenList({
  namespace,
  childNamespace,
  contrastType,
  contrastBgColor,
  showContrast = false,
}: TokenListProps) {
  const { tokens } = useTheme();

  /**
   * Get the tokens from useTheme() depending on namespace and childNamespace(s).
   * e.g. for namespace: 'colors' and childNamespace: ['brand', 'primary'],
   * tokenNamespace will equal tokens.colors.brand.primary
   */
  const tokenNamespace = childNamespace
    ? childNamespace.reduce((namespace, childNamespace) => {
        return namespace && namespace[childNamespace];
      }, tokens[namespace])
    : tokens[namespace];

  /**
   * Create a more iteratable list (array) from our tokens
   */
  const tokenList = createTokenList(tokenNamespace);

  const tokenItems = useMemo(() => {
    return (
      <>
        {tokenList.map((tokenItem) => {
          const { name, path, value } = tokenItem;

          return (
            <TokenItem
              namespace={namespace}
              contrastType={contrastType}
              contrastBgColor={contrastBgColor}
              showContrast={showContrast}
              key={name}
              name={name}
              path={path}
              value={value}
            ></TokenItem>
          );
        })}
      </>
    );
  }, [tokenList, namespace, contrastBgColor, contrastType, showContrast]);
  return (
    <ul className="docs-tokenGroup docs-tokenGroup--list">{tokenItems}</ul>
  );
}
