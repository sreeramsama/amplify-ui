import {
  LivenessOvalDetails,
  IlluminationState,
  Face,
  FaceMatchState,
  BoundingBox,
  LivenessErrorState,
} from '../../types';
import { translate } from '../../i18n';
import { FaceDetection } from '../../types/liveness/faceDetection';
import { ClientFreshnessColorSequence } from '../../types/liveness/liveness-service-types';
import { DefaultTexts } from '../../i18n/translations';
import {
  ColorSequence,
  SessionInformation,
} from '@aws-sdk/client-rekognitionstreaming';
import {
  FACE_DISTANCE_THRESHOLD,
  REDUCED_THRESHOLD,
  REDUCED_THRESHOLD_MOBILE,
} from './constants';

/**
 * Returns the random number between min and max
 * seeded with the provided random seed.
 */
function getScaledValueFromRandomSeed(
  randomSeed: number,
  min: number,
  max: number
): number {
  return randomSeed * (max - min) + min;
}

/**
 * Returns the ratio of intersection and union of two bounding boxes.
 */
function getIntersectionOverUnion(
  box1: BoundingBox,
  box2: BoundingBox
): number {
  const xA = Math.max(box1.left, box2.left);
  const yA = Math.max(box1.top, box2.top);
  const xB = Math.min(box1.right, box2.right);
  const yB = Math.min(box1.bottom, box2.bottom);

  const intersectionArea = Math.abs(
    Math.max(0, xB - xA) * Math.max(0, yB - yA)
  );

  if (intersectionArea === 0) {
    return 0;
  }

  const boxAArea = Math.abs(
    (box1.right - box1.left) * (box1.bottom - box1.top)
  );
  const boxBArea = Math.abs(
    (box2.right - box2.left) * (box2.bottom - box2.top)
  );

  return intersectionArea / (boxAArea + boxBArea - intersectionArea);
}

/**
 * Returns the details of a randomly generated liveness oval
 * from SDK
 */
export function getOvalDetailsFromSessionInformation({
  sessionInformation,
  videoWidth,
}: {
  sessionInformation: SessionInformation;
  videoWidth: number;
}): LivenessOvalDetails {
  const ovalParameters =
    sessionInformation?.Challenge?.FaceMovementAndLightChallenge
      ?.OvalParameters;

  // We need to include a flippedCenterX for visualizing the oval on a flipped camera view
  // The camera view we show the customer is flipped to making moving left and right more obvious
  // The video stream sent to the liveness service is not flipped
  return {
    flippedCenterX: ovalParameters?.CenterX
      ? videoWidth - ovalParameters?.CenterX
      : undefined,
    centerX: ovalParameters?.CenterX,
    centerY: ovalParameters?.CenterY,
    width: ovalParameters?.Width,
    height: ovalParameters?.Height,
  };
}

/**
 * Returns the details of a statically generated liveness oval based on the video dimensions
 */
export function getStaticLivenessOvalDetails({
  width,
  height,
  widthSeed = 1.0,
  centerXSeed = 0.5,
  centerYSeed = 0.5,
}: {
  width: number;
  height: number;
  widthSeed?: number;
  centerXSeed?: number;
  centerYSeed?: number;
}): LivenessOvalDetails {
  const videoHeight = height;
  let videoWidth = width;

  const ovalRatio = widthSeed * 0.8;

  const minOvalCenterX = Math.floor((7 * width) / 16);
  const maxOvalCenterX = Math.floor((9 * width) / 16);
  const minOvalCenterY = Math.floor((7 * height) / 16);
  const maxOvalCenterY = Math.floor((9 * height) / 16);

  const centerX = getScaledValueFromRandomSeed(
    centerXSeed,
    minOvalCenterX,
    maxOvalCenterX
  );
  const centerY = getScaledValueFromRandomSeed(
    centerYSeed,
    minOvalCenterY,
    maxOvalCenterY
  );

  if (width >= height) {
    videoWidth = (3 / 4) * videoHeight;
  }

  const ovalWidth = ovalRatio * videoWidth;
  const ovalHeight = 1.618 * ovalWidth;

  return {
    flippedCenterX: Math.floor(videoWidth - centerX),
    centerX: Math.floor(centerX),
    centerY: Math.floor(centerY),
    width: Math.floor(ovalWidth),
    height: Math.floor(ovalHeight),
  };
}

