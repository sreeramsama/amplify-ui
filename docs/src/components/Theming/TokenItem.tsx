import React from 'react';
import classNames from 'classnames';
import { MdSubdirectoryArrowRight, MdCheck, MdClose } from 'react-icons/md';
import Color from 'colorjs.io';
import { View, Flex, Badge } from '@aws-amplify/ui-react';

import { TokenItemProps, TokenPathProps, TokenMetaProps } from './types';
import { TokenBlock } from './TokenBlocks';

export function TokenPath({ path }: TokenPathProps) {
  return (
    <div className="docs-tokenItem-path">
      {path.map((pathFragment, index) => {
        /**
         * We show a delimiter (.) between path fragments, unless that
         * fragment is first in the list, or can be interpreted as a number.
         * We use isNaN() here because our path returns all fragments as strings.
         **/
        const showDelimiter = index !== 1 && isNaN(pathFragment as any);

        /**
         * Wrap any path fragments that can be interpreted as a number in brackets.
         */
        const wrapFragmentInBrackets = !isNaN(pathFragment as any);

        /**
         * Skip the first index which matches our namespace and is redundant in the UI
         */
        return index !== 0 ? (
          <React.Fragment key={index}>
            {showDelimiter && '.'}
            {wrapFragmentInBrackets ? `[${pathFragment}]` : pathFragment}
          </React.Fragment>
        ) : null;
      })}
    </div>
  );
}

export function TokenMeta({ children, className }: TokenMetaProps) {
  return (
    <div className={classNames('docs-tokenItem-meta', className)}>
      {children}
    </div>
  );
}

export const TokenItem = ({
  namespace,
  value,
  path,
  name,
  contrastType = 'uiContrast',
  contrastBgColor = 'white',
  showContrast = false,
}: TokenItemProps) => {
  const colorRef = React.useRef(null);
  const [contrast, setContrast] = React.useState(null);
  const [foregroundColor, setForegroundColor] = React.useState(null);
  const [hasValidContrast, setHasValidContrast] = React.useState(false);
  const threshold = contrastType === 'uiContrast' ? 3.0 : 4.5;
  React.useEffect(() => {
    if (colorRef.current && showContrast) {
      console.log(colorRef.current);
      const color = getComputedStyle(colorRef.current).getPropertyValue(
        'background-color'
      );
      const foregroundColor = new Color(color);
      const backgroundColor = new Color(contrastBgColor);
      const WCAGContrast = backgroundColor
        .contrastWCAG21(foregroundColor)
        .toFixed(2);
      setHasValidContrast(parseFloat(WCAGContrast) >= threshold);
      setContrast(WCAGContrast);
      setForegroundColor(foregroundColor);
    }
  }, [contrast, contrastBgColor, threshold, showContrast]);
  return (
    <li className={`docs-tokenItem docs-tokenItem--${namespace}`}>
      <TokenBlock
        namespace={namespace}
        ref={namespace === 'colors' ? colorRef : null}
        value={value}
      />
      <TokenPath path={path} />
      <TokenMeta>
        <Flex direction="column" gap="xs">
          <View>{name}</View>
          <View className="docs-tokenItem-meta__nested">
            <MdSubdirectoryArrowRight /> {value}
          </View>
        </Flex>
      </TokenMeta>
      {namespace === 'colors' && showContrast ? (
        <TokenMeta className="docs-tokenItem-meta--contrast">
          <Flex
            gap="xxxs"
            alignItems="center"
            color={hasValidContrast ? 'green.80' : 'red.80'}
          >
            <Badge
              style={{
                backgroundColor: contrastBgColor,
                color: foregroundColor,
                border: '1px solid var(--amplify-colors-overlay-20)',
              }}
            >
              Aa
            </Badge>
            {hasValidContrast ? <MdCheck /> : <MdClose />}
            {threshold}:1
          </Flex>
        </TokenMeta>
      ) : null}
    </li>
  );
};
