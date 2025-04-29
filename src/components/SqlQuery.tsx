import { ChangeEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendQuery } from '../lib/api/requests';
import { FormPage } from './FormPage';
import { FormField, InputField, TextAreaField } from '../types/form';
import { satutsToFeedback } from '../lib/utils/form';
import Loader from './Loader';

export const SqlQuery = () => {
  const [csvUrl, setCsvUrl] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');

  const mutation = useMutation({
    mutationFn: sendQuery,
    onSuccess: (data) => {
      console.log('Response:', data);
    },
    onError: (error) => {
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

  const renderByStatus = () => {
    const currentStatus = mutation.isPending
      ? 'pending'
      : mutation.isError
      ? 'error'
      : mutation.isSuccess
      ? 'success'
      : 'idle';
    return satutsToFeedback[currentStatus];
  };

  const loader = mutation.isPending ? <Loader label="Running Query..." /> : undefined;

  const urlInputField: TextAreaField = {
    label: 'CSV URL',
    value: csvUrl,
    onChange: onUrlChange,
    placeholder: 'Enter public CSV URL',
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

  return (
    <FormPage
      pageTitle="CSV Query Tool"
      inputFields={inputFields}
      handleSubmit={handleSubmit}
      loader={loader}
    />
  );
};