/**
 * Draws the provided liveness oval on the canvas.
 */
export function drawLivenessOvalInCanvas({
  canvas,
  oval,
  scaleFactor,
  videoEl,
}: {
  canvas: HTMLCanvasElement;
  oval: LivenessOvalDetails;
  scaleFactor: number;
  videoEl: HTMLVideoElement;
}): void {
  const { flippedCenterX, centerY, width, height } = oval;

  const { width: canvasWidth, height: canvasHeight } =
    canvas.getBoundingClientRect();
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // fill the canvas with a transparent rectangle
    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // On mobile our canvas is the width/height of the full screen.
    // We need to calculate horizontal and vertical translation to reposition
    // our canvas drawing so the oval is still placed relative to the dimensions
    // of the video element.
    const baseDims = { width: videoEl.videoWidth, height: videoEl.videoHeight };

    const translate = {
      x: (canvasWidth - baseDims.width * scaleFactor) / 2,
      y: (canvasHeight - baseDims.height * scaleFactor) / 2,
    };
    // Set the transform to scale
    ctx.setTransform(scaleFactor, 0, 0, scaleFactor, translate.x, translate.y);

    // draw the oval path
    ctx.beginPath();
    ctx.ellipse(
      flippedCenterX!,
      centerY!,
      width! / 2,
      height! / 2,
      0,
      0,
      2 * Math.PI
    );

    // add stroke to the oval path
    ctx.strokeStyle = '#AEB3B7';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.clip();

    // Restore default canvas transform matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // clear the oval content from the rectangle
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  } else {
    throw new Error('Cannot find Canvas.');
  }
}

/**
 * Returns the state of the provided face with respect to the provided liveness oval.
 */
export function getFaceMatchStateInLivenessOval(
  face: Face,
  ovalDetails: LivenessOvalDetails,
  sessionInformation: SessionInformation
): FaceMatchState {
  let faceMatchState: FaceMatchState;

  const {
    OvalIouThreshold,
    OvalIouHeightThreshold,
    OvalIouWidthThreshold,
    FaceIouHeightThreshold,
    FaceIouWidthThreshold,
  } =
    sessionInformation.Challenge.FaceMovementAndLightChallenge.ChallengeConfig;

  const faceBoundingBox: BoundingBox = generateBboxFromLandmarks(
    face,
    ovalDetails
  );
  const minFaceX = faceBoundingBox.left;
  const maxFaceX = faceBoundingBox.right;
  const minFaceY = faceBoundingBox.top;
  const maxFaceY = faceBoundingBox.bottom;

  const minOvalX = ovalDetails.flippedCenterX - ovalDetails.width / 2;
  const maxOvalX = ovalDetails.flippedCenterX + ovalDetails.width / 2;
  const minOvalY = ovalDetails.centerY - ovalDetails.height / 2;
  const maxOvalY = ovalDetails.centerY + ovalDetails.height / 2;
  const ovalBoundingBox: BoundingBox = {
    left: minOvalX,
    top: minOvalY,
    right: maxOvalX,
    bottom: maxOvalY,
  };

  const intersection = getIntersectionOverUnion(
    faceBoundingBox,
    ovalBoundingBox
  );

  const intersectionThreshold = OvalIouThreshold;
  const ovalMatchWidthThreshold = ovalDetails.width * OvalIouWidthThreshold;
  const ovalMatchHeightThreshold = ovalDetails.height * OvalIouHeightThreshold;
  const faceDetectionWidthThreshold = ovalDetails.width * FaceIouWidthThreshold;
  const faceDetectionHeightThreshold =
    ovalDetails.height * FaceIouHeightThreshold;

  if (
    intersection > intersectionThreshold &&
    Math.abs(minOvalX - minFaceX) < ovalMatchWidthThreshold &&
    Math.abs(maxOvalX - maxFaceX) < ovalMatchWidthThreshold &&
    Math.abs(maxOvalY - maxFaceY) < ovalMatchHeightThreshold
  ) {
    faceMatchState = FaceMatchState.MATCHED;
  } else if (
    minOvalY - minFaceY > faceDetectionHeightThreshold ||
    maxFaceY - maxOvalY > faceDetectionHeightThreshold ||
    (minOvalX - minFaceX > faceDetectionWidthThreshold &&
      maxFaceX - maxOvalX > faceDetectionWidthThreshold)
  ) {
    faceMatchState = FaceMatchState.TOO_CLOSE;
  } else {
    faceMatchState = FaceMatchState.TOO_FAR;
  }

  return faceMatchState;
}

