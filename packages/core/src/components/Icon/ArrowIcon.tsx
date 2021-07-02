import * as React from 'react';

export interface IArrowIconProps {
  className?: string;
  onClick?: () => void;
}

export const ArrowSvg = (props: IArrowIconProps) => {
  const { className, onClick } = props;
  return (
    <svg
      width="10px"
      height="7px"
      viewBox="0 0 10 7"
      version="1.1"
      className={className}
      onClick={onClick}
    >
      <g id="arrow-svg" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="arrow-svg-g" transform="translate(-726.000000, -2766.000000)" fill="#666666">
          <g id="arrow-svg-g-2" transform="translate(592.000000, 2749.000000)">
            <polygon
              id="arrow-svg-g-17"
              transform="translate(139.292893, 19.292893) rotate(-315.000000) translate(-139.292893, -19.292893) "
              points="142.585786 22.5857864 136 22.5857864 136 20.5857864 140.585786 20.5857864 140.585786 16 142.585786 16"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
