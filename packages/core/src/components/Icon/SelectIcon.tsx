import * as React from 'react';

export interface SelectIconProps {
  className?: string;
}

export const SelectSvg = (props: SelectIconProps) => {
  const { className } = props;
  return (
    <svg className={className} width="10px" height="8px" viewBox="0 0 10 8" version="1.1">
      <g id="acme-select-svg-g" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="acme-select-svg" transform="translate(-1729.000000, -1550.000000)" fill="#000000">
          <g id="acme-select-svg-1" transform="translate(1434.000000, 1525.000000)">
            <polygon
              id="acme-select-svg=path"
              transform="translate(299.585786, 27.757359) rotate(-315.000000) translate(-299.585786, -27.757359) "
              points="297 31.5147186 297 29.5147186 300.171573 29.5147186 300.171573 24 302.171573 24 302.171573 31.5147186"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
