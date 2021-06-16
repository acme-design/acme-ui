import Radio from './Radio';
import RadioGroup from './RadioGroup';
import RadioButton from './RadioButton';

export type { RadioProps } from './Radio';
export type { RadioButtonProps } from './RadioButton';
export type { RadioGroupProps } from './RadioGroup';

Radio.Group = RadioGroup;
Radio.Button = RadioButton;

export default Radio;
