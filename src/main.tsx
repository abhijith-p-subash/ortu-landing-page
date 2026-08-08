import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { resolveRoute } from './routes';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element #root not found');
}

// Each route is prerendered to its own HTML file, so the client has to pick the
// same component the server rendered — otherwise hydration mismatches and React
// throws the markup away. Falling back to App keeps an unknown path renderable.
const route = resolveRoute(window.location.pathname);
const tree = <React.StrictMode>{route ? route.element : <App />}</React.StrictMode>;

if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
