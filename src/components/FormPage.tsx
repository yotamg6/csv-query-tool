'use client';
import { JSX } from 'react';
import { FormField } from '../types/form';
import Loader from './Loader';

interface FormPageProps {
  pageTitle: string;
  inputFields: FormField[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  loaderLabel: string;
}

export const FormPage = ({
  pageTitle,
  inputFields,
  handleSubmit,
  isLoading,
  loaderLabel,
}: FormPageProps) => {
  //TODO: how are the names?

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center mb-6">{pageTitle}</h1>

      {inputFields.map((field) => {
        return (
          <div key={field.id} className="flex flex-col">
            <label className="mb-2 font-semibold" htmlFor={field.id}>
              {field.label}
            </label>
            {field.InputType === 'input' ? (
              <input
                id={field.id}
                type="text"
                value={field.value}
                onChange={(e) => field.onChange(e)}
                placeholder={field.placeholder}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <textarea
                id={field.id}
                value={field.value}
                onChange={(e) => field.onChange(e)}
                placeholder={field.placeholder}
                className="border border-gray-300 rounded-lg p-3 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}
          </div>
        );
      })}
      {isLoading ? (
        <Loader label={loaderLabel} />
      ) : (
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 px-6 transition-all"
        >
          Submit
        </button>
      )}
    </form>
  );
};
