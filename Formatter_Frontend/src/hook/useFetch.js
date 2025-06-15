// hooks/useApi.js
import { useState, useCallback } from 'react';
import axios from 'axios';

export function useApi(baseURL = '') {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(async ({ url, method = 'GET', body = null, headers = {} }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        method,
        url: baseURL + url,
        data: body,
        headers,
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err; // optional: rethrow for external handling
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  return { data, error, loading, request };
}
