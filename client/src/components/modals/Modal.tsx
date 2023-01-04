import React, { ReactNode } from 'react';
import styles from './Modal.module.css';
import ReactDOM from 'react-dom';
import { AiOutlineClose } from 'react-icons/ai';

interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
}

export default function Modal(props: ModalType) {
  return (
    <>
      {props.isOpen &&
        ReactDOM.createPortal(
          <>
            <div className={styles.modal_overlay} onClick={props.toggle}>
              <div
                className={styles.modal_box}
                onClick={(e) => e.stopPropagation()}
              >
                <button className={styles.closeButton} onClick={props.toggle}>
                  <AiOutlineClose size={30} />
                </button>

                {props.children}
              </div>
            </div>
          </>,
          document.getElementById('overlay-root') as HTMLElement
        )}
    </>
  );
}
