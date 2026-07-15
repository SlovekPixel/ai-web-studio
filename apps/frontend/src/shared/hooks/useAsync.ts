import { useCallback, useState } from 'react';

type AsyncState<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
};

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(async (promise: Promise<T>) => {
    setState({ data: null, error: null, isLoading: true });

    try {
      const data = await promise;
      setState({ data, error: null, isLoading: false });
      return data;
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error('Unknown error');
      setState({ data: null, error: normalizedError, isLoading: false });
      throw normalizedError;
    }
  }, []);

  return { ...state, execute };
}
