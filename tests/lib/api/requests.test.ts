import { sendQuery } from '@/lib/api/requests';

describe('sendQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call fetch with the correct parameters', async () => {
    // Setup test data
    const queryData = {
      csvUrl: 'https://example.com/data.csv',
      sqlQuery: 'SELECT * FROM data',
    };

    // Mock fetch with successful response
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        message: 'Success',
        result: [{ id: 1, name: 'Test' }],
      }),
    });

    // Execute
    const result = await sendQuery(queryData);

    // Verify the function called fetch with the right parameters
    expect(global.fetch).toHaveBeenCalledWith('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryData),
    });

    // Verify result
    expect(result).toEqual({
      message: 'Success',
      result: [{ id: 1, name: 'Test' }],
    });
  });

  it('should handle 204 (No Content) response', async () => {
    // Setup test data
    const queryData = {
      csvUrl: 'https://example.com/data.csv',
      sqlQuery: 'SELECT * FROM data WHERE 1=0',
    };

    // Mock fetch with 204 response
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: jest.fn().mockRejectedValue(new Error('Unexpected end of JSON input')),
    });

    // Execute and expect error
    await expect(sendQuery(queryData)).rejects.toThrow('No results found');

    // Verify the function called fetch with the right parameters
    expect(global.fetch).toHaveBeenCalledWith('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryData),
    });
  });

  it('should throw an error when the request fails', async () => {
    // Setup test data
    const queryData = {
      csvUrl: 'https://example.com/data.csv',
      sqlQuery: 'SELECT * FROM data',
    };

    // Mock fetch with error response
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({
        error: 'Failed to send query',
      }),
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

  it('should use default error message when no error message is returned', async () => {
    // Setup test data
    const queryData = {
      csvUrl: 'https://example.com/data.csv',
      sqlQuery: 'SELECT * FROM data',
    };

    // Mock fetch with error response that has no error message
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({}),
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

  it('should handle JSON parsing errors', async () => {
    // Setup test data
    const queryData = {
      csvUrl: 'https://example.com/data.csv',
      sqlQuery: 'SELECT * FROM data',
    };

    // Mock fetch with a response that will fail to parse JSON
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
    });

    // Execute and expect error
    await expect(sendQuery(queryData)).rejects.toThrow('Invalid JSON');

    // Verify the function called fetch with the right parameters
    expect(global.fetch).toHaveBeenCalledWith('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryData),
    });
  });
});
