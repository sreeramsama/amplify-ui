import * as React from 'react';
import classNames from 'classnames';
import * as Dropdown from '@radix-ui/react-dropdown-menu';

import { ComponentClassNames } from '../shared/constants';
import { MenuButton } from './MenuButton';
import { MenuItemProps } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const sanitizedDropdown = (Dropdown as any).default ?? Dropdown;
const { DropdownMenuItem } = sanitizedDropdown as typeof Dropdown;

export const MENU_ITEM_TEST_ID = 'amplify-menu-item-test-id';

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/menu)
 */
export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <DropdownMenuItem asChild ref={ref}>
        <MenuButton
          className={classNames(ComponentClassNames.MenuItem, className)}
          testId={MENU_ITEM_TEST_ID}
          {...rest}
          variation="menu" // ensures `menu` variation is not overwritten
        >
          {children}
        </MenuButton>
      </DropdownMenuItem>
    );
  }
);

MenuItem.displayName = 'MenuItem';
