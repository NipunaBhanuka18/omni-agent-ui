import React, { useState } from 'react';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  labelRight?: React.ReactNode;
  helperText?: string;
  containerClassName?: string;
  wrapperClassName?: string;
}

export default function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  leftIcon,
  rightIcon,
  labelRight,
  helperText,
  containerClassName = '',
  wrapperClassName = '',
  className = '',
  id,
  disabled,
  required,
  ...props
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = React.useId();
  const inputId = id || generatedId;

  const isPasswordType = type === 'password';
  const currentType = isPasswordType ? (showPassword ? 'text' : 'password') : type;
  const effectiveLeftIcon = leftIcon || icon;

  return (
    <div className={`flex flex-col w-full ${containerClassName}`}>
      {/* Label & Optional Right Label Action */}
      {(label || labelRight) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label
              htmlFor={inputId}
              className="text-xs font-semibold text-gray-700 tracking-wide select-none"
            >
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
          {labelRight && <div className="text-xs">{labelRight}</div>}
        </div>
      )}

      {/* Input Container */}
      <div
        className={`relative flex items-center w-full rounded-xl bg-gray-50/80 border transition-all duration-200 ${
          error
            ? 'border-red-300 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10 focus-within:bg-white'
            : 'border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:bg-white hover:border-gray-300'
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-100' : ''} ${wrapperClassName}`}
      >
        {/* Left Icon */}
        {effectiveLeftIcon && (
          <div className="pl-3.5 pr-1 text-gray-400 flex items-center justify-center pointer-events-none shrink-0">
            {effectiveLeftIcon}
          </div>
        )}

        {/* Input Element */}
        <input
          id={inputId}
          type={currentType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full py-3 text-sm text-gray-900 bg-transparent placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed ${
            effectiveLeftIcon ? 'pl-2' : 'pl-3.5'
          } ${rightIcon || isPasswordType ? 'pr-2' : 'pr-3.5'} ${className}`}
          {...props}
        />

        {/* Password Visibility Toggle */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            className="pr-3.5 pl-1 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors shrink-0 cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.03 10.03 0 013.682-.763c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-1.956-1.956A3 3 0 0012 9a3 3 0 00-2.044.793M3 3l18 18"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}

        {/* Right Icon */}
        {!isPasswordType && rightIcon && (
          <div className="pr-3.5 pl-1 text-gray-400 flex items-center justify-center shrink-0">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Error / Helper Text */}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
}
