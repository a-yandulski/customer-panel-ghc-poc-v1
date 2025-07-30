import React from 'react';
import clsx from 'clsx';
import { Icon } from '../atoms';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  icon?: string;
  title?: string;
  variant?: 'default' | 'interactive';
  onClick?: () => void;
  hover?: boolean;
}

/**
 * Card Component
 * 
 * Implements the UI specification for cards:
 * - Default: White background, subtle shadow, 8px border-radius, 1px neutral border
 * - Hover: Slightly elevated shadow, border color darkens
 * - Active: Inset shadow, border accent
 * 
 * Typography: Heading: Inter, 18px, 600 weight; Body: Inter, 14px, 400 weight
 * Sizing: Min width 280px, padding 24px, margin-bottom 16px
 * Accessibility: All controls within card are tabbable, card regions labeled
 */
export const Card: React.FC<CardProps> = ({
  children,
  className,
  icon,
  title,
  variant = 'default',
  onClick,
  hover = true,
  ...props
}) => {
  const isInteractive = variant === 'interactive' || onClick;
  
  const cardClasses = clsx(
    // Base styling
    'bg-white rounded-lg border border-gray-200 shadow-sm',
    'min-w-[280px] p-6 mb-4',
    'transition-all duration-200 ease-in-out',
    
    // Interactive states
    {
      'cursor-pointer': isInteractive,
      'hover:shadow-md hover:border-gray-300': hover && isInteractive,
      'active:shadow-inner active:border-sky-400': isInteractive,
    },
    
    className
  );

  const titleClasses = clsx(
    'text-lg font-semibold text-gray-900 mb-3',
    {
      'flex items-center': icon,
    }
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const CardContent = (
    <div className={cardClasses} {...props}>
      {(title || icon) && (
        <div className={titleClasses}>
          {icon && (
            <Icon 
              name={icon} 
              size="lg" 
              className="mr-3 text-gray-600" 
              aria-hidden={false}
            />
          )}
          {title}
        </div>
      )}
      <div className="text-sm text-gray-700">
        {children}
      </div>
    </div>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 rounded-lg"
        aria-label={title ? `${title} card` : 'Interactive card'}
      >
        {CardContent}
      </button>
    );
  }

  return CardContent;
};

export default Card;
