import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { AmplifyBasePrimitiveComponent } from '../../base-primitive/base-primitive.component';

const $COMPONENT_NAME: string = '[amplify-view]';
@Component({
  selector: $COMPONENT_NAME,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmplifyViewComponent extends AmplifyBasePrimitiveComponent {
  /** Input Prop for style changes  */

  @Input() isDisabled: boolean = false;
  @HostBinding('attr.disabled') get getDisabled() {
    return this.isDisabled ? '' : null;
  }

  constructor() {
    super();
  }
}