import React from 'react';
import useStore from '../store/useStore.js';

export default function Toast() {
  const toastMessage = useStore(s => s.toastMessage);
  return (
    <div className={'toast' + (toastMessage ? ' toast-visible' : '')}>
      {toastMessage}
    </div>
  );
}
