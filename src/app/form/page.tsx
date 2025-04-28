'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendQuery } from '@/src/lib/api/requests';

const FormPage = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ csvUrl, sqlQuery });
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Public CSV URL"
          value={csvUrl}
          onChange={(e) => setCsvUrl(e.target.value)}
          className="border p-2"
        />
        <textarea
          placeholder="SQL Query"
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {mutation.isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {mutation.isSuccess && (
        <pre className="mt-4 bg-gray-100 p-4">{JSON.stringify(mutation.data, null, 2)}</pre>
      )}

      {mutation.isError && (
        <div className="text-red-500 mt-4">An error occurred. Please try again.</div>
      )}
    </div>
  );
};

export default FormPage;
