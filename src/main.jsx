import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './sass/style.scss';

const tree = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const root = document.getElementById('root');
const hasMarkup = [...root.childNodes].some((node) => node.nodeType === Node.ELEMENT_NODE);

if (hasMarkup) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
