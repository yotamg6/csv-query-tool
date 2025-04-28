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
  if (!res.ok) {
    throw new Error('Failed to send query');
  }
  return res.json();
};
