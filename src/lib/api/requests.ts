export interface QueryRequest {
  csvUrl: string;
  sqlQuery: string;
}

export const sendQuery = async (data: QueryRequest) => {
  const res = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (res.status === 204) {
    throw new Error('No results found');
  }

  const payload = await res.json();

  if (!res.ok) {
    throw new Error(payload.error ?? payload.message ?? 'Failed to send query');
  }

  return payload;
};
