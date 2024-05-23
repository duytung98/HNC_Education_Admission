import classnames from 'classnames/bind';
import styles from './NotFoundPage.module.scss';
const cx = classnames.bind(styles);

function NotFoundPage() {
    return (
        <div className={cx('container')}>
            <h1 className={cx('container-title')}>404</h1>
            <p className={cx('container-message')}>Oops! Không tìm thấy trang web bạn yêu cầu.</p>
            <a href='https://caodanghanoi.edu.vn' className={cx('container-link')}>Go back home</a>
        </div>
    );
}

export default NotFoundPage;