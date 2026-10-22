import React from 'react';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  innerClassName?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
  radius?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
};

/**
 * React Bits StarBorder, patched so the outer and inner shapes share ONE radius
 * (the original hard-coded 20px on both, which broke pill buttons) and the inner
 * padding/typography come from `innerClassName` instead of fighting the outer box.
 */
const StarBorder = <T extends React.ElementType = 'button'>({
  as,
  className = '',
  innerClassName = 'px-[26px] py-[16px] text-[16px]',
  color = 'white',
  speed = '6s',
  thickness = 1,
  radius = '20px',
  backgroundColor = '#000000',
  textColor = '#ffffff',
  borderColor = '#222222',
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || 'button';
  const { style: userStyle, ...props } = rest as Record<string, unknown> & { style?: React.CSSProperties };

  return (
    <Component
      className={`relative inline-block overflow-hidden ${className}`}
      {...props}
      style={{ padding: `${thickness}px 0`, borderRadius: radius, ...userStyle }}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
      />
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
      />
      <div
        className={`relative z-[1] border text-center ${innerClassName}`}
        style={{ background: backgroundColor, color: textColor, borderColor, borderRadius: radius }}
      >
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
