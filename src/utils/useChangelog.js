import { useState, useEffect } from 'react';

/** @type {Promise<string>} */
let changeLogLoader;

export const useChangelog = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; 

    const fetchChangeLog = async () => {

        if(!changeLogLoader) {
            changeLogLoader = fetch('/changelog.txt').then(resp=>resp.text());
        }

      try { 
        const text = await changeLogLoader;
        if (isMounted) {
          setContent(text);
          setLoading(false);
        }
      } catch (e) {
        if (e.name !== 'AbortError' && isMounted) {
          setError('Failed to load the changelog. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchChangeLog();

    return () => {
      isMounted = false; 
    };
  }, []);

  return { changelog:content, loading, error };
};
 