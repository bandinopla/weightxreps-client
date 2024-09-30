import { useState } from 'react';

/**
 * A custom hook to handle fetch requests with optional query string parameters.
 * 
 * @returns {[triggerFetch: (url: string, queryParams?: Record<string, any>, options?: RequestInit) => Promise<void>, state: FetchState]} A tuple containing the function to trigger the fetch and the state of the fetch.
 */
function useFetch() {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  /**
   * Triggers the fetch request.
   * @param {string} url - The URL to fetch data from.
   * @param {Record<string, any>} [queryParams] - Optional query parameters.
   * @param {RequestInit} [options] - Optional fetch options.
   * @returns {Promise<void>}
   */
  const triggerFetch = async (url, queryParams, options = {}) => {
    setState({ data: null, loading: true, error: null });

    // Construct the query string
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    try {
      const response = await fetch(fullUrl, options);
      const result = await response.json();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error:error.message });
    }
  };

  return [triggerFetch, state];
}

export default useFetch;
