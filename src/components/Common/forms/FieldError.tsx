type FieldErrorProps = {
  message?: string;
  id?: string;
};

export function FieldError({ message, id }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-1 text-sm text-red-600 font-text italic"
    >
      {message}
    </p>
  );
}
