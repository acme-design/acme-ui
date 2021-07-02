export type NoticeInstanceType<T> = {
  add: (notice: T) => void;
  destroy: () => void;
};

export interface NoticeParent {
  key: string;
  className?: string;
  delay?: number;
  onClose?: () => void;
  closable?: boolean;
}
