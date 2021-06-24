/**
 * MDX img 图片
 * */
import React from 'react';
import joinAssetPath from '../../lib/joinAssetPath';

type Props = React.ComponentProps<'img'>;

const Img: React.FC<Props> = (props: Props) => {
  const { src, alt, ...extra } = props;

  if (!src) return null;

  return <img {...extra} src={/^https?\:\/\//.test(src) ? src : joinAssetPath(src)} alt={alt} />;
};

export default Img;
