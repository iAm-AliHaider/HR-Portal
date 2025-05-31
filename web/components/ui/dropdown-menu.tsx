"use client";

import React from "react";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Button,
} from "@chakra-ui/react";

// Simplified dropdown menu for basic use cases
const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  return <Menu>{children}</Menu>;
};

const DropdownMenuTrigger = ({
  asChild,
  children,
  ...props
}: {
  asChild?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      as: MenuButton,
    });
  }

  return (
    <MenuButton as={Button} {...props}>
      {children}
    </MenuButton>
  );
};

const DropdownMenuContent = ({
  align,
  children,
  ...props
}: {
  align?: string;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  return <MenuList {...props}>{children}</MenuList>;
};

const DropdownMenuItem = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => {
  return <MenuItem {...props}>{children}</MenuItem>;
};

const DropdownMenuLabel = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => {
  return <MenuGroup title={children as string} {...props} />;
};

const DropdownMenuSeparator = (props: any) => {
  return <MenuDivider {...props} />;
};

// For compatibility but simplified
const DropdownMenuCheckboxItem = DropdownMenuItem;
const DropdownMenuRadioItem = DropdownMenuItem;
const DropdownMenuShortcut = ({ children }: { children: React.ReactNode }) => (
  <span>{children}</span>
);
const DropdownMenuGroup = MenuGroup;
const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
const DropdownMenuSub = DropdownMenu;
const DropdownMenuSubContent = DropdownMenuContent;
const DropdownMenuSubTrigger = DropdownMenuTrigger;
const DropdownMenuRadioGroup = MenuGroup;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
