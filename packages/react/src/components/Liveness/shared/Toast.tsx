import * as React from 'react';
import { Flex, View, Text, AlertVariations } from '../../../primitives';
import { LivenessAlertIcon } from './LivenessAlertIcon';

interface ToastProps {
  variation?: AlertVariations;
  heading?: string;
}

export const Toast: React.FC<ToastProps> = ({
  variation,
  children,
  heading,
}) => {
  const isToastWithIcon = variation === 'success' || variation === 'error';
  return (
    <View
      padding="small"
      borderRadius="medium"
      backgroundColor="background.primary"
    >
      <Flex gap="xs" direction="column" alignItems="center">
        {isToastWithIcon || heading ? (
          <Flex
            gap="xs"
            alignItems="center"
            color={variation ? `font.${variation}` : 'font.primary'}
          >
            {isToastWithIcon ? (
              <LivenessAlertIcon variation={variation} />
            ) : null}
            {heading ? <Text fontWeight="bold">{heading}</Text> : children}
          </Flex>
        ) : null}

        {heading || !isToastWithIcon ? (
          <View color="font.primary">{children}</View>
        ) : null}
      </Flex>
    </View>
  );
};