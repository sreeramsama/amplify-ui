import * as React from 'react';
import { useActor } from '@xstate/react';
import { I18n } from 'aws-amplify';

import { useLivenessFlow } from '../providers';
import { useTheme } from '../../../hooks';
import { Flex, IconCheckCircleOutline, Loader, View } from '../../..';

export interface InstructionProps {
  isMobileScreen: boolean;
}

export const Instruction: React.FC<InstructionProps> = (props) => {
  const { isMobileScreen } = props;

  const { tokens } = useTheme();
  const { service } = useLivenessFlow();
  const [state] = useActor(service);

  const isNotRecording = state.matches('notRecording');
  const isUploading = state.matches('uploading');
  const isSuccessful = state.matches('end');

  const getInstructionContent = () => {
    if (isNotRecording) {
      return I18n.get(
        'Once recording begins, move your face inside the frame that appears'
      );
    }
    if (isUploading) {
      return (
        <Flex gap={`${tokens.space.xxs}`} alignItems="center">
          <Loader />
          <span>{I18n.get('Authenticating...')}</span>
        </Flex>
      );
    }
    if (isSuccessful) {
      return (
        <Flex
          gap={`${tokens.space.xs}`}
          color={
            isMobileScreen
              ? `${tokens.colors.green[40]}`
              : `${tokens.colors.green[100]}`
          }
          alignItems="flex-end"
        >
          <IconCheckCircleOutline size="large" viewBox="0 0 20 20" />
          <span>{I18n.get('Check succeeded!')}</span>
        </Flex>
      );
    }

    return state.context.faceMatchState;
  };

  return (
    <Flex
      borderRadius={`${tokens.radii.medium}`}
      width={{ base: '80%', medium: '100%' }}
      backgroundColor={{
        base: `${tokens.colors.black}`,
        medium: `${tokens.colors.transparent}`,
      }}
      padding={`${tokens.space.small}`}
      style={{ opacity: 0.5 }}
    >
      <View
        color={{
          base: `${tokens.colors.white}`,
          medium: `${tokens.colors.black}`,
        }}
      >
        {getInstructionContent()}
      </View>
    </Flex>
  );
};
