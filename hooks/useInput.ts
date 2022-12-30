import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

function useInput<T>(initValue: T): {
  value: T;
  setValue: Dispatch<SetStateAction<T>> | Dispatch<T>;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
} {
  const [value, setValue] = useState<T>(initValue);

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const value = e.target.value as T;
    setValue(value);
  };

  return { value, setValue, onChange };
}

export default useInput;
