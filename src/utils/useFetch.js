import { useState } from 'react';

/**
 * @typedef {Object} FetchState
 * @property {string} [error]
 * @property {boolean} [loading]
 * @property {any} [data]
 */

/**
 * @typedef {Object} ResponseParser
 * @property {(response:Response)=>Promise<any>} [responseParser]
 */
 

/**
 * A custom hook to handle fetch requests with optional query string parameters.
 * 
 * @param { (resp:any)=>any } [transformResponse] Manipulate the response before it is resolved. Can throw errors.
 * 
 * @returns {[triggerFetch: (url: string, queryParams?: Record<string, any>, options?: RequestInit & ResponseParser) => Promise<void>, state: FetchState]} A tuple containing the function to trigger the fetch and the state of the fetch.
 */
function useFetch( transformResponse ) {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  /**
   * Triggers the fetch request.
   * @param {string} url - The URL to fetch data from.
   * @param {Record<string, any>} [queryParams] - Optional query parameters.
   * @param {RequestInit & ResponseParser} [options] - Optional fetch options.
   * @param {(response:Response)=>Promise<any>} [responseParser]
   * @returns {Promise<void>}
   */
  const triggerFetch = async (url, queryParams, options = {} ) => {
    setState({ data: null, loading: true, error: null });

    // Construct the query string
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    try {
      const response = await fetch(fullUrl, options);
 
      let result = await ( options.responseParser? options.responseParser(response) : response.json() ) ;
      let error = result?.error_description || result?.error;

      if( error )
      {
        throw new Error(error);
      } 

      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error:error.message });
    }
  };

  return [triggerFetch, state];
}

export default useFetch;
