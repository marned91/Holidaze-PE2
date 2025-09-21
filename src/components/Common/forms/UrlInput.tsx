import { TextInput } from './TextInput';

type UrlInputProps = {
  id: string;
  label: string;
  disabled?: boolean;
  ariaInvalid?: boolean;
  errorMessage?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

/**
 * Specialized text input for entering URLs.
 *
 * @param id - Unique input id, linked to the label.
 * @param label - Visible label text.
 * @param disabled - Whether the field is disabled.
 * @param ariaInvalid - Marks the field as invalid for accessibility.
 * @param errorMessage - Optional error text displayed below the input.
 * @param inputProps - Additional props forwarded to the underlying <input>, merged with defaults.
 * @returns A URL input field with placeholder and url-specific input mode.
 */

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
