import { renderHook } from '@testing-library/react-hooks';
import { useActor } from '@xstate/react';

import { getMockedFunction } from '../../utils/test-utils';
import { useLivenessFlow } from '../../providers';
import { useLivenessActor } from '../useLivenessActor';

jest.mock('@xstate/react');
jest.mock('../../providers');

const mockedUseLivenessFlow = getMockedFunction(useLivenessFlow);
const mockedUseActor = getMockedFunction(useActor);

describe('useLivenessActor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the actor', () => {
    const service = {};
    const actor = {};

    mockedUseLivenessFlow.mockReturnValue({ service } as any);
    mockedUseActor.mockReturnValue(actor as any);

    const { result } = renderHook(() => useLivenessActor());

    expect(result.current).toBe(actor);
    expect(mockedUseLivenessFlow).toHaveBeenCalledTimes(1);
    expect(mockedUseActor).toHaveBeenCalledWith(service);
  });
});