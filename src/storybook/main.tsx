import React from 'react';
import ReactDOM from 'react-dom/client';
import '../style.css';
import './storybook.css';
import Storybook from './Storybook';
import { seedDemoState } from './fixtures';

// One saved race and one favourite, so both sides of every toggle are on show.
// The page runs with persistence off, so none of this reaches real saved data.
seedDemoState();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Storybook />
  </React.StrictMode>
);
