'use client';

import { JSX } from 'react';
import { FormField } from '../types/form';

interface FormPageProps {
  pageTitle: string;
  inputFields: FormField[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loader?: JSX.Element;
}

export const FormPage = ({ pageTitle, inputFields, handleSubmit, loader }: FormPageProps) => {
  //how are the names?

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center mb-6">{pageTitle}</h1>

      {inputFields.map((input) => {
        return (
          <div className="flex flex-col">
            <label className="mb-2 font-semibold" htmlFor="csv-url">
              {input.label}
            </label>
            {input.InputType === 'input' ? (
              <input
                id={input.id}
                type="text"
                value={input.value}
                onChange={(e) => input.onChange(e)}
                placeholder={input.placeholder}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <textarea
                id={input.id}
                value={input.value}
                onChange={(e) => input.onChange(e)}
                placeholder={input.placeholder}
                className="border border-gray-300 rounded-lg p-3 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}
          </div>
        );
      })}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 px-6 transition-all"
      >
        {!loader && 'Submit'}
      </button>

      {loader}
    </form>
  );
};
