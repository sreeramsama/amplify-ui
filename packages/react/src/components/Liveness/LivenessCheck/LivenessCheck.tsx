import * as React from 'react';
import {
  translate,
  LIVENESS_EVENT_LIVENESS_CHECK_SCREEN,
  LivenessErrorState,
} from '@aws-amplify/ui';

import { useTheme } from '../../../hooks';
import { LivenessCameraModule } from './LivenessCameraModule';
import {
  createLivenessSelector,
  useLivenessActor,
  useLivenessSelector,
} from '../hooks';
import { isMobileScreen } from '../utils/device';
import { Text, Flex, View, Button } from '../../../primitives';
import { CancelButton } from '../shared/CancelButton';

const CHECK_CLASS_NAME = 'liveness-detector-check';

export const selectErrorState = createLivenessSelector(
  (state) => state.context.errorState
);

export const LivenessCheck: React.FC = () => {
  const { tokens } = useTheme();
  const [state, send] = useLivenessActor();
  const errorState = useLivenessSelector(selectErrorState);

  const isPermissionDenied = state.matches('permissionDenied');
  const isMobile = isMobileScreen();

  const recheckCameraPermissions = () => {
    send({ type: 'RETRY_CAMERA_CHECK' });
  };

  return (
    <Flex
      direction="column"
      position="relative"
      data-amplify-liveness-detector-check=""
      data-testid={CHECK_CLASS_NAME}
      className={CHECK_CLASS_NAME}
    >
      {!isPermissionDenied ? (
        <LivenessCameraModule isMobileScreen={isMobile} />
      ) : (
        <Flex
          backgroundColor={`${tokens.colors.background.primary}`}
          color={`${tokens.colors.font.primary}`}
          direction="column"
          textAlign="center"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height={480}
        >
          <Text
            color="inherit"
            fontSize={`${tokens.fontSizes.large}`}
            fontWeight={`${tokens.fontWeights.bold}`}
          >
            {errorState === LivenessErrorState.CAMERA_FRAMERATE_ERROR
              ? translate('Camera does not meet minimum specification')
              : translate('Camera not accessible')}
          </Text>
          <Text color="inherit" maxWidth={300}>
            {errorState === LivenessErrorState.CAMERA_FRAMERATE_ERROR
              ? translate(
                  'Use a camera that can record at 15 frames per second or higher'
                )
              : translate(
                  'Connect a camera and allow camera permission in browser settings'
                )}
          </Text>
          <Button
            variation="primary"
            type="button"
            onClick={recheckCameraPermissions}
          >
            {translate('Proceed')}
          </Button>
          <View position="absolute" top="medium" right="medium">
            <CancelButton sourceScreen={LIVENESS_EVENT_LIVENESS_CHECK_SCREEN} />
          </View>
        </Flex>
      )}
    </Flex>
  );
};
