import React from 'react';
import { 
  Avatar as ChakraAvatar, 
  AvatarGroup as ChakraAvatarGroup,
  AvatarProps as ChakraAvatarProps,
  AvatarGroupProps as ChakraAvatarGroupProps
} from '@chakra-ui/react';

export interface AvatarProps extends ChakraAvatarProps {}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ name, src, size = 'md', ...props }, ref) => {
    return (
      <ChakraAvatar
        ref={ref}
        name={name}
        src={src}
        size={size}
        {...props}
      />
    );
  }
);

Avatar.displayName = "Avatar";

// For compatibility with shadcn naming
const AvatarImage = ({ src, alt }: { src?: string; alt?: string }) => {
  // Chakra Avatar handles image internally, this is just for compatibility
  return null;
};

const AvatarFallback = ({ children }: { children: React.ReactNode }) => {
  // Chakra Avatar handles fallback internally, this is just for compatibility
  return null;
};

// Avatar Group
export interface AvatarGroupProps extends ChakraAvatarGroupProps {}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (props, ref) => {
    return (
      <ChakraAvatarGroup ref={ref} {...props} />
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

AvatarImage.displayName = "AvatarImage";
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup };
