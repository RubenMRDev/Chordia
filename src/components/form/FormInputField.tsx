import type React from "react"
import { IconType } from "react-icons"

interface FormInputFieldProps {
  id: string
  name: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon?: IconType
  placeholder?: string
}

export const FormInputField: React.FC<FormInputFieldProps> = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  icon: Icon,
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
      {Icon ? (
        <div style={{ position: "relative" }}>
          <Icon
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-secondary)",
            }}
          />
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{
              width: "100%",
              padding: "0.75rem",
              paddingLeft: "2.5rem",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px",
              color: "var(--text-primary)",
              fontSize: "1rem",
            }}
          />
        </div>
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "4px",
            color: "var(--text-primary)",
            fontSize: "1rem",
          }}
        />
      )}
    </div>
  )
}
