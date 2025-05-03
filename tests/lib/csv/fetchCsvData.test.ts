import { fetchCsvData } from '@/lib/csv/fetchCsvData';
import Papa from 'papaparse';

// Mock fetch and papaparse
jest.mock('papaparse');
global.fetch = jest.fn();

describe('fetchCsvData', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch and parse CSV data successfully', async () => {
    // Sample CSV data
    const csvText = 'name,age,city\nJohn,30,New York\nJane,25,Boston';
    const expectedData = [
      { name: 'John', age: '30', city: 'New York' },
      { name: 'Jane', age: '25', city: 'Boston' },
    ];

    // Mock fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValueOnce(csvText),
    });

    // Mock Papa.parse to simulate successful parsing
    (Papa.parse as jest.Mock).mockImplementationOnce((_, options) => {
      options.complete({
        data: expectedData,
        errors: [],
      });
    });

    // Execute the function
    const result = await fetchCsvData('https://example.com/data.csv');

    // Verify the results
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/data.csv');
    expect(result).toEqual(expectedData);
    expect(Papa.parse).toHaveBeenCalledWith(
      csvText,
      expect.objectContaining({
        header: true,
        skipEmptyLines: true,
      }),
    );
  });

  it('should throw an error when fetch fails', async () => {
    // Mock fetch to fail
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    // Execute and verify the function throws an error
    await expect(fetchCsvData('https://example.com/nonexistent.csv')).rejects.toThrow(
      'Failed to fetch CSV file.',
    );

    expect(global.fetch).toHaveBeenCalledWith('https://example.com/nonexistent.csv');
    expect(Papa.parse).not.toHaveBeenCalled();
  });

  it('should throw an error when network request fails', async () => {
    // Mock fetch to throw a network error
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    // Execute and verify the function throws the same error
    await expect(fetchCsvData('https://example.com/data.csv')).rejects.toThrow(networkError);

    expect(global.fetch).toHaveBeenCalledWith('https://example.com/data.csv');
    expect(Papa.parse).not.toHaveBeenCalled();
  });

  it('should reject with error messages when CSV parsing has errors', async () => {
    // Sample CSV text with issues
    const csvText = 'name,age,city\nJohn,30,New York\nJane,invalid,Boston';

    // Mock fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValueOnce(csvText),
    });

    // Mock Papa.parse to simulate parsing errors
    const parseErrors = [
      { message: "Invalid number in column 'age'" },
      { message: 'Missing value in row 2' },
    ];

    (Papa.parse as jest.Mock).mockImplementationOnce((_, options) => {
      options.complete({
        data: [],
        errors: parseErrors,
      });
    });

    // Execute and verify the function rejects with combined error messages
    await expect(fetchCsvData('https://example.com/data.csv')).rejects.toBe(
      "Invalid number in column 'age'; Missing value in row 2",
    );

    expect(global.fetch).toHaveBeenCalledWith('https://example.com/data.csv');
    expect(Papa.parse).toHaveBeenCalledWith(csvText, expect.any(Object));
  });

  it('should reject when Papa.parse has an error callback', async () => {
    // Sample CSV text
    const csvText = 'name,age,city\nJohn,30,New York\nJane,25,Boston';

    // Mock fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValueOnce(csvText),
    });

    // Mock Papa.parse to call the error callback
    const parseError = new Error('Parse error occurred');

    (Papa.parse as jest.Mock).mockImplementationOnce((_, options) => {
      options.error(parseError);
    });

    // Execute and verify the function rejects with the error
    await expect(fetchCsvData('https://example.com/data.csv')).rejects.toThrow(parseError);

    expect(global.fetch).toHaveBeenCalledWith('https://example.com/data.csv');
    expect(Papa.parse).toHaveBeenCalledWith(csvText, expect.any(Object));
  });

  it('should reject with generic error when Papa.parse error is not an Error instance', async () => {
    // Sample CSV text
    const csvText = 'name,age,city\nJohn,30,New York\nJane,25,Boston';

    // Mock fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValueOnce(csvText),
    });

    // Mock Papa.parse to call the error callback with a non-Error value
    (Papa.parse as jest.Mock).mockImplementationOnce((_, options) => {
      options.error('String error message');
    });

    // Execute and verify the function rejects with the generic error
    await expect(fetchCsvData('https://example.com/data.csv')).rejects.toThrow(
      'Unknown parse error',
    );

    expect(global.fetch).toHaveBeenCalledWith('https://example.com/data.csv');
    expect(Papa.parse).toHaveBeenCalledWith(csvText, expect.any(Object));
  });
});
