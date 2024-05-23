import classnames from 'classnames/bind';
import Proptypes from 'prop-types';

import Menu from './Menu';
import { Button } from '../Button';
import { covertStringToArray } from '~/utils';
import styles from './Menu.module.scss';

const cx = classnames.bind(styles);

function MenuItem(
    { className, link = false, to, title, href, iconLeft = null, iconRight = null, data, ...props }
) {

    //Với menu-item là link thì ta cần active state khi user click;
    let paths = covertStringToArray(window.location.pathname, '/');
    let path = '/' + paths[(paths.length - 1)];

    return (
        <li className={cx('menu-item')}>
            <Button className={className}
                primary={link && to === path}
                to={to}
                href={href}
                text iconLeft={iconLeft} iconRight={iconRight}
                {...props}
            >
                {title}
            </Button>
            {/* Nếu Menu-item có menu children thì render ra UI */}
            {
                data && data.length > 0 &&
                <div className={cx('menu-c2')}>
                    <Menu data={data} className={cx('menu-c2-list')} />
                </div>
            }
        </li>
    );
}

MenuItem.propTypes = {
    title: Proptypes.string.isRequired,
    className: Proptypes.string,
    to: Proptypes.string,
    href: Proptypes.string,
    iconLeft: Proptypes.node,
    iconRight: Proptypes.node,
    data: Proptypes.array
}
export default MenuItem;