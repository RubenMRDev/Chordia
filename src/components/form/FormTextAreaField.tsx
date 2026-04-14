import type React from "react"

interface FormTextAreaFieldProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
  placeholder?: string
}

export const FormTextAreaField: React.FC<FormTextAreaFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}) => {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          marginBottom: "0.5rem",
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "4px",
          color: "var(--text-primary)",
          fontSize: "1rem",
          resize: "vertical",
        }}
      />
    </div>
  )
}
