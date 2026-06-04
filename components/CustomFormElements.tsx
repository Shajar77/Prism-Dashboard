import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface TextFieldProps {
  label: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  type?: "text" | "number" | "email" | "password" | "date"
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  type = "text",
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className={error ? "text-destructive" : ""}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={error ? "border-destructive focus-visible:ring-destructive" : ""}
      />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}

export interface SelectOption {
  label: string
  value: string
}

export interface SelectFieldProps {
  label: string
  value: string
  onChange: (val: string) => void
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  error,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className={error ? "text-destructive" : ""}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled} required={required}>
        <SelectTrigger className={error ? "border-destructive focus:ring-destructive" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}