function getPupilDistanceAndFaceHeight(face: Face) {
  const { leftEye, rightEye, mouth } = face;

  const eyeCenter = [];
  eyeCenter[0] = (leftEye[0] + rightEye[0]) / 2;
  eyeCenter[1] = (leftEye[1] + rightEye[1]) / 2;

  const pupilDistance = Math.sqrt(
    (leftEye[0] - rightEye[0]) ** 2 + (leftEye[1] - rightEye[1]) ** 2
  );
  const faceHeight = Math.sqrt(
    (eyeCenter[0] - mouth[0]) ** 2 + (eyeCenter[1] - mouth[1]) ** 2
  );

  return { pupilDistance, faceHeight };
}

export function generateBboxFromLandmarks(
  face: Face,
  oval: LivenessOvalDetails
): BoundingBox {
  const { leftEye, rightEye, nose } = face;
  const { height: ovalHeight, centerY } = oval;
  const ovalTop = centerY! - ovalHeight! / 2;

  const eyeCenter = [];
  eyeCenter[0] = (leftEye[0] + rightEye[0]) / 2;
  eyeCenter[1] = (leftEye[1] + rightEye[1]) / 2;

  const { pupilDistance: pd, faceHeight: fh } =
    getPupilDistanceAndFaceHeight(face);

  const alpha = 2.0,
    gamma = 1.8;
  const ow = (alpha * pd + gamma * fh) / 2;
  const oh = 1.618 * ow;

  let cx: number, cy: number;

  if (eyeCenter[1] <= (ovalTop + ovalHeight!) / 2) {
    cx = (eyeCenter[0] + nose[0]) / 2;
    cy = (eyeCenter[1] + nose[1]) / 2;
  } else {
    cx = eyeCenter[0];
    cy = eyeCenter[1];
  }

  const left = cx - ow / 2,
    top = cy - oh / 2;
  const width = ow,
    height = oh;

  return {
    left: left,
    top: top,
    right: left + width,
    bottom: top + height,
  };
}

/**
 * Returns the illumination state in the provided video frame.
 */
export function estimateIllumination(
  videoEl: HTMLVideoElement
): IlluminationState | undefined {
  const canvasEl = document.createElement('canvas');
  canvasEl.width = videoEl.videoWidth;
  canvasEl.height = videoEl.videoHeight;

  const ctx = canvasEl.getContext('2d');
  if (ctx) {
    ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
    const frame = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height).data;

    // histogram
    const MAX_SCALE = 8;
    const hist = new Array(MAX_SCALE).fill(0) as number[];

    for (let i = 0; i < frame.length; i++) {
      const luma = Math.round(
        frame[i++] * 0.2126 + frame[i++] * 0.7152 + frame[i++] * 0.0722
      );
      hist[luma % 32]++;
    }

    let ind = -1,
      maxCount = 0;
    for (let i = 0; i < MAX_SCALE; i++) {
      if (hist[i] > maxCount) {
        maxCount = hist[i];
        ind = i;
      }
    }

    canvasEl.remove();

    if (ind === 0) return IlluminationState.DARK;
    if (ind === MAX_SCALE) return IlluminationState.BRIGHT;
    return IlluminationState.NORMAL;
  } else {
    throw new Error('Cannot find Video Element.');
  }
}

