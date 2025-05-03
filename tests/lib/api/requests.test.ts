import { QueryRequest, sendQuery } from '@/lib/api/requests';

global.fetch = jest.fn();

describe('sendQuery', () => {
  beforeEach(() => {
    // Clear mock data before each test
    jest.clearAllMocks();
  });

  it('should send a POST request with correct parameters', async () => {
    // Test data
    const queryData: QueryRequest = {
      csvUrl: 'https://example.com/data.csv',
      sqlQuery: 'SELECT * FROM table',
    };

    // Mock successful response
    const expectedResponse = {
      message: 'SQL query executed successfully.',
      result: [{ id: 1, name: 'Test' }],
    };

    // Setup fetch mock
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(expectedResponse),
    });

    // Execute the function
    const result = await sendQuery(queryData);

    // Assertions
    expect(global.fetch).toHaveBeenCalledWith('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryData),
    });

    expect(result).toEqual(expectedResponse);
  });

  it('should throw an error when the request fails', async () => {
    // Test data
    const queryData: QueryRequest = {
      csvUrl: 'https://example.com/invalid.csv',
      sqlQuery: 'SELECT * FROM table',
    };

    // Mock failed response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    });

    // Execute and expect error
    await expect(sendQuery(queryData)).rejects.toThrow('Failed to send query');

    // Verify the function called fetch with the right parameters
    expect(global.fetch).toHaveBeenCalledWith('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryData),
    });
  });

  it('should throw an error when fetch rejects', async () => {
    // Test data
    const queryData: QueryRequest = {
      csvUrl: 'https://example.com/data.csv',
      sqlQuery: 'SELECT * FROM table',
    };

    // Mock network error
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    // Execute and expect error
    await expect(sendQuery(queryData)).rejects.toThrow(networkError);

    // Verify the function called fetch with the right parameters
    expect(global.fetch).toHaveBeenCalledWith('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryData),
    });
  });

  it('should handle JSON parsing errors', async () => {
    // Test data
    const queryData: QueryRequest = {
      csvUrl: 'https://example.com/data.csv',
      sqlQuery: 'SELECT * FROM table',
    };

    // Mock JSON parsing error
    const jsonError = new Error('Invalid JSON');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockRejectedValueOnce(jsonError),
    });

    // Execute and expect error
    await expect(sendQuery(queryData)).rejects.toThrow(jsonError);

    // Verify the function called fetch with the right parameters
    expect(global.fetch).toHaveBeenCalledWith('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryData),
    });
  });
});
