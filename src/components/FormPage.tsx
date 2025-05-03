'use client';

import { FormField } from '../types/form';
import { ButtonState } from '../types/buttonStates';
import { getButtonClasses, getButtonContent } from '../lib/utils/buttonStates';
import { FormEventHandler, useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styles from '@/styles/formStyles.module.css';

interface FormPageProps {
  pageTitle: string;
  inputFields: FormField[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  resetFields: () => void;
  hasResults: boolean;
}

export const FormPage = ({
  pageTitle,
  inputFields,
  handleSubmit,
  isLoading,
  isSuccess,
  isError,
  resetFields,
  hasResults,
}: FormPageProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [buttonState, setButtonState] = useState<ButtonState>('idle');

  const handleReset = () => {
    setButtonState('idle');
    setErrors({});
    resetFields();
  };

  const handleInvalid: FormEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    e.preventDefault();
    const target = e.currentTarget;
    setErrors((prev) => ({
      ...prev,
      [target.id]: target.validationMessage,
    }));
  };

  const handleInput: FormEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const target = e.currentTarget;
    setErrors((prev) => {
      if (!prev[target.id]) return prev;
      const newErrors = { ...prev };
      delete newErrors[target.id];
      return newErrors;
    });
    setButtonState('idle');
  };

  useEffect(() => {
    setButtonState(isLoading ? 'loading' : isSuccess ? 'success' : isError ? 'error' : 'idle');
  }, [isLoading, isSuccess, isError]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className={`${styles.headerContainer}`}>
        <h1 className={`${styles.header}`}>{pageTitle}</h1>
      </div>

      {inputFields.map((field) => {
        const borderClass = errors[field.id] ? 'border-red-500' : 'border-gray-300';
        return (
          <div key={field.id} className="relative">
            {field.InputType === 'input' ? (
              <input
                id={field.id}
                type="text"
                value={field.value}
                onChange={(e) => field.onChange(e)}
                required={field.required}
                onInvalid={handleInvalid}
                onInput={handleInput}
                className={`
                  ${styles.formField} ${borderClass}`}
              />
            ) : (
              <TextareaAutosize
                id={field.id}
                value={field.value}
                onChange={(e) => field.onChange(e)}
                required={field.required}
                onInvalid={handleInvalid}
                onInput={handleInput}
                className={`${styles.formField} resize-none ${borderClass}`}
              />
            )}

            <label htmlFor={field.id} className={`${styles.overlapLabel}`}>
              {field.label}
              {field.required && <span className="inline-block ml-1 w-2 h-2 text-red-500">*</span>}
            </label>

            {errors[field.id] && <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>}
          </div>
        );
      })}

      <button
        type="submit"
        className={`
          ${getButtonClasses(buttonState)}
          ${styles.largeButton}
        `}
        disabled={isLoading || isSuccess || isError}
      >
        {getButtonContent(buttonState)}
      </button>
      {hasResults && (
        <button
          type="button"
          onClick={handleReset}
          className={`${styles.largeButton} bg-yellow-600 hover:bg-yellow-700`}
        >
          Clear results
        </button>
      )}
    </form>
  );
};
