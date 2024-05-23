import classnames from 'classnames/bind';
import Proptypes from 'prop-types';
import styles from './Loading.module.scss';

const cx = classnames.bind(styles);

function LoadingLine({ loading = false, className }) {
    return (
        <div className={cx(className, 'loading', {
            'active': loading
        })}
        >
            <div className={cx('loading-line')}></div>
        </div>
    );
}

LoadingLine.propTypes = {
    loading: Proptypes.bool.isRequired
}



export default LoadingLine;