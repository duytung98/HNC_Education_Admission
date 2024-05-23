import classnames from 'classnames/bind';
import Proptypes from 'prop-types';
import styles from './Loading.module.scss';
const cx = classnames.bind(styles);

function LoadingCricle({ loading = false, className, message = 'Hệ thống đang xử lý ...' }) {
    return (
        <div className={cx(className, 'loading', {
            'active': loading
        })}
        >
            <div className={cx('loading-container', 'flex items-center justify-center flex-col')}>
                <div className={cx('loading-cricle')}></div>
                <h4 className={cx('message')}>{message}</h4>
            </div>
        </div>
    );
}

LoadingCricle.propTypes = {
    loading: Proptypes.bool.isRequired,
    classname: Proptypes.string
}
export default LoadingCricle;