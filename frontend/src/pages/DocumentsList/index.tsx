import React, { useState, useEffect, useCallback } from 'react';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

import Header from '../../components/Header';
import DocumentItem, { Document } from '../../components/DocumentItem';
import FileInput from '../../components/FileInput';

import './styles.css';

const DocumentsList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  const [selectedFile, setSelectedFile] = useState<File>();

  const auth = useAuth();

  const loadUserDocuments = useCallback(() => {
    api
      .get('documents', {
        headers: {
          Authorization: `Bearer ${auth.user?.token}`,
        },
      })
      .then(response => {
        const { documents } = response.data;
        setDocuments(documents);
      })
      .catch(error => {
        console.error(error);
      });
  }, [auth.user]);

  useEffect(() => {
    loadUserDocuments();
  }, [loadUserDocuments]);

  useEffect(() => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('name', selectedFile.name);
    formData.append('document', selectedFile);

    api
      .post('documents', formData, {
        headers: { Authorization: `Bearer ${auth.user?.token}` },
      })
      .then(() => {
        setSelectedFile(undefined);
        loadUserDocuments();
        alert('Documento importado com sucesso');
      })
      .catch(error => {
        console.log(error);
        alert('Erro ao fazer upload do documento.');
      });
  }, [auth.user, loadUserDocuments, selectedFile]);

  const handleFileChanged = useCallback((file: File | undefined) => {
    setSelectedFile(file);
  }, []);

  return (
    <div id="page-documents-list">
      <Header />

      <div className="welcome-container">
        <section>
          <p>Bem-vindo, {auth.user?.email}.</p>
          <p>
            {documents.length > 0
              ? 'Aqui estão seus documentos.'
              : 'Você ainda não importou nenhum documento.'}
          </p>
        </section>

        <FileInput
          className="button-import-document"
          onChange={handleFileChanged}
        />
      </div>

      <div id="document-list-container" className="container">
        <div className="documents-list">
          {documents.map(document => (
            <DocumentItem key={document.id} document={document} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentsList;
