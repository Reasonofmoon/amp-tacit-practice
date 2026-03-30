import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function setBackgroundInteractivity(root, disabled) {
  if (!(root instanceof HTMLElement)) {
    return () => {};
  }

  const supportsInert = 'inert' in root;

  if (disabled) {
    root.setAttribute('aria-hidden', 'true');
    if (supportsInert) {
      root.setAttribute('inert', '');
    } else {
      root.dataset.modalInertFallback = 'true';
    }
  } else {
    root.removeAttribute('aria-hidden');
    root.removeAttribute('inert');
    delete root.dataset.modalInertFallback;
  }

  return () => {
    root.removeAttribute('aria-hidden');
    root.removeAttribute('inert');
    delete root.dataset.modalInertFallback;
  };
}

export default function ModalOverlay({
  open,
  onClose,
  appRootRef,
  ariaLabel,
  closeOnBackdrop = true,
  panelClassName = '',
  panelStyle,
  backdropClassName = '',
  backdropStyle,
  children,
}) {
  const panelRef = useRef(null);
  const lastFocusedElementRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    lastFocusedElementRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const restoreBackground = setBackgroundInteractivity(appRootRef?.current, true);

    const panel = panelRef.current;
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const focusFirstElement = () => {
      const focusableElements = panel?.querySelectorAll(focusableSelectors);
      const firstElement = focusableElements?.[0];
      if (firstElement instanceof HTMLElement) {
        firstElement.focus();
      } else if (panel instanceof HTMLElement) {
        panel.focus();
      }
    };

    focusFirstElement();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab' || !panel) {
        return;
      }

      const focusableElements = Array.from(panel.querySelectorAll(focusableSelectors))
        .filter((element) => element instanceof HTMLElement && !element.hasAttribute('disabled'));

      if (focusableElements.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      restoreBackground();
      if (lastFocusedElementRef.current instanceof HTMLElement) {
        lastFocusedElementRef.current.focus();
      }
    };
  }, [open, onClose, appRootRef]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          className={`modal-backdrop ${backdropClassName}`.trim()}
          style={backdropStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={closeOnBackdrop ? onClose : undefined}
        >
          <motion.div
            ref={panelRef}
            className={`modal-panel card ${panelClassName}`.trim()}
            style={panelStyle}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
