import React from 'react';
import styles from './ToastMessger.module.scss';
import { AlertCircle, Close } from '../Icon';

function ToastMessger({ show, onClose }) {
    if (!show) return null;

    const handleClick = (e) => {
        if (e.target.id === 'showtoast') return onClose();
    };
    return (
        <div
            className={`${styles.toast} ${styles.toast__yellow} ${styles.addMargin}`}
            id="showtoast"
            onClick={handleClick}
        >
            <div className={styles.toast__icon}>
                <AlertCircle className={styles.toast__svg} />
            </div>
            <div className={styles.toast__content}>
                <p className={styles.toast__type}>Không tìm thấy thông tin</p>
                <p className={styles.toast__message}>
                    Vui lòng kiểm tra lại thông tin số điện thoại, email, CCCD/CMND!
                </p>
            </div>
            <div className={styles.toast__close} onClick={() => onClose()}>
                <Close />
            </div>
        </div>
    );
}

export default ToastMessger;
