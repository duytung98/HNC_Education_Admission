import { forwardRef } from 'react';
import classNames from 'classnames/bind';
import propTypes from 'prop-types'
import styles from './Image.module.scss';

const cx = classNames.bind(styles);
const Image = forwardRef((
    { src, alt, className, ...props }, ref) => {

    return (
        <img
            className={cx('wrapper', className)}
            ref={ref}
            src={src}
            alt={alt}
            {...props}
        />
    );
});

Image.propTypes = {
    src: propTypes.string.isRequired,
    alt: propTypes.string.isRequired,
}

export default Image;