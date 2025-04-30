'use client';

import { FormField } from '../types/form';
import { ButtonState } from '../types/buttonStates';
import { getButtonClasses, getButtonContent } from '../lib/utils/buttonStates';
import { FormEventHandler, useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

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
      <div className="-mt-8 -mx-8 bg-blue-600 px-8 py-4 text-white">
        <h1 className="text-3xl font-bold text-center">{pageTitle}</h1>
      </div>

      {inputFields.map((field) => {
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
                  w-full rounded-lg px-3 pt-6 pb-3
                  border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none
                  ${errors[field.id] ? 'focus:ring-red-400' : 'focus:ring-blue-400'}
                `}
              />
            ) : (
              <TextareaAutosize
                id={field.id}
                value={field.value}
                onChange={(e) => field.onChange(e)}
                required={field.required}
                onInvalid={handleInvalid}
                onInput={handleInput}
                className={`w-full resize-none rounded-lg px-3 pt-6 pb-3 border ${
                  errors[field.id]
                } ? 'border-red-500' : 'border-gray-300'}
                focus:outline-none
                ${errors[field.id]} ? 'focus:ring-red-400' : 'focus:ring-blue-400`}
              />
            )}

            <label
              htmlFor={field.id}
              className="
                absolute left-3 top-0 -translate-y-1/2
                bg-white px-1 text-sm text-gray-600 pointer-events-none
              "
            >
              {field.label}
              {field.required && errors[field.id] && (
                <span className="inline-block ml-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </label>

            {errors[field.id] && <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>}
          </div>
        );
      })}

      <button
        type="submit"
        className={`
          ${getButtonClasses(buttonState)}
          text-white font-semibold rounded-lg py-3 px-6
          transition-colors duration-300 ease-in-out
          flex items-center justify-center
        `}
        disabled={isLoading || isSuccess || isError}
      >
        {getButtonContent(buttonState)}
      </button>
      {hasResults && (
        <button
          type="button"
          onClick={handleReset}
          className="
           bg-yellow-600 hover:bg-yellow-700
           text-white font-semibold rounded-lg
           py-3 px-6 mt-2 transition-colors duration-300 ease-in-out
         "
        >
          Clear results
        </button>
      )}
    </form>
  );
};
