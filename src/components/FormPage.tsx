// FormPage.tsx
'use client';

import { ClipLoader } from 'react-spinners';
import { FormField } from '../types/form';
import { ButtonState } from '../types/buttonStates';
import { getButtonClasses, getButtonContent } from '../lib/utils/buttonStates';

interface FormPageProps {
  pageTitle: string;
  inputFields: FormField[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export const FormPage = ({
  pageTitle,
  inputFields,
  handleSubmit,
  isLoading,
  isSuccess,
  isError,
}: FormPageProps) => {
  const getButtonState = (): ButtonState => {
    if (isLoading) return 'loading';
    if (isSuccess) return 'success';
    if (isError) return 'error';
    return 'idle';
  };
  const buttonState = getButtonState();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Header */}
      <div className="-mt-8 -mx-8 bg-blue-600 px-8 py-4 text-white">
        <h1 className="text-3xl font-bold text-center">{pageTitle}</h1>
      </div>

      {/* Fields */}
      {inputFields.map((field) => (
        <div key={field.id} className="relative">
          {/* common field classes: full width, extra top padding */}
          {field.InputType === 'input' ? (
            <input
              id={field.id}
              type="text"
              value={field.value}
              onChange={(e) => field.onChange(e)}
              placeholder="" // remove native placeholder
              className="w-full border border-gray-300 rounded-lg px-3 pt-6 pb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <textarea
              id={field.id}
              value={field.value}
              onChange={(e) => field.onChange(e)}
              placeholder=""
              className="w-full border border-gray-300 rounded-lg px-3 pt-6 pb-3 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
          {/* overlapping label */}
          <label
            htmlFor={field.id}
            className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-gray-600 pointer-events-none"
          >
            {field.label}
          </label>
        </div>
      ))}

      {/* Submit Button */}
      <button
        type="submit"
        className={`
          ${getButtonClasses(buttonState)}
          text-white font-semibold rounded-lg py-3 px-6
          transition-colors duration-300 ease-in-out
          flex items-center justify-center
        `}
        disabled={isLoading}
      >
        {getButtonContent(buttonState)}
      </button>
    </form>
  );
};
