import { TextInput } from './TextInput';

type PasswordInputProps = {
  id: string;
  label: string;
  disabled?: boolean;
  ariaInvalid?: boolean;
  errorMessage?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

/**
 * Wrapper around `TextInput` specialized for password entry.
 *
 * @param id - Unique input id for accessibility.
 * @param label - Visible label text.
 * @param disabled - Whether the field is disabled.
 * @param ariaInvalid - Marks the field as invalid for screen readers.
 * @param errorMessage - Error text displayed below the input.
 * @param inputProps - Additional input attributes passed to the underlying <input>.
 * @returns A password input field using the shared `TextInput` component.
 */
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
