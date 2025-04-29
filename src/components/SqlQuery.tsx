'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { QueryRequest, sendQuery } from '../lib/api/requests';
import { FormPage } from './FormPage';
import { FormField, InputField, TextAreaField } from '../types/form';
import { toast } from 'react-hot-toast';
import QueryResults from './QueryResults';
import { CsvQueryResult, QueryResponse } from '../types/csv';

const dummyUrl =
  'https://raw.githubusercontent.com/ngshiheng/michelin-my-maps/main/data/michelin_my_maps.csv';
const dummyQueryString = 'SELECT DISTINCT Location from data LIMIT 10';

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
  };
  const onQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSqlQuery(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!csvUrl || !sqlQuery) {
      return;
    }
    mutation.mutate({ csvUrl, sqlQuery });
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
      />
      {results && <QueryResults results={results} />}
    </>
  );
};
