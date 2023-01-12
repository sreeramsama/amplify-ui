import classNames from 'classnames';
import * as RadixTabs from '@radix-ui/react-tabs';
import * as React from 'react';

import { ComponentClassNames } from '../shared/constants';
import { Flex } from '../Flex';
import { TabsProps, TabItemProps, Primitive } from '../types';
import { View } from '../View';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const sanitizedRadixTabs = (RadixTabs as any).default ?? RadixTabs;
const {
  Root,
  List,
  Trigger: RadixTab,
  Content: Panel,
} = sanitizedRadixTabs as typeof RadixTabs;

const isTabsType = (child: any): child is React.ReactElement<TabItemProps> => {
  return (
    child !== null &&
    typeof child === 'object' &&
    child.hasOwnProperty('props') &&
    child.props.title != null
  );
};

const TabsPrimitive: Primitive<TabsProps, typeof Flex> = (
  {
    ariaLabel,
    children,
    className,
    defaultIndex = 0,
    currentIndex,
    onChange,
    indicatorPosition,
    spacing,
    ...rest
  }: TabsProps,
  ref
) => {
  // mapping our props to Radix's props
  // value (currentIndex) and defaultValue (defaultIndex) must be strings
  // https://www.radix-ui.com/docs/primitives/components/tabs#api-reference
  const rootProps = {
    defaultValue: defaultIndex.toString(),
    // only pass value/currentIndex prop if it is defined
    value: currentIndex != null ? currentIndex.toString() : undefined,
    onValueChange: onChange,
  };

  // Remove null or undefined children or else they will mess up the index
  // This is an issue when using defaultIndex
  const nonNullChildren = React.Children.toArray(children).filter(
    (child) => !!child
  );

  return (
    <Root {...rootProps}>
      <List aria-label={ariaLabel}>
        <Flex
          className={classNames(ComponentClassNames.Tabs, className)}
          data-indicator-position={indicatorPosition}
          ref={ref}
          {...rest}
        >
          {React.Children.map(nonNullChildren, (child, index) => {
            if (isTabsType(child)) {
              return React.cloneElement(child as React.ReactElement, {
                ['data-spacing']: spacing,
                key: index,
                value: `${index}`,
              });
            }
          })}
        </Flex>
      </List>
      {React.Children.map(nonNullChildren, (child, index) => {
        if (isTabsType(child)) {
          return (
            <Panel key={index} value={`${index}`}>
              {child.props.children}
            </Panel>
          );
        } else {
          // at this point the child defined (not null or undefined)
          // it is NOT a TabItem, so log a message
          if (child) {
            console.warn(
              'Amplify UI: <Tabs> component only accepts <TabItem> as children.'
            );
          }
        }
      })}
    </Root>
  );
};

const TabItemPrimitive: Primitive<TabItemProps, 'button'> = (
  { className, title, ...rest },
  ref
) => (
  <View
    as={RadixTab}
    className={classNames(ComponentClassNames.TabItems, className)}
    ref={ref}
    {...rest}
  >
    {title}
  </View>
);

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/tabs)
 */
export const Tabs = React.forwardRef(TabsPrimitive);
export const TabItem = React.forwardRef(TabItemPrimitive);

Tabs.displayName = 'Tabs';
TabItem.displayName = 'TabItem';
