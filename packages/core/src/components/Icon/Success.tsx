import * as React from 'react';

export interface InfoIconProps {
  className?: string;
}

const SuccessIcon = (props: InfoIconProps) => {
  const { className } = props;

  return (
    <svg fill="currentColor" width="14px" height="14px" viewBox="0 0 14 14" className={className}>
      <g stroke="none" strokeWidth="1" fill="none">
        <g transform="translate(-608.000000, -2752.000000)">
          <rect fill="#FFFFFF" x="552" y="2643" width="816" height="656" />
          <rect fill="#F0F2FF" x="592" y="2739" width="736" height="40" rx="4" />
          <path
            d="M615,2752 C618.865993,2752 622,2755.13401 622,2759 C622,2762.86599 618.865993,2766 615,2766 C611.134007,2766 608,2762.86599 608,2759 C608,2755.13401 611.134007,2752 615,2752 Z M617.828427,2756.75736 L614.37868,2760.20711 L612.757359,2758.58579 L612.050253,2759.29289 L614.37868,2761.62132 L618.535534,2757.46447 L617.828427,2756.75736 Z"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  );
};

export default SuccessIcon;
