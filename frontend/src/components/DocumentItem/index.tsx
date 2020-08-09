import React from 'react';
import { Link } from 'react-router-dom';

import heroImg from '../../assets/HeroImg.svg';

import './styles.css';

export interface Document {
  id: number;
  name: string;
}

const DocumentItem: React.FC<{ document: Document }> = ({ document }) => {
  return (
    <Link to={`/document/${document.id}`} className="document-container">
      <header>{document.name}</header>
      <main>
        <img
          src={heroImg}
          alt="Document preview"
          className="document-thumbnail"
        />
      </main>
    </Link>
  );
};

export default React.memo(DocumentItem);
