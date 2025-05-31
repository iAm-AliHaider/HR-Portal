import React from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  ModalProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  useDisclosure,
} from "@chakra-ui/react";

// Dialog Container (using Modal)
export interface DialogProps extends Omit<ModalProps, "children"> {
  children: React.ReactNode;
}

const Dialog = ({ children, ...props }: DialogProps) => {
  return (
    <Modal {...props}>
      <ModalOverlay />
      {children}
    </Modal>
  );
};

// Dialog Trigger (button that opens dialog)
export interface DialogTriggerProps {
  children: React.ReactElement;
  onClick?: () => void;
}

const DialogTrigger = ({ children, onClick }: DialogTriggerProps) => {
  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      if (children.props.onClick) {
        children.props.onClick(e);
      }
      if (onClick) {
        onClick();
      }
    },
  });
};

// Dialog Content
export interface DialogContentProps extends ModalContentProps {}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (props, ref) => {
    return <ModalContent ref={ref} {...props} />;
  },
);

// Dialog Header
export interface DialogHeaderProps extends ModalHeaderProps {}

const DialogHeader = React.forwardRef<HTMLElement, DialogHeaderProps>(
  (props, ref) => {
    return <ModalHeader ref={ref} {...props} />;
  },
);

// Dialog Title
export interface DialogTitleProps extends ModalHeaderProps {}

const DialogTitle = React.forwardRef<HTMLElement, DialogTitleProps>(
  (props, ref) => {
    return <ModalHeader ref={ref} fontSize="lg" fontWeight="bold" {...props} />;
  },
);

// Dialog Description
export interface DialogDescriptionProps extends ModalBodyProps {}

const DialogDescription = React.forwardRef<
  HTMLDivElement,
  DialogDescriptionProps
>(({ color = "gray.600", fontSize = "sm", ...props }, ref) => {
  return <ModalBody ref={ref} color={color} fontSize={fontSize} {...props} />;
});

// Dialog Footer
export interface DialogFooterProps extends ModalFooterProps {}

const DialogFooter = React.forwardRef<HTMLElement, DialogFooterProps>(
  (props, ref) => {
    return <ModalFooter ref={ref} {...props} />;
  },
);

Dialog.displayName = "Dialog";
DialogTrigger.displayName = "DialogTrigger";
DialogContent.displayName = "DialogContent";
DialogHeader.displayName = "DialogHeader";
DialogTitle.displayName = "DialogTitle";
DialogDescription.displayName = "DialogDescription";
DialogFooter.displayName = "DialogFooter";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  useDisclosure,
};
