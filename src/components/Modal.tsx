import React, { useEffect } from 'react';

/**
 * The shell every overlay in the app shares: dimmed backdrop, centred panel, and a
 * header with a title and a round close button. Closing works the same way
 * everywhere - the close button, a click on the backdrop, or Escape - and the page
 * behind stays put while the modal is up.
 */

export type ModalSize = 'sm' | 'md' | 'lg';

interface ModalProps {
  title: string;
  onClose: () => void;
  /** sm 420px (help), md 540px (shared lists), lg 640px (garage, settings). */
  size?: ModalSize;
  /** Extra class on the panel, for per-modal layout tweaks. */
  className?: string;
  /** Sits directly under the header, outside the scrolling body - tabs, toolbars. */
  chrome?: React.ReactNode;
  footer?: React.ReactNode;
  /** Body padding is dropped for edge-to-edge lists. */
  flushBody?: boolean;
  children: React.ReactNode;
}

export default function Modal({
  title, onClose, size = 'md', className, chrome, footer, flushBody, children,
}: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="presentation">
      <div className={'modal modal--' + size + (className ? ' ' + className : '')} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose} title="Close" aria-label="Close">&#x2715;</button>
        </div>
        {chrome}
        <div className={'modal-body' + (flushBody ? ' modal-body--flush' : '')}>
          {children}
        </div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
