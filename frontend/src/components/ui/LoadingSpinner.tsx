import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
        {text && (
          <p className={cn('text-muted-foreground', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

// Full page loading component
export const PageLoading: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size="xl" text={text} />
    </div>
  );
};

// Section loading component
export const SectionLoading: React.FC<{ text?: string; className?: string }> = ({ 
  text, 
  className 
}) => {
  return (
    <div className={cn('py-12 flex items-center justify-center', className)}>
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

export { LoadingSpinner };
