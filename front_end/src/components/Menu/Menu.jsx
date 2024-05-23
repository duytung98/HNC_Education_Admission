import classnames from 'classnames/bind';
import Proptypes from 'prop-types';

import MenuItem from './MenuItem';
import styles from './Menu.module.scss';
const cx = classnames.bind(styles);

function Menu({ className, data, link = false, ...props }) {
    return (
        <ul className={cx(className, 'menu')} {...props}>
            {
                data.length > 0 && data.map((item, index) => {
                    return <MenuItem link={link} key={index} data={item?.children?.data}
                        {...item}
                    />
                })
            }
        </ul>
    );
}

Menu.propTypes = {
    clasName: Proptypes.string,
    data: Proptypes.array.isRequired
}
export default Menu;