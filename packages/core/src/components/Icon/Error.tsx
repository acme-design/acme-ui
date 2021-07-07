import * as React from 'react';

export interface ErrorIconProps {
  className?: string;
}

const ErrorIcon = (props: ErrorIconProps) => {
  const { className } = props;

  return (
    <svg fill="currentColor" width="14px" height="14px" viewBox="0 0 14 14" className={className}>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-608.000000, -2864.000000)">
          <rect fill="#FFFFFF" x="552" y="2643" width="816" height="656" />
          <rect fill="#FFF2F0" x="592" y="2851" width="736" height="40" rx="4" />
          <path
            d="M615,2864 C618.865993,2864 622,2867.13401 622,2871 C622,2874.86599 618.865993,2878 615,2878 C611.134007,2878 608,2874.86599 608,2871 C608,2867.13401 611.134007,2864 615,2864 Z M613.025126,2868.31802 L612.318019,2869.02513 L616.974874,2873.68198 L617.681981,2872.97487 L613.025126,2868.31802 Z"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  );
};

export default ErrorIcon;
