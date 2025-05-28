"use client"

import React from 'react';
import { 
  Tabs as ChakraTabs,
  TabList as ChakraTabList,
  Tab as ChakraTab,
  TabPanels as ChakraTabPanels,
  TabPanel as ChakraTabPanel,
  TabsProps as ChakraTabsProps,
  TabListProps as ChakraTabListProps,
  TabProps as ChakraTabProps,
  TabPanelsProps as ChakraTabPanelsProps,
  TabPanelProps as ChakraTabPanelProps
} from '@chakra-ui/react';

// Tabs Container - Enhanced to manage panels
export interface TabsProps extends ChakraTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
}

const Tabs = ({ children, defaultValue, value, ...props }: TabsProps) => {
  // Extract TabsList and TabsContent from children
  const childrenArray = React.Children.toArray(children);
  const tabsList = childrenArray.find((child: any) => child?.type?.displayName === 'TabsList');
  const tabsContents = childrenArray.filter((child: any) => child?.type?.displayName === 'TabsContent');

  // Convert defaultValue/value to index for Chakra
  let defaultIndex = 0;
  let index;
  
  if (defaultValue && tabsContents.length > 0) {
    const foundIndex = tabsContents.findIndex((content: any) => content?.props?.value === defaultValue);
    if (foundIndex !== -1) defaultIndex = foundIndex;
  }
  
  if (value && tabsContents.length > 0) {
    const foundIndex = tabsContents.findIndex((content: any) => content?.props?.value === value);
    if (foundIndex !== -1) index = foundIndex;
  }

  return (
    <ChakraTabs
      variant="line"
      colorScheme="blue"
      defaultIndex={defaultIndex}
      index={index}
      {...props}
    >
      {tabsList}
      <ChakraTabPanels>
        {tabsContents}
      </ChakraTabPanels>
    </ChakraTabs>
  );
};

Tabs.displayName = "Tabs";

// Tabs List
export interface TabsListProps extends ChakraTabListProps {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraTabList ref={ref} {...props}>
        {children}
      </ChakraTabList>
    );
  }
);

TabsList.displayName = "TabsList";

// Tab Trigger
export interface TabsTriggerProps extends ChakraTabProps {
  value?: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, children, ...props }, ref) => {
    return (
      <ChakraTab ref={ref} {...props}>
        {children}
      </ChakraTab>
    );
  }
);

TabsTrigger.displayName = "TabsTrigger";

// Tab Content Container
export interface TabsContentProps extends ChakraTabPanelProps {
  value?: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, children, ...props }, ref) => {
    return (
      <ChakraTabPanel ref={ref} {...props}>
        {children}
      </ChakraTabPanel>
    );
  }
);

TabsContent.displayName = "TabsContent";

export { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
}; 
