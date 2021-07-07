import * as React from 'react';

export interface InfoIconProps {
  className?: string;
}

const InfoIcon = (props: InfoIconProps) => {
  const { className } = props;

  return (
    <svg fill="currentColor" width="14px" height="14px" viewBox="0 0 14 14" className={className}>
      <g stroke="none" strokeWidth="1" fill="none">
        <g transform="translate(-608.000000, -2696.000000)">
          <rect fill="#FFFFFF" x="552" y="2643" width="816" height="656" />
          <rect fill="#F0F2FF" x="592" y="2683" width="736" height="40" rx="4" />
          <path
            d="M615,2696 C618.865993,2696 622,2699.13401 622,2703 C622,2706.86599 618.865993,2710 615,2710 C611.134007,2710 608,2706.86599 608,2703 C608,2699.13401 611.134007,2696 615,2696 Z M615.82,2701.6 L613.532,2701.6 L613.532,2702.496 L614.812,2702.496 L614.812,2705.104 L613.268,2705.104 L613.268,2706 L616.996,2706 L616.996,2705.104 L615.82,2705.104 L615.82,2701.6 Z M615.86,2699.304 L614.676,2699.304 L614.676,2700.56 L615.86,2700.56 L615.86,2699.304 Z"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  );
};

export default InfoIcon;
