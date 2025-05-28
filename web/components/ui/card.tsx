import React from 'react';
import { 
  Card as ChakraCard,
  CardBody,
  CardHeader as ChakraCardHeader,
  CardFooter as ChakraCardFooter,
  Heading,
  Text,
  Box,
  CardProps as ChakraCardProps,
  HeadingProps,
  TextProps,
  BoxProps
} from '@chakra-ui/react';

// Card Container
export interface CardProps extends ChakraCardProps {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => {
    return (
      <ChakraCard
        ref={ref}
        variant="outline"
        shadow="sm"
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

// Card Header
export interface CardHeaderProps extends BoxProps {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (props, ref) => {
    return (
      <ChakraCardHeader
        ref={ref}
        {...props}
      />
    );
  }
);

CardHeader.displayName = "CardHeader";

// Card Title
export interface CardTitleProps extends HeadingProps {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ size = 'md', ...props }, ref) => {
    return (
      <Heading
        ref={ref}
        size={size}
        {...props}
      />
    );
  }
);

CardTitle.displayName = "CardTitle";

// Card Description
export interface CardDescriptionProps extends TextProps {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ color = 'gray.600', fontSize = 'sm', ...props }, ref) => {
    return (
      <Text
        ref={ref}
        color={color}
        fontSize={fontSize}
        {...props}
      />
    );
  }
);

CardDescription.displayName = "CardDescription";

// Card Content
export interface CardContentProps extends BoxProps {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  (props, ref) => {
    return (
      <CardBody
        ref={ref}
        {...props}
      />
    );
  }
);

CardContent.displayName = "CardContent";

// Card Footer
export interface CardFooterProps extends BoxProps {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  (props, ref) => {
    return (
      <ChakraCardFooter
        ref={ref}
        {...props}
      />
    );
  }
);

CardFooter.displayName = "CardFooter";

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
}; 
