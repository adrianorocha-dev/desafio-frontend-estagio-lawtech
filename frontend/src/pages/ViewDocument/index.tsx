import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FiMenu, FiTrash2 } from 'react-icons/fi';
import { Document, Page, pdfjs } from 'react-pdf';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

import Header from '../../components/Header';

import './styles.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Bookmark {
  id: number;
  documentId: number;
  pageNumber: number;
  text: string;
}

const ViewDocument: React.FC = () => {
  const [documentLink, setDocumentLink] = useState('');
  const [sideBarOpen, setSideBarOpen] = useState(
    getViewportWidth() > 700 ? true : false
  );

  const [pages, setPages] = useState<pdfjs.PDFPageProxy[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const params = useParams<{ id: string }>();
  const auth = useAuth();

  useEffect(() => {
    api
      .get(`documents/${params.id}`, {
        headers: { Authorization: `Bearer ${auth.user?.token}` },
      })
      .then(response => {
        setDocumentLink(response.data.downloadLink);
        setBookmarks(response.data.bookmarks);
      })
      .catch(error => {
        console.log(error);
      });
  }, [auth.user, params.id]);

  function handleToggleSideBar() {
    setSideBarOpen(value => !value);
  }

  async function handleDocumentLoaded(pdf: pdfjs.PDFDocumentProxy) {
    const pagesPromises: Promise<pdfjs.PDFPageProxy>[] = [];

    for (let i = 0; i < pdf.numPages; i++) {
      const promise = new Promise<pdfjs.PDFPageProxy>((resolve, reject) => {
        pdf.getPage(i + 1).then(
          result => resolve(result),
          error => reject(error)
        );
      });

      pagesPromises.push(promise);
    }

    try {
      const pages = await Promise.all(pagesPromises);

      setPages(pages);
    } catch (error) {
      console.log(error);
    }
  }

  function adjustSpanTagsToPDF() {
    // const element = document.querySelector<HTMLDivElement>(
    //   '.react-pdf__Page__textContent'
    // );
    // element!.style.transform = 'translate(-50%, calc(-50% - 35px))';
  }

  function findElementByInnerText(text: string) {
    const spanTags = document.getElementsByTagName('span');

    let found;
    for (let i = 0; i < spanTags.length; i++) {
      if (spanTags[i].innerText === text) {
        found = spanTags[i];
        break;
      }
    }

    return found;
  }

  function handleGoToBookmark(bookmark: Bookmark) {
    const element = findElementByInnerText(bookmark.text);

    if (element) {
      if (getViewportWidth() <= 700) {
        setSideBarOpen(false);
      }

      element.scrollIntoView({ behavior: 'smooth' });

      element.style.backgroundColor = '#0000FF30';

      setTimeout(() => {
        element.style.backgroundColor = 'transparent';
      }, 1500);
    }
  }

  async function handleDeleteBookmark(bookmark: Bookmark) {
    const response = await api.delete(`bookmarks/${bookmark.id}`, {
      headers: { Authorization: `Bearer ${auth.user?.token}` },
    });

    if (response.status === 200) {
      setBookmarks(items => items.filter(item => item.id !== bookmark.id));
    }
  }

  const handleClickOnText = useCallback(
    async (event: MouseEvent) => {
      const span = event.target as HTMLSpanElement | any;

      if (!(span instanceof HTMLSpanElement)) {
        return;
      }

      if (span.innerText.trim() === '') {
        return;
      }

      const pages = document.getElementsByClassName('react-pdf__Page');

      let pageFound;
      for (let i = 0; i < pages.length; i++) {
        const page = pages.item(i);

        if (page?.contains(span)) {
          pageFound = page;
          break;
        }
      }

      if (pageFound) {
        const pageNumber = pageFound.getAttribute('data-page-number');

        const bookmark = {
          documentId: 1,
          pageNumber: Number(pageNumber),
          text: span.innerText,
        };

        const response = await api.post('bookmarks', bookmark, {
          headers: { Authorization: `Bearer ${auth.user?.token}` },
        });

        if (response.status === 201) {
          setBookmarks(bmks => [
            ...bmks,
            { ...bookmark, id: response.data.id },
          ]);
        }
      }
    },
    [auth.user]
  );

  useEffect(() => {
    pdfContainerRef.current?.addEventListener('dblclick', handleClickOnText);
  }, [handleClickOnText]);

  return (
    <div id="page-view-document">
      <Header
        menuButton={
          <button className="header-button" onClick={handleToggleSideBar}>
            <FiMenu />
          </button>
        }
      />

      <div className="page-container">
        <aside className={'sidebar ' + (sideBarOpen ? '' : 'sidebar-closed')}>
          <div className="sidebar-container">
            <header>
              <h1>Bookmarks</h1>
            </header>

            <main>
              <ul className="bookmarks-list">
                {bookmarks.map((bookmark, index) => (
                  <li key={index}>
                    <button
                      className="bookmark-link"
                      onClick={() => handleGoToBookmark(bookmark)}
                    >
                      {bookmark.text.length > 20
                        ? bookmark.text.substr(0, 17) + '...'
                        : bookmark.text}
                    </button>
                    <button
                      className="bookmark-delete"
                      onClick={() => handleDeleteBookmark(bookmark)}
                    >
                      <FiTrash2 />
                    </button>
                  </li>
                ))}
              </ul>
            </main>
          </div>
        </aside>

        <main>
          <div className="pdf-container" ref={pdfContainerRef}>
            <Document
              className="pdf-renderer"
              onLoadSuccess={handleDocumentLoaded}
              file={documentLink}
            >
              {pages.map(page => (
                <Page
                  key={page.pageNumber}
                  className="pdf-page"
                  pageNumber={page.pageNumber}
                  onLoadSuccess={adjustSpanTagsToPDF}
                  renderAnnotationLayer={false}
                  width={Math.min(getViewportWidth(), 700)}
                />
              ))}
            </Document>
          </div>
        </main>
      </div>
    </div>
  );
};

function getViewportWidth() {
  return Math.max(
    document.documentElement.clientWidth ?? 0,
    window.innerWidth ?? 0
  );
}

export default ViewDocument;
