import type { ChangeEvent } from "react";

type SelectOption = { value: string; label: string };

export default function Select({
  options = [],
  placeholder = "Select an option",
  onChange,
  className = "",
  value,
  defaultValue = "",
  id,
  name,
  disabled = false,
}: {
  options?: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  value?: string;
  defaultValue?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
}) {
  const isControlled = value !== undefined;

  return (
    <select
      id={id}
      name={name}
      disabled={disabled}
      {...(isControlled
        ? { value, onChange: (event: ChangeEvent<HTMLSelectElement>) => onChange?.(event.target.value) }
        : {
            defaultValue,
            onChange: (event: ChangeEvent<HTMLSelectElement>) => onChange?.(event.target.value),
          })}
      className={`w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-brand-800 outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100 disabled:opacity-50 ${className}`}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
