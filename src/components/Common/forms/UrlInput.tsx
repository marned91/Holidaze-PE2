import { TextInput } from './TextInput';

type UrlInputProps = {
  id: string;
  label: string;
  disabled?: boolean;
  ariaInvalid?: boolean;
  errorMessage?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export function UrlInput({
  id,
  label,
  disabled,
  ariaInvalid,
  errorMessage,
  inputProps,
}: UrlInputProps) {
  return (
    <TextInput
      id={id}
      label={label}
      type="url"
      disabled={disabled}
      ariaInvalid={ariaInvalid}
      errorMessage={errorMessage}
      inputProps={{ inputMode: 'url', placeholder: 'https://…', ...inputProps }}
    />
  );
}
