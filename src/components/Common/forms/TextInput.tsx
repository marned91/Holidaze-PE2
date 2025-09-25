import { type HTMLInputTypeAttribute } from 'react';

type TextInputProps = {
  id: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  disabled?: boolean;
  ariaInvalid?: boolean;
  errorMessage?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

/**
 * Reusable text input field with label and optional error message.
 *
 * @param id - Unique input id, linked to the label.
 * @param label - Visible label text.
 * @param type - Input type (defaults to `"text"`).
 * @param disabled - Whether the field is disabled.
 * @param ariaInvalid - Marks the field as invalid for accessibility.
 * @param errorMessage - Optional error text displayed below the input.
 * @param inputProps - Additional props forwarded to the underlying <input>.
 * @returns A labeled input element with accessible error feedback.
 */
export function TextInput({
  id,
  label,
  type = 'text',
  disabled,
  ariaInvalid,
  errorMessage,
  inputProps,
}: TextInputProps) {
  const hasError = !!errorMessage;
  return (
    <div>
      <label htmlFor={id} className="block text-md text-gray-700 mb-1 font-text">
        {label}
      </label>
      <input
        id={id}
        type={type}
        disabled={disabled}
        aria-invalid={ariaInvalid || undefined}
        className={`w-full font-text border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
          hasError
            ? 'border-red-400 focus:ring-red-300'
            : 'border-gray-300 focus:ring-1 focus:ring-gray-300'
        }`}
        {...inputProps}
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600 font-text italic" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
