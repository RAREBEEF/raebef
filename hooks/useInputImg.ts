import { ChangeEvent, useState } from "react";

const useInputImg = () => {
  const [files, setFiles] = useState<FileList | null>();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;

    if (!files) return;

    setFiles(files);
  };

  return { files, setFiles, onChange };
};

export default useInputImg;
