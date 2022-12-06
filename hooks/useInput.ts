import { ChangeEvent, useState } from "react";

const useInput = (initValue: string) => {
  const [value, setValue] = useState<string>(initValue);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return { value, setValue, onChange };
};

export default useInput;
