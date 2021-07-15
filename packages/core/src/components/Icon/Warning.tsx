import * as React from 'react';

export interface WarningIconProps {
  className?: string;
}

const WarningIcon = (props: WarningIconProps) => {
  const { className } = props;

  return (
    <svg fill="currentColor" width="14px" height="14px" viewBox="0 0 14 14" className={className}>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-608.000000, -2808.000000)">
          <rect fill="#FFFFFF" x="552" y="2643" width="816" height="656" />
          <rect fill="#FFF4E6" x="592" y="2795" width="736" height="40" rx="4" />
          <path
            d="M615,2808 C618.865993,2808 622,2811.13401 622,2815 C622,2818.86599 618.865993,2822 615,2822 C611.134007,2822 608,2818.86599 608,2815 C608,2811.13401 611.134007,2808 615,2808 Z M615,2817.07 C614.793333,2817.07 614.623333,2817.13667 614.49,2817.27 C614.343333,2817.39667 614.27,2817.56667 614.27,2817.78 C614.27,2817.98 614.343333,2818.15 614.49,2818.29 C614.63,2818.43 614.8,2818.5 615,2818.5 C615.2,2818.5 615.376667,2818.43333 615.53,2818.3 C615.67,2818.16 615.74,2817.98667 615.74,2817.78 C615.74,2817.56667 615.67,2817.39667 615.53,2817.27 C615.396667,2817.13667 615.22,2817.07 615,2817.07 Z M615.63,2811.36 L614.38,2811.36 L614.61,2816.48 L615.4,2816.48 L615.63,2811.36 Z"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  );
};

export default WarningIcon;