/**
 * Checks if the provided media device is a virtual camera.
 * @param device
 */
export function isCameraDeviceVirtual(device: MediaDeviceInfo): boolean {
  return device.label.toLowerCase().includes('virtual');
}

export const IlluminationStateStringMap: Record<IlluminationState, string> = {
  [IlluminationState.BRIGHT]: translate('Move to dimmer area'),
  [IlluminationState.DARK]: translate('Move to brighter area'),
  [IlluminationState.NORMAL]: translate('Lighting conditions normal'),
};

export const FaceMatchStateStringMap: Record<FaceMatchState, string> = {
  [FaceMatchState.CANT_IDENTIFY]: translate('Move face in front of camera'),
  [FaceMatchState.FACE_IDENTIFIED]: translate('Move face closer and fill oval'),
  [FaceMatchState.TOO_MANY]: translate(
    'Ensure only one face is in front of camera'
  ),
  [FaceMatchState.TOO_CLOSE]: translate(
    DefaultTexts.LIVENESS_HINT_FACE_TOO_CLOSE
  ),
  [FaceMatchState.TOO_FAR]: translate('Move face closer and fill oval'),
  [FaceMatchState.TOO_LEFT]: translate('Move face right'),
  [FaceMatchState.TOO_RIGHT]: translate('Move face left'),
  [FaceMatchState.MATCHED]: '',
};

export const LivenessErrorStateStringMap: Record<LivenessErrorState, string> = {
  [LivenessErrorState.RUNTIME_ERROR]: translate(
    'Check failed due to client issue'
  ),
  [LivenessErrorState.SERVER_ERROR]: translate(
    'Cannot complete check due to server issue'
  ),
  [LivenessErrorState.TIMEOUT]: translate<string>(
    "Face didn't fill oval within time limit. Try again and completely fill oval with face within 5 seconds."
  ),
  [LivenessErrorState.FACE_DISTANCE_ERROR]: translate<string>(
    'Ensure only one face is in front of camera and avoid moving closer during countdown.'
  ),
  [LivenessErrorState.CAMERA_FRAMERATE_ERROR]: '',
  [LivenessErrorState.CAMERA_ACCESS_ERROR]: '',
  [LivenessErrorState.MOBILE_LANDSCAPE_ERROR]: '',
  [LivenessErrorState.FRESHNESS_TIMEOUT]: translate<string>(
    DefaultTexts.LIVENESS_INSTRUCTION_HOLD_OVAL
  ),
};

export const MOCK_COLOR_SEQUENCES: ColorSequence[] = [
  {
    FreshnessColor: {
      RGB: [0, 0, 0], // black
    },
    DownscrollDuration: 300,
    FlatDisplayDuration: 100,
  },
  {
    FreshnessColor: {
      RGB: [255, 255, 255], // white
    },
    DownscrollDuration: 300,
    FlatDisplayDuration: 100,
  },
  {
    FreshnessColor: {
      RGB: [255, 0, 0], // red
    },
    DownscrollDuration: 300,
    FlatDisplayDuration: 100,
  },
  {
    FreshnessColor: {
      RGB: [255, 255, 0], // yellow
    },
    DownscrollDuration: 300,
    FlatDisplayDuration: 100,
  },
  {
    FreshnessColor: {
      RGB: [0, 255, 0], // lime
    },
    DownscrollDuration: 300,
    FlatDisplayDuration: 100,
  },
  {
    FreshnessColor: {
      RGB: [0, 255, 255], // cyan
    },
    DownscrollDuration: 300,
    FlatDisplayDuration: 100,
  },
  {
    FreshnessColor: {
      RGB: [0, 0, 255], // blue,
    },
    DownscrollDuration: 300,
    FlatDisplayDuration: 100,
  },
  {
    FreshnessColor: {
      RGB: [255, 0, 255], // violet
    },
    DownscrollDuration: 300,
    FlatDisplayDuration: 100,
  },
];

