import clsx from 'clsx';
import { Roboto_Mono } from 'next/font/google';
import React from 'react';

const robotoMono = Roboto_Mono({ subsets: ['latin'] });

type ButtonProps = {
  id: string;
  label: string;
  leftIcon: React.ReactNode;
  containerClass: string;
};

const Button: React.FC<ButtonProps> = ({
  id,
  label,
  leftIcon,
  containerClass,
}) => {
  return (
    <button
      id={id}
      className={clsx(
        'group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-violet-50 px-7 py-3 text-black',
        containerClass,
      )}
    >
      {leftIcon}
      <span
        className={clsx(
          'relative inline-flex overflow-hidden text-xs uppercase',
          robotoMono.className,
        )}
      >
        <div>{label}</div>
      </span>
    </button>
  );
};

export default Button;
