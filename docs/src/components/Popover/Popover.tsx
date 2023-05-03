import * as React from 'react';
import {
  View,
  Button,
  Icon,
  Flex,
  Text,
  ViewProps,
} from '@aws-amplify/ui-react';
import { MdClose } from 'react-icons/md';
import { cloneElement, useRef, useState, useLayoutEffect } from 'react';

type PositionStyle = {
  insetInlineEnd: number;
  top: number;
};

interface DialogProps extends ViewProps {
  showPopover: boolean;
  positionStyle: PositionStyle;
  closeModal: () => void;
  title: React.ReactNode;
  ariaLabelledBy?: string;
  children: React.ReactNode;
}

const Dialog = ({
  showPopover,
  positionStyle,
  closeModal,
  title,
  children,
  ariaLabelledBy,
}: DialogProps) => {
  return (
    <View
      className="popover"
      style={positionStyle}
      aria-hidden={!showPopover}
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      role="dialog"
    >
      <Flex direction="column" gap="0">
        <Flex className="popover__header">
          {title}
          <Button
            onClick={() => closeModal()}
            marginInlineStart="auto"
            size="small"
            variation="link"
            ariaLabel="Close"
          >
            <Icon height="16px" as={MdClose} />
          </Button>
        </Flex>
        <div className="popover__content">{children}</div>
      </Flex>
    </View>
  );
};

interface PopoverProps extends ViewProps {
  children: React.ReactNode;
  triggerEl: React.ReactElement;
  title: React.ReactNode;
  ariaLabelledBy?: string;
}

export const Popover = ({
  children,
  title,
  triggerEl,
  ariaLabelledBy,
}: PopoverProps) => {
  const triggerRef = useRef<HTMLElement>(null);
  const [showPopover, togglePopover] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function toggleModal() {
    togglePopover(!showPopover);
  }

  function closeModal() {
    triggerRef?.current?.focus();
    togglePopover(false);
  }

  useLayoutEffect(() => {
    if (triggerRef.current && showPopover) {
      const anchor: HTMLElement = triggerRef.current;
      const boundingClientRect = anchor.getBoundingClientRect();
      console.log(boundingClientRect);
      setPosition({
        x: 0,
        y: boundingClientRect.height + 12,
      });
    }
  }, [triggerRef, showPopover, setPosition]);

  const trigger: React.ReactElement = cloneElement(triggerEl, {
    onClick: () => toggleModal(),
    ref: triggerRef,
  });

  const positionStyle = {
    insetInlineEnd: position.x,
    top: position.y,
  };

  return (
    <View as="span" className="popover-wrapper">
      {trigger}
      {showPopover ? (
        <Dialog
          showPopover={showPopover}
          positionStyle={positionStyle}
          closeModal={() => closeModal()}
          title={title}
          ariaLabelledBy={ariaLabelledBy}
        >
          {children}
        </Dialog>
      ) : null}
    </View>
  );
};