export enum FreshnessColor {
  BLACK = 'rgb_0_0_0',
  BLUE = 'rgb_0_0_255',
  CYAN = 'rgb_0_255_255',
  LIME = 'rgb_0_255_0',
  RED = 'rgb_255_0_0',
  VIOLET = 'rgb_255_0_255',
  WHITE = 'rgb_255_255_255',
  YELLOW = 'rgb_255_255_0',
}

interface FillOverlayCanvasFractionalInput {
  overlayCanvas: HTMLCanvasElement;
  prevColor: string;
  nextColor: string;
  videoEl: HTMLVideoElement;
  ovalDetails: LivenessOvalDetails;
  heightFraction: number;
  scaleFactor: number;
}

const INITIAL_ALPHA = 0.9;
const SECONDARY_ALPHA = 0.75;

function fillFractionalContext({
  ctx,
  prevColor,
  nextColor,
  fraction,
}: {
  ctx: CanvasRenderingContext2D;
  prevColor: string;
  nextColor: string;
  fraction: number;
}) {
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  ctx.fillStyle = nextColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight * fraction);

  if (fraction !== 1) {
    ctx.fillStyle = prevColor;
    ctx.fillRect(
      0,
      canvasHeight * fraction,
      canvasWidth,
      canvasHeight * (1 - fraction)
    );
  }
}

export function fillOverlayCanvasFractional({
  overlayCanvas,
  prevColor,
  nextColor,
  videoEl,
  ovalDetails,
  heightFraction,
  scaleFactor,
}: FillOverlayCanvasFractionalInput): void {
  const { x: videoX, y: videoY } = videoEl.getBoundingClientRect();

  const { flippedCenterX, centerY, width, height } = ovalDetails;

  const updatedCenterX = flippedCenterX! * scaleFactor + videoX;
  const updatedCenterY = centerY! * scaleFactor + videoY;

  const canvasWidth = overlayCanvas.width;
  const canvasHeight = overlayCanvas.height;
  const ctx = overlayCanvas.getContext('2d');

  if (ctx) {
    // Because the canvas is set to to 100% we need to manually set the height for the canvas to use pixel values
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // fill the complete canvas
    fillFractionalContext({
      ctx,
      prevColor,
      nextColor,
      fraction: heightFraction,
    });

    // save the current state
    ctx.save();

    // draw the rectangle path and fill it
    ctx.beginPath();
    ctx.rect(0, 0, canvasWidth, canvasHeight);
    ctx.clip();

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.globalAlpha = INITIAL_ALPHA;
    fillFractionalContext({
      ctx,
      prevColor,
      nextColor,
      fraction: heightFraction,
    });

    // draw the oval path and fill it
    ctx.beginPath();
    ctx.ellipse(
      updatedCenterX,
      updatedCenterY,
      (width! * scaleFactor) / 2,
      (height! * scaleFactor) / 2,
      0,
      0,
      2 * Math.PI
    );
    // add stroke to the oval path
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.clip();

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.globalAlpha = SECONDARY_ALPHA;
    fillFractionalContext({
      ctx,
      prevColor,
      nextColor,
      fraction: heightFraction,
    });

    // restore the state
    ctx.restore();
  } else {
    throw new Error('Cannot find Overlay Canvas.');
  }
}

export const isClientFreshnessColorSequence = (
  obj: ClientFreshnessColorSequence | undefined
): obj is ClientFreshnessColorSequence => !!obj;

