import classnames from 'classnames/bind';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { createAxios } from '~/utils';
import { Menu, Button, LoadingLine } from '~/components';
import { userSelector, logOutSuccess, loginSuccess } from '~/store';
import {
    HomeIcon, ListIcon, CheckSquareIcon, FileMinusIcon,
    ChevronDownIcon, BarChart2Icon, PieChartIcon, LogOutIcon, BarChartIcon, FormIcon
}
    from '~/components/Icon';
import { logoutService } from '~/services';
import styles from './Navbar.module.scss';
const cx = classnames.bind(styles);

const navbarMenu = {
    data: [
        {
            href: 'https://caodanghanoi.edu.vn/',
            title: 'Trang chủ',
            iconLeft: <HomeIcon />,
            className: cx('navbar-link'),
        },
        {
            to: '/hosoxettuyen',
            title: 'Hồ sơ xét tuyển',
            iconLeft: <FileMinusIcon />,
            className: cx('navbar-link'),
        },
        {
            to: '/hosotrungtuyen',
            title: 'Danh sách trúng tuyển',
            iconLeft: <CheckSquareIcon />,
            className: cx('navbar-link'),
        },
        {
            title: 'Danh mục',
            iconLeft: <ListIcon />,
            className: cx('navbar-link', 'no-state'),
            children: {
                data: [
                    {
                        to: '/baocaotrungtuyen/thang',
                        title: 'Thống kê, báo cáo theo tháng',
                        iconLeft: <BarChart2Icon />,
                        className: cx('navbar-link'),
                    },
                    {
                        to: '/baocaotrungtuyen/nam',
                        title: 'Thống kê, báo cáo theo năm',
                        iconLeft: <PieChartIcon />,
                        className: cx('navbar-link'),
                    },
                    {
                        to: '/baocaotrungtuyen/nganh',
                        title: 'Thống kê theo ngành học',
                        iconLeft: <BarChartIcon />,
                        className: cx('navbar-link'),
                    },
                    {
                        to: '/statistics-by-form',
                        title: 'Biểu mẫu',
                        iconLeft: <FormIcon />,
                        className: cx('navbar-link'),
                    }
                ]
            }
        }
    ]
}


function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const user = useSelector(userSelector);
    const requestJWT = createAxios(user, dispatch, loginSuccess);

    const handleLogout = async () => {
        setLoading(true);
        const res = await logoutService(user?.access_token, requestJWT);
        if (res?.message === 'Đăng xuất thành công') {
            dispatch(logOutSuccess());
            navigate('/canbots-login');
        }
        setLoading(false);
    }

    return (
        <>
            <nav className={cx('navbar', 'flex justify-between')}>
                <Menu className={cx('navbar-list', 'flex gap-1')} data={navbarMenu.data} link />
                <div className={cx('navbar-account')}>
                    {user ?
                        <>
                            <Button className={cx('text-white', 'navbar-account-btn')} to='' iconRight={<ChevronDownIcon />}>
                                {user?.full_name}
                            </Button>
                            <ul className={cx('navbar-account-menu')}>
                                <li>
                                    <Button className={cx('navbar-account-item')} block
                                        onClick={handleLogout}
                                        iconLeft={<LogOutIcon />}
                                    >
                                        Đăng xuất
                                    </Button>
                                </li>
                            </ul>
                        </> :
                        <Button className={cx('navbar-account-item')} to='/canbots-login'>
                            Đăng nhập
                        </Button>
                    }
                </div>
            </nav >
            <LoadingLine loading={loading} />
        </>
    );
}

export default Navbar;