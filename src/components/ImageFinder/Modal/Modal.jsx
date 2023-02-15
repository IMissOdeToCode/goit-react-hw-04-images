import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import css from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ close, children }) => {
  useEffect(() => {
    const closeWithButton = ({ code }) => {
      if (code === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', closeWithButton);

    return () => document.removeEventListener('keydown', closeWithButton);
  }, [close]);

  const closeModal = ({ target, currentTarget }) => {
    if (target === currentTarget) {
      close();
    }
  };

  return createPortal(
    <div className={css.Overlay} onClick={closeModal}>
      <div className={css.Modal}>{children}</div>
    </div>,
    modalRoot
  );
};

export default Modal;

Modal.propTypes = {
  close: PropTypes.func.isRequired,
  children: PropTypes.node,
};
