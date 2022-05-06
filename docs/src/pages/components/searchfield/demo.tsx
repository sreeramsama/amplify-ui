import * as React from 'react';

import { SearchField, SearchFieldProps } from '@aws-amplify/ui-react';
import { useSearchFieldProps } from './useSearchFieldProps';
import { SearchFieldPropControls } from './SearchFieldPropControls';
import { Demo } from '@/components/Demo';
import { demoState } from '@/utils/demoState';

const propsToCode = (searchFieldProps) => {
  return (
    `<SearchField` +
    `\n  label=${JSON.stringify(searchFieldProps.label)}` +
    (searchFieldProps.placeholder
      ? `\n  placeholder=${JSON.stringify(searchFieldProps.placeholder)}`
      : '') +
    (searchFieldProps.size
      ? `\n  size=${JSON.stringify(searchFieldProps.size)}`
      : '') +
    (searchFieldProps.variation
      ? `\n  variation=${JSON.stringify(searchFieldProps.variation)}`
      : '') +
    (!searchFieldProps.labelHidden
      ? `\n  labelHidden={${JSON.stringify(searchFieldProps.labelHidden)}}`
      : '') +
    (searchFieldProps.isDisabled
      ? `\n  isDisabled={${JSON.stringify(searchFieldProps.isDisabled)}}`
      : '') +
    `\n/>`
  );
};

const defaultSearchFieldProps = {
  isDisabled: false,
  label: 'Search',
  labelHidden: true,
  placeholder: 'Search here...',
  size: null,
  variation: null,
};

export const SearchFieldDemo = () => {
  const searchFieldProps = useSearchFieldProps(
    (demoState.get(SearchField.displayName) as SearchFieldProps) ||
      defaultSearchFieldProps
  );

  const onSubmit = React.useCallback(
    (value) => alert(`you searched for ${value}`),
    []
  );

  return (
    <Demo
      code={propsToCode(searchFieldProps)}
      propControls={<SearchFieldPropControls {...searchFieldProps} />}
    >
      <SearchField
        label={searchFieldProps.label}
        placeholder={searchFieldProps.placeholder}
        size={searchFieldProps.size}
        variation={searchFieldProps.variation}
        labelHidden={searchFieldProps.labelHidden}
        isDisabled={searchFieldProps.isDisabled}
        onSubmit={onSubmit}
      />
    </Demo>
  );
};