export function getColorsSequencesFromSessionInformation(
  sessionInformation: SessionInformation
): ClientFreshnessColorSequence[] {
  const colorSequenceFromSessionInfo =
    sessionInformation.Challenge?.FaceMovementAndLightChallenge?.ColorSequences;
  const colorSequences: (ClientFreshnessColorSequence | undefined)[] = [
    ...(colorSequenceFromSessionInfo ? colorSequenceFromSessionInfo : []),
  ].map(
    ({
      FreshnessColor,
      DownscrollDuration: downscrollDuration,
      FlatDisplayDuration: flatDisplayDuration,
    }) => {
      const colorArray = FreshnessColor?.RGB;
      const color = colorArray
        ? `rgb(${colorArray[0]},${colorArray[1]},${colorArray[2]})`
        : '';
      return typeof color !== 'undefined' &&
        typeof downscrollDuration !== 'undefined' &&
        typeof flatDisplayDuration !== 'undefined'
        ? {
            color,
            downscrollDuration,
            flatDisplayDuration,
          }
        : undefined;
    }
  );

  return colorSequences.filter(isClientFreshnessColorSequence);
}

export function getRGBArrayFromColorString(colorStr: string): number[] {
  return colorStr
    .slice(colorStr.indexOf('(') + 1, colorStr.indexOf(')'))
    .split(',')
    .map((str) => parseInt(str));
}

export async function getFaceMatchState(
  faceDetector: FaceDetection,
  videoEl: HTMLVideoElement
): Promise<FaceMatchState> {
  const detectedFaces = await faceDetector.detectFaces(videoEl);
  let faceMatchState: FaceMatchState;

  switch (detectedFaces.length) {
    case 0: {
      //no face detected;
      faceMatchState = FaceMatchState.CANT_IDENTIFY;
      break;
    }
    case 1: {
      //exactly one face detected, match face with oval;
      faceMatchState = FaceMatchState.FACE_IDENTIFIED;
      break;
    }
    default: {
      //more than one face detected ;
      faceMatchState = FaceMatchState.TOO_MANY;
      break;
    }
  }

  return faceMatchState;
}

export async function isFaceDistanceBelowThreshold({
  faceDetector,
  videoEl,
  ovalDetails,
  reduceThreshold = false,
  isMobile = false,
}: {
  faceDetector: FaceDetection;
  videoEl: HTMLVideoElement;
  ovalDetails?: LivenessOvalDetails;
  reduceThreshold?: boolean;
  isMobile?: boolean;
}): Promise<boolean> {
  const detectedFaces = await faceDetector.detectFaces(videoEl);
  let detectedFace: Face;

  let distanceBelowThreshold = false;

  switch (detectedFaces.length) {
    case 0: {
      //no face detected;
      break;
    }
    case 1: {
      //exactly one face detected, match face with oval;
      detectedFace = detectedFaces[0];

      const width = ovalDetails?.width;
      const { pupilDistance, faceHeight } =
        getPupilDistanceAndFaceHeight(detectedFace);

      const alpha = 2.0,
        gamma = 1.8;
      const calibratedPupilDistance =
        (alpha * pupilDistance + gamma * faceHeight) / 2 / alpha;

      if (width) {
        distanceBelowThreshold =
          calibratedPupilDistance / width <
          (!reduceThreshold
            ? FACE_DISTANCE_THRESHOLD
            : isMobile
            ? REDUCED_THRESHOLD_MOBILE
            : REDUCED_THRESHOLD);
      }
      break;
    }
    default: {
      //more than one face detected
      break;
    }
  }

  return distanceBelowThreshold;
}

export function getBoundingBox({
  deviceHeight,
  deviceWidth,
  height,
  width,
  top,
  left,
}: {
  deviceHeight: number;
  deviceWidth: number;
  height: number;
  width: number;
  top: number;
  left: number;
}): {
  Height: number;
  Width: number;
  Top: number;
  Left: number;
} {
  return {
    Height: height / deviceHeight,
    Width: width / deviceWidth,
    Top: top / deviceHeight,
    Left: left / deviceWidth,
  };
}
