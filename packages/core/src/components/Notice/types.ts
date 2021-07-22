export interface NoticeParent {
  key: string;
  className?: string;
  delay?: number;
  onClose?: () => void;
  closable?: boolean;
}
