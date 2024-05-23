import { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './ModalAlert.module.scss';
import { Button } from '~/components';

const cx = classNames.bind(styles);

const ModalAlert = ({ message = '', enabled = false, onClose, onAccepted }) => {

    const handleCancel = () => {
        onClose();
    }

    const handleAccepted = () => {
        onAccepted();
    }

    return (
        <div className={cx('wrapper', {
            enabled: enabled
        })}
        >
            <div className={cx('container', 'rounded-lg')}>
                <h2 className={cx('header',
                    'text-center text-red-600 text-2xl font-medium py-2 uppercase'
                )}
                >
                    Thông báo
                </h2>
                <p className={cx('text-center')}>{message}</p>
                <div className={cx('group', 'flex justify-center py-4')}>
                    <Button outline
                        onClick={handleCancel}
                    >
                        Không
                    </Button>
                    <Button
                        primary
                        onClick={handleAccepted}
                    >
                        Có
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default memo(ModalAlert);