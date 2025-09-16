import { TextInput } from './TextInput';

type PasswordInputProps = {
  id: string;
  label: string;
  disabled?: boolean;
  ariaInvalid?: boolean;
  errorMessage?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export function PasswordInput({
  id,
  label,
  disabled,
  ariaInvalid,
  errorMessage,
  inputProps,
}: PasswordInputProps) {
  return (
    <TextInput
      id={id}
      label={label}
      type="password"
      disabled={disabled}
      ariaInvalid={ariaInvalid}
      errorMessage={errorMessage}
      inputProps={inputProps}
    />
  );
}
