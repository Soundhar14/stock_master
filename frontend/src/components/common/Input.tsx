import { useFetchEmployees } from '@/queries/employeeQueries/employeesQuery'
import { motion } from 'framer-motion'
import React from 'react'

type InputType = 'str' | 'num'

/**
 * Generic Input component for handling both string and number values.
 * Can be used in reusable forms with strict type control and validation.
 *
 * @template T - Input value type (string | number)
 */
interface InputProps<T extends string | number> {
  /** Label title above the input field */
  title: string
  /** Placeholder text for the input */
  placeholder?: string
  /** Current input value */
  inputValue: T
  /**
   * Callback triggered on value change
   * @param value - New value of input
   */
  onChange: (value: T) => void
  /** Input type - "str" for text, "num" for number */
  type?: InputType
  /** Optional input `name` attribute */
  name?: string
  /** Prefix label shown before the input (e.g., ₹ or +91) */
  prefixText?: string
  /** Maximum character length (applies to string input only) */
  maxLength?: number
  /** Minimum numeric value allowed (for type="num") */
  min?: number
  /** Maximum numeric value allowed (for type="num") */
  max?: number
  /** Whether the input is required for form submission */
  disabled?: boolean
  /** Whether the input is required for form submission */
  required?: boolean
  /** Minimum string length allowed (for type="str") */
  minLength?: number
  /**
   * @deprecated Use a separate <ReadonlyField /> instead.
   */
  viewMode?: boolean
  /** Extra custom CSS classes */
  className?: string
}

/**
 * Reusable Input component with strict typing and smart constraints.
 * Supports both text and number fields, with prefix, length limits, and min/max validation.
 *
 * @example
 * ```tsx
 * <Input
 *   title="Phone Number"
 *   inputValue={phone}
 *   onChange={(val) => setPhone(val)}
 *   type="num"
 *   prefixText="+91"
 *   max={9999999999}
 * />
 * ```
 */
