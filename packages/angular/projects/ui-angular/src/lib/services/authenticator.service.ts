import { Injectable, OnDestroy } from '@angular/core';
import { Logger } from '@aws-amplify/core';
import {
  AmplifyUser,
  AuthContext,
  AuthEvent,
  AuthInterpreter,
  AuthMachineState,
  createAuthenticatorMachine,
  getServiceFacade,
  AuthenticatorServiceFacade,
} from '@aws-amplify/ui';
import { Event, interpret, Subscription } from 'xstate';
import { AuthSubscriptionCallback } from '../common/types';
import { translate } from '@aws-amplify/ui';

const logger = new Logger('state-machine');

/**
 * AuthenticatorService provides access to the authenticator state and context.
 */
@Injectable({
  providedIn: 'root', // ensure we have a singleton service
})
export class AuthenticatorService implements OnDestroy {
  private _authState: AuthMachineState;
  private _authService: AuthInterpreter;
  private _machineSubscription: Subscription;
  private _facade: ReturnType<typeof getServiceFacade>;

  constructor() {
    const machine = createAuthenticatorMachine();

    const authService = interpret(machine).start();

    this._machineSubscription = authService.subscribe((state: unknown) => {
      const newState = state as AuthMachineState;
      this._authState = newState;
      this._facade = getServiceFacade({
        send: authService.send,
        state: newState,
      });
    });

    this._authService = authService;
  }

  /**
   * Context facades
   */

  public get error(): AuthenticatorServiceFacade['error'] {
    return translate(this._facade?.error);
  }

  public get hasValidationErrors(): AuthenticatorServiceFacade['hasValidationErrors'] {
    return this._facade?.hasValidationErrors;
  }

  public get isPending(): AuthenticatorServiceFacade['isPending'] {
    return this._facade?.isPending;
  }

  public get route(): AuthenticatorServiceFacade['route'] {
    return this._facade?.route;
  }

  public get authStatus(): AuthenticatorServiceFacade['authStatus'] {
    return this._facade?.authStatus;
  }

  public get user(): AmplifyUser {
    return this._facade?.user;
  }

  public get validationErrors(): AuthenticatorServiceFacade['validationErrors'] {
    return this._facade?.validationErrors;
  }

  public get codeDeliveryDetails(): AuthenticatorServiceFacade['codeDeliveryDetails'] {
    return this._facade?.codeDeliveryDetails;
  }

  public get totpSecretCode(): AuthenticatorServiceFacade['totpSecretCode'] {
    return this._facade?.totpSecretCode;
  }

  /**
   * Service facades
   */

  public get initializeMachine(): AuthenticatorServiceFacade['initializeMachine'] {
    return this._facade.initializeMachine;
  }

  public get updateForm(): AuthenticatorServiceFacade['updateForm'] {
    return this._facade.updateForm;
  }

  public get updateBlur(): AuthenticatorServiceFacade['updateBlur'] {
    return this._facade.updateBlur;
  }

  public get resendCode(): AuthenticatorServiceFacade['resendCode'] {
    return this._facade.resendCode;
  }

  public get signOut(): AuthenticatorServiceFacade['signOut'] {
    return this._facade.signOut;
  }

  public get submitForm(): AuthenticatorServiceFacade['submitForm'] {
    return this._facade.submitForm;
  }

  /**
   * Transition facades
   */

  public get toFederatedSignIn(): AuthenticatorServiceFacade['toFederatedSignIn'] {
    return this._facade.toFederatedSignIn;
  }

  public get toResetPassword(): AuthenticatorServiceFacade['toResetPassword'] {
    return this._facade.toResetPassword;
  }

  public get toSignIn(): AuthenticatorServiceFacade['toSignIn'] {
    return this._facade.toSignIn;
  }

  public get toSignUp(): AuthenticatorServiceFacade['toSignUp'] {
    return this._facade.toSignUp;
  }

  public get skipVerification(): AuthenticatorServiceFacade['skipVerification'] {
    return this._facade.skipVerification;
  }

  /**
   * Internal utility functions
   */

  /** @deprecated For internal use only */
  public get authState(): AuthMachineState {
    return this._authState;
  }

  /** @deprecated For internal use only */
  public get authService(): AuthInterpreter {
    return this._authService;
  }

  /** @deprecated For internal use only */
  public get context(): AuthContext {
    return this._authState.context;
  }

  /** @deprecated For internal use only */
  public get slotContext(): AuthenticatorServiceFacade & {
    $implicit: AuthenticatorServiceFacade;
  } {
    return {
      ...this._facade,
      $implicit: this._facade,
    };
  }

  public subscribe(callback: AuthSubscriptionCallback): Subscription {
    if (!this._authService) {
      logger.error(
        'Subscription attempted before machine was created. This is likely a bug on the library, please consider filing a bug.'
      );
    }

    const subscription = this._authService.subscribe(() => {
      callback(this._facade);
    });
    return subscription;
  }

  ngOnDestroy(): void {
    if (this._machineSubscription) this._machineSubscription.unsubscribe();
  }

  /** @deprecated For internal use only */
  public send(event: Event<AuthEvent>): void {
    this.authService.send(event);
  }
}
