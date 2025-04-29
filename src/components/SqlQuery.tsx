'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { QueryRequest, sendQuery } from '../lib/api/requests';
import { FormPage } from './FormPage';
import { FormField, InputField, TextAreaField } from '../types/form';
import { toast } from 'react-hot-toast';
import QueryResults from './QueryResults';
import { CsvQueryResult, QueryResponse } from '../types/csv';

const dummyUrl = 'https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv';

const dummyQueryString =
  'SELECT sepal_length, sepal_width, petal_length, petal_width, species FROM data WHERE sepal_length > 5.0 LIMIT 15';

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
    setCsvUrl(e.target.value);
    if (mutation.isSuccess || mutation.isError) {
      mutation.reset();
    }
  };
  const onQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSqlQuery(e.target.value);
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
  };

  const queryInputField: InputField = {
    label: 'SQL Query',
    value: sqlQuery,
    onChange: onQueryChange,
    placeholder: 'Write your SQL query here',
    InputType: 'input',
    id: 'sql-query',
  };

  const inputFields: FormField[] = [urlInputField, queryInputField];

  useEffect(() => {
    //TODO: remove the whole effect
    setCsvUrl(dummyUrl);
    setSqlQuery(dummyQueryString);
  }, []);
  return (
    <>
      <FormPage
        pageTitle="CSV Query Tool"
        inputFields={inputFields}
        handleSubmit={handleSubmit}
        isLoading={mutation.isPending}
        isSuccess={mutation.isSuccess}
        isError={mutation.isError}
        resetFields={resetFields}
        hasResults={!!results}
      />
      {results && <QueryResults results={results} />}
    </>
  );
};