const Input = <T extends string | number>({
  required = false,
  title,
  placeholder = '',
  inputValue,
  onChange,
  type = 'str',
  name = '',
  prefixText = '',
  maxLength = 36,
  min,
  max,
  className = '',
  disabled = false,
  minLength = 0,
  viewMode = false, //depriciate dont-use
}: InputProps<T>) => {
  const inputType = type === 'num' ? 'number' : 'text'

  /**
   * Handles input changes with type-aware validation.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value

    if (type === 'num') {
      if (raw === '') {
        onChange('' as T)
        return
      }

      // Allow intermediate decimal input like "12." or "0."
      if (/^\d*\.?\d*$/.test(raw)) {
        const num = parseFloat(raw)

        // Skip NaN for incomplete input like "."
        if (!isNaN(num)) {
          if (
            (min !== undefined && num < min) ||
            (max !== undefined && num > max)
          )
            return
          onChange(num as T)
        } else {
          // Still call onChange for partial decimals like "12."
          onChange(raw as T)
        }
      }
    } else {
      // For non-numeric input, just pass the string
      onChange(raw as T)
    }
  }

  return (
    <motion.div
      initial={{ y: -10 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="relative w-full min-w-[180px] self-stretch"
    >
      <h3
        className={`mb-0.5 w-full justify-start ${viewMode ? 'text-base font-medium text-slate-600' : 'text-xs leading-loose font-semibold text-slate-700'}`}
      >
        {title} {required && <span className="text-red-500"> *</span>}
      </h3>
      <div
        className={`input-container flex cursor-text flex-row items-center justify-center gap-0 overflow-clip rounded-xl ${viewMode ? '' : 'border-2 border-slate-300 bg-white transition-all focus-within:border-slate-500'} `}
      >
        {prefixText && (
          <div className="flex h-full items-center justify-start bg-slate-100 px-3 py-2 text-sm leading-loose font-medium text-slate-700">
            {prefixText}
          </div>
        )}
        <input
          required={required}
          readOnly={disabled}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          disabled={disabled}
          type={inputType}
          name={name}
          step={type === 'num' ? '.1' : undefined}
          placeholder={placeholder}
          onChange={handleChange}
          value={inputValue}
          className={`custom-disabled-cursor hover:cursor[text]:color-black min-h-max w-full ${
            disabled ? 'bg-slate-200' : 'cursor-text'
          } ${className} text-start ${viewMode ? 'text-base font-medium text-slate-900' : 'px-3 py-3 text-sm font-medium text-slate-600 autofill:text-black focus:outline-none'} read-only:cursor-default read-only:bg-white`}
          maxLength={type === 'str' ? maxLength : undefined}
          min={type === 'num' ? min : undefined}
          max={type === 'num' ? max : undefined}
          minLength={type === 'str' ? minLength : undefined}
        />
      </div>
    </motion.div>
  )
}

export default Input

interface CheckBoxProps {
  checked: boolean
  disabled?: boolean
  className?: string
  label?: string
  onChange: (value: boolean) => void
}

/**
 * Checkbox component styled like the main Input component.
 * Label on the left, checkbox on the right inside bordered container.
 */
export const CheckBox: React.FC<CheckBoxProps> = ({
  checked,
  disabled = false,
  onChange,
  className,
  label,
}) => {
  // Generate unique ID to avoid conflicts when label is empty
  const uniqueId = React.useMemo(
    () => `checkbox-${label || Math.random().toString(36).substr(2, 9)}`,
    [label]
  )

  return (
    <motion.div
      initial={{ y: -10 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`${className} relative w-full`}
    >
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={uniqueId}
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label
          htmlFor={uniqueId}
          className={`relative flex max-h-3 max-w-3 ${disabled ? 'cursor-default' : 'cursor-pointer'} rounded-[6px] border-2 p-[8px] transition-all outline-none focus:outline-none ${
            checked
              ? 'border-blue-500 bg-blue-500'
              : 'border-slate-300 bg-slate-100 shadow-sm'
          }`}
        >
          {checked && (
            <img
              className="pointer-events-none absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-default select-none"
              src="/icons/tick-icon.svg"
              alt="tick"
            />
          )}
        </label>
      </div>
    </motion.div>
  )
}

interface InputCheckboxProps {
  title: string
  checked: boolean
  disabled?: boolean
  className?: string
  label?: string
  onChange: (value: boolean) => void
}

/**
 * Checkbox component styled like the main Input component.
 * Label on the left, checkbox on the right inside bordered container.
 */
export const InputCheckbox: React.FC<InputCheckboxProps> = ({
  title,
  checked,
  disabled = false,
  onChange,
  className,
  label,
}) => {
  // Generate unique ID to avoid conflicts with duplicate titles
  const uniqueId = React.useMemo(
    () => `input-checkbox-${title}-${Math.random().toString(36).substr(2, 9)}`,
    [title]
  )

  return (
    <motion.div
      initial={{ y: -10 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`${className} relative w-full min-w-[180px] self-stretch`}
    >
      <h3
        className={`mb-0.5 w-full justify-start text-xs leading-loose font-semibold text-slate-700`}
      >
        {label}
      </h3>
      <div
        className={`input-container flex flex-row items-center justify-between rounded-xl border-2 border-slate-300 bg-white px-3 py-2 pr-2 transition-all duration-200 ease-in-out`}
      >
        <span className="text-sm font-medium text-slate-600">{title}</span>

        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={uniqueId}
            className="sr-only"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
          />
          <label
            htmlFor={uniqueId}
            className={`relative block h-5 w-5 ${disabled ? 'cursor-default' : 'cursor-pointer'} rounded-[8px] border-2 p-[12px] transition-all outline-none focus:outline-none ${
              checked
                ? 'border-blue-500 bg-blue-500'
                : 'border-slate-300 bg-slate-100 shadow-sm'
            }`}
          >
            {checked && (
              <img
                className="pointer-events-none absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-default select-none"
                src="/icons/tick-icon.svg"
                alt="tick"
              />
            )}
          </label>
        </div>
      </div>
    </motion.div>
  )
}

interface DateInputProps {
  title?: string
  value: string
  onChange: (val: string) => void
  name?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  maxDate?: string
}

export const DateInput: React.FC<DateInputProps> = ({
  title,
  value,
  onChange,
  name = '',
  placeholder = 'Select date',
  required = false,
  disabled = false,
  maxDate,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="relative w-full min-w-[180px] self-stretch">
      {title && (
        <h3 className="mb-0.5 w-full justify-start text-xs leading-loose font-semibold text-slate-700">
          {title} {required && <span className="text-red-500"> *</span>}
        </h3>
      )}

      <div
        onClick={() => {
          if (!disabled) inputRef.current?.showPicker?.()
          inputRef.current?.focus()
        }}
        className={`input-container group flex flex-row items-center justify-between gap-2 overflow-clip rounded-xl border-2 border-slate-300 bg-white transition-all select-none ${
          !disabled
            ? 'cursor-pointer focus-within:border-slate-500'
            : 'cursor-not-allowed'
        }`}
      >
        <input
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            zoom: 1,
            WebkitAppearance: 'textfield',
          }}
          ref={inputRef}
          required={required}
          disabled={disabled}
          readOnly={disabled}
          type="date"
          name={name}
          max={maxDate}
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
          className="min-h-max w-full px-3 py-3 text-start text-sm font-medium text-slate-600 select-none autofill:text-black focus:outline-none"
        />
      </div>
    </div>
  )
}
import { useState, useEffect, useRef } from 'react'

interface AutoSuggestInputProps {
  title: string
  onSelect: (item: DropdownOption) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  inputValue?: string // controlled value
  onInputChange?: (value: string) => void // controlled input change
}

export const AutoSuggestInput: React.FC<AutoSuggestInputProps> = ({
  title,
  onSelect,
  placeholder = 'Search...',
  required = false,
  disabled = false,
  inputValue: controlledInputValue,
  onInputChange,
}) => {
  const [internalInputValue, setInternalInputValue] = useState('')
  const inputValue = controlledInputValue ?? internalInputValue // controlled or internal
  const setInputValue = onInputChange ?? setInternalInputValue

  const [debouncedValue, setDebouncedValue] = useState(inputValue)
  const [suggestions, setSuggestions] = useState<DropdownOption[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const listRef = useRef<HTMLUListElement>(null)

  const { data: suggestedEmployee, isLoading, refetch } = useFetchEmployees()

  // debounce controlled/internal inputValue
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(inputValue), 300)
    return () => clearTimeout(timer)
  }, [inputValue])

  useEffect(() => {
    if (debouncedValue.length > 1) {
      refetch()
      const employees = suggestedEmployee?.data || []
      if (employees.length > 0) {
        setSuggestions(
          employees.map((item) => ({
            id: item.id!,
            label: item.code,
          }))
        )
      } else {
        setSuggestions([{ id: 0, label: 'No results found' }])
      }
      setIsVisible(true)
    } else {
      setSuggestions([])
      setIsVisible(false)
    }
  }, [debouncedValue, suggestedEmployee, refetch])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSelect(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setIsVisible(false)
    }
  }

  const handleSelect = (item: DropdownOption) => {
    setInputValue(item.label)
    onSelect(item)
    setSuggestions([])
    setIsVisible(false)
    setSelectedIndex(-1)
  }

  return (
    <div className="relative w-full min-w-[180px] self-stretch">
      <h3 className="mb-0.5 w-full justify-start text-xs leading-loose font-semibold text-slate-700">
        {title} {required && <span className="text-red-500">*</span>}
      </h3>

      <div
        className={`input-container group flex flex-row items-center justify-between overflow-clip rounded-xl border-2 bg-white transition-all ${
          disabled
            ? 'cursor-default bg-slate-200'
            : 'cursor-text border-slate-300 focus-within:border-slate-500'
        }`}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          disabled={disabled}
          readOnly={disabled}
          onChange={(e) => {
            setInputValue(e.target.value)
            setSelectedIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          className="min-h-max w-full px-3 py-3 text-start text-sm font-medium text-slate-600 autofill:text-black focus:outline-none"
        />
      </div>

      {isVisible && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-300 bg-white shadow-md"
        >
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`flex cursor-pointer items-center gap-3 px-3 py-2 ${
                index === selectedIndex ? 'bg-purple-200' : 'hover:bg-gray-100'
              }`}
            >
              <div className="text-sm font-medium">
                {isLoading ? 'Loading...' : item.label}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export interface DropdownOption {
  label: string
  id: number
}
