import classNames from 'classnames/bind';
import propTypes from 'prop-types'
import images from '~/assets/images';
import styles from './Image.module.scss';

const cx = classNames.bind(styles);

const NoImage = ({ classNane }) => {
    return (
        <img
            className={cx('wrapper', classNane)}
            src={images.noImage}
            alt={'Ảnh lỗi'}
        />
    );
};

NoImage.propTypes = {
    classNames: propTypes.string
}

export default NoImage;