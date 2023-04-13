import React from 'react';

import { Heading as BaseHeading } from '@aws-amplify/ui-react';
import { resolveChildrenOrCallback } from '@aws-amplify/ui-react-core';

import { useRoute, useDisplayText } from '../../context';
import { createDisplayName } from '../utils';

type HeadingProps = Parameters<typeof BaseHeading>[0];
export type HeadingComponent<P = {}> = React.ComponentType<HeadingProps & P>;

const DEFAULT_LEVEL: HeadingProps['level'] = 3;

const Heading: HeadingComponent = ({
  children,
  level = DEFAULT_LEVEL,
  ...props
}) => {
  const { route } = useRoute();
  const { getHeadingText } = useDisplayText();

  return (
    <BaseHeading {...props} level={level}>
      {children ? children : resolveChildrenOrCallback(getHeadingText, route)}
    </BaseHeading>
  );
};

Heading.displayName = createDisplayName('Heading');

export default Heading;
