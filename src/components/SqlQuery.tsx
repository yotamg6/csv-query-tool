'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { QueryRequest, sendQuery } from '../lib/api/requests';
import { FormPage } from './FormPage';
import { FormField, TextAreaField } from '../types/form';
import { toast } from 'react-hot-toast';
import QueryResults from './QueryResults';
import { CsvQueryResult, QueryResponse } from '../types/csv';
import styles from '@/styles/formStyles.module.css';

export const SqlQuery = () => {
  const [csvUrl, setCsvUrl] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [results, setResults] = useState<CsvQueryResult | null>(null);

  const mutation = useMutation<QueryResponse, Error, QueryRequest>({
    mutationFn: sendQuery,
    onSuccess: (data) => {
      setResults(data.result);
      toast.success(data.message);
      setCsvUrl('');
      setSqlQuery('');
    },
    onError: (error) => {
      toast.error(error.message);
      setCsvUrl('');
      setSqlQuery('');
      console.error('Error:', error);
    },
  });

  const onUrlChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCsvUrl(e.currentTarget.value);
    if (mutation.isSuccess || mutation.isError) {
      mutation.reset();
    }
  };
  const onQueryChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSqlQuery(e.currentTarget.value);
    if (mutation.isSuccess || mutation.isError) {
      mutation.reset();
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!csvUrl || !sqlQuery) {
      toast.error('');
    }
    mutation.mutate({ csvUrl, sqlQuery });
  };

  const resetFields = () => {
    setResults(null);
    mutation.reset();
  };

  const urlInputField: TextAreaField = {
    label: 'CSV URL',
    value: csvUrl,
    onChange: onUrlChange,
    placeholder: 'Enter CSV URL',
    InputType: 'textArea',
    id: 'csv-url',
    required: true,
  };

  const queryInputField: TextAreaField = {
    label: 'SQL Query',
    value: sqlQuery,
    onChange: onQueryChange,
    placeholder: 'Write your SQL query here',
    InputType: 'textArea',
    id: 'sql-query',
    required: true,
  };

  const inputFields: FormField[] = [urlInputField, queryInputField];

  return (
    <>
      <FormPage
        pageTitle="CSV Query Tool"
        inputFields={inputFields}
        handleSubmit={handleSubmit}
        isLoading={mutation.isPending}
        isSuccess={mutation.isSuccess}
        isError={mutation.isError}
      />
      {results && (
        <>
          <button
            type="button"
            onClick={resetFields}
            className={`${styles.largeButton} w-full bg-yellow-600 hover:bg-yellow-700 mt-4`}
          >
            Clear results
          </button>
          <QueryResults results={results} />
        </>
      )}
    </>
  );
};
