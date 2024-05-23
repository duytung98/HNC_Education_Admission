import classnames from 'classnames/bind';
import styles from './Footer.module.scss';

const cx = classnames.bind(styles);

function Footer() {
    return (
        <footer className={cx('footer')}>
            <div className={cx('footer-group')}>
                <h2 className={cx('footer-brand')}>Trường Cao đẳng Hà Nội</h2>
                <p className={cx('footer-developer')}>©{new Date().getFullYear()} Developed by HPC - v1.0</p>
            </div>
        </footer>
    );
}

export default Footer;