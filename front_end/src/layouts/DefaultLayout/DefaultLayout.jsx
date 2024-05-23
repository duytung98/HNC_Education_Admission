import classnames from 'classnames/bind';
import Proptypes from 'prop-types';
import { Header } from '../Header';
import { Footer } from '../Footer';
import styles from './DefaultLayout.module.scss';

const cx = classnames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <main className={cx('content')}>
                {children}
            </main>
            <Footer />
        </div>
    );
}

DefaultLayout.prototype = {
    children: Proptypes.element
}

export default DefaultLayout;