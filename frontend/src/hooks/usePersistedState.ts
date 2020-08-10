import { useState, useEffect } from 'react';

function usePersistedState<T>(
  key: string,
  initialState?: T
): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>] {
  const [state, setState] = useState<T | undefined>(() => {
    const storedState = JSON.parse(
      localStorage.getItem(key) ?? 'null'
    ) as T | null;

    return storedState ?? initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state ?? null));
  }, [key, state]);

  return [state, setState];
}

export default usePersistedState;
