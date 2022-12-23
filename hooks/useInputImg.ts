import { ChangeEvent, useState } from "react";

const useInputImg = (initValue: FileList | null) => {
  const [files, setFiles] = useState<FileList | null>(initValue);

  const onFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { files } = e.target;

    if (!files) return;

    setFiles(files);
  };

  return { files, setFiles, onFilesChange };
};

export default useInputImg;
