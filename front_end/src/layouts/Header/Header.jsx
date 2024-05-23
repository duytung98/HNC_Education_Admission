import classnames from 'classnames/bind';
import styles from './Header.module.scss';
import images from '~/assets/images';
import { Navbar } from '../Navbar';

const cx = classnames.bind(styles);
function Header() {
    return (
        <header className={cx('header')}>
            <div className={cx('header-top', 'flex justify-center py-4')}>
                <div className={cx('header-logo', 'flex items-center')}>
                    <a href="https://caodanghanoi.edu.vn/">
                        <img src={images.logo} alt="" className={cx('header-logo-image')} />
                    </a>
                    <div
                        className={cx('header-logo-brand', 'font-bold uppercase ml-10 text-center')}
                    >
                        <h3>Bộ lao động thương binh và xã hội</h3>
                        <h3>Trường Cao đẳng Hà Nội</h3>
                    </div>
                </div>
            </div>
            <div className={cx('header-bottom')}>
                <Navbar />
            </div>
        </header>
    );
}

export default Header;