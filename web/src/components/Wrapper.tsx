import { Flex } from '@chakra-ui/react';
import React from 'react';
import { MeProvider } from '../contexts/MeContext';
import { ErrorFallback } from './ErrorFallback';

export type WrapperVariant = 'small' | 'regular' | 'large';

interface WrapperProps {
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = 'regular',
}) => {
  let size;
  if (variant === 'large') {
    size = '2800px';
  } else if (variant === 'regular') {
    size = '1600px';
  } else {
    size = '400px';
  }
  return (
    <MeProvider>
      <Flex
        maxW={size}
        w='100%'
        mx='auto'
        h='calc(100% - 51px)'
        position='relative'
      >
        <ErrorFallback showFullError>{children}</ErrorFallback>
      </Flex>
    </MeProvider>
  );
};
