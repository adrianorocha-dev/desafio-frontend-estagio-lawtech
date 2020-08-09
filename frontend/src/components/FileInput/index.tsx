import React, { useRef } from 'react';
import { FiFilePlus } from 'react-icons/fi';

type Props = {
  className?: string;
  onChange: (file: File | undefined) => void;
};

const FileInput: React.FC<Props> = ({ className, onChange }) => {
  console.log('rendered');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSelectFile() {
    inputRef.current?.click();
  }

  return (
    <button className={className} onClick={handleSelectFile}>
      <FiFilePlus />
      <span>Importar Documento</span>

      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={event => onChange(event.target.files?.[0])}
        accept=".pdf"
      />
    </button>
  );
};

export default React.memo(FileInput);
