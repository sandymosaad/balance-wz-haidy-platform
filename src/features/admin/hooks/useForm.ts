'use client';

import {useState} from 'react';

export function useForm<T extends Record<string, unknown>>(initial: T) {
  const [values, setValues] = useState<T>(initial);

  function setField<K extends keyof T>(key: K, value: T[K]) {
    setValues((prev) => ({...prev, [key]: value}));
  }

  function reset() {
    setValues(initial);
  }

  return {values, setValues, setField, reset};
}
