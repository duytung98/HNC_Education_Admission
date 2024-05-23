import classnames from 'classnames/bind';
import { memo, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, Image, NoImage } from '~/components';
import { loginSuccess, userSelector } from '~/store';
import {
    detailAdmissionService, getCityListService,
    getDistrictListService, getCommunelistService,
    getCityListOfSchoolService, getDistrictListOfSchoolService,
}
    from '~/services';
import { covertStringToArray, createAxios, formatDate } from '~/utils';
import { XSquareCloseIcon, ToolIcon } from '~/components/Icon';
import styles from './FormDetailAdmissionProfile.module.scss';


const cx = classnames.bind(styles);

const FormDetailAdmissionProfile = ({ maHS, onClose, onShowEdit, handleUpdateStatusAdmission }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let paths = covertStringToArray(window.location.pathname, '/');
    let path = '/' + paths[paths.length - 1];
    const [inforProfile, setInforProfile] = useState(null);

    const [tenTinh, setTenTinh] = useState('Trống');
    const [tenHuyen, setTenHuyen] = useState('Trống');
    const [tenTinhTHPT, setTenTinhTHPT] = useState('Trống');
    const [tenHuyenTHPT, setTenHuyenTHPT] = useState('Trống');
    const [tenXa, setTenXa] = useState('Trống');

    const DiemTB10 = +inforProfile?.xet_tuyen?.DiemTB10 || 0.0;
    const DiemTB11 = +inforProfile?.xet_tuyen?.DiemTB11 || 0.0;
    const DiemHKI12 = +inforProfile?.xet_tuyen?.DiemHKI12 || 0.0;

    const user = useSelector(userSelector);
    const requestJWT = createAxios(user, dispatch, loginSuccess);

    const [modalImgSrc, setModalImgSrc] = useState(null);
    const modalContainerRef = useRef(null);

    const openModal = (imgSrc) => {
        setModalImgSrc(imgSrc);
    };

    const closeModal = () => {
        setModalImgSrc(null);
    };


    //Call api để lấy thông tin chi tiết của hồ sơ
    useEffect(() => {
        if (!maHS) return;
        try {
            const getInforDetail = async () => {
                const inforDetail = await detailAdmissionService(maHS, user?.access_token, requestJWT);
                if (inforDetail) {
                    setInforProfile(inforDetail);
                }
            }
            getInforDetail();
        } catch (e) {
            navigate('/500-ServerError');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maHS]);

    // Call api lấy thông tin tỉnh trong hộ khẩu thường trú;
    useEffect(() => {
        try {
            const getInforTinh = async () => {
                const list = await getCityListService() || [];
                list.forEach((city) => {
                    if (city.ma === inforProfile?.MaTinh) {
                        setTenTinh(city.tenDonVi);
                        return;
                    }
                })
            }
            getInforTinh();
        } catch (e) {
            navigate('/500-ServerError');
        }
    }, [maHS, inforProfile?.MaTinh, navigate])

    // Call api lấy thông tin Huyện trong hộ khẩu thường trú;
    useEffect(() => {
        const getInforHuyen = async () => {
            try {
                const list = await getDistrictListService(inforProfile?.MaTinh) || [];
                let check = false;
                list.forEach((district) => {
                    if (district.ma === inforProfile?.MaQuanHuyen) {
                        check = true;
                        setTenHuyen(district.tenDonVi);
                        return;
                    }
                })
                if (!check) setTenHuyen('Trống');
            } catch (e) {
                navigate('/500-ServerError');
            }
        }
        getInforHuyen();
    }, [maHS, inforProfile?.MaQuanHuyen, inforProfile?.MaTinh, navigate])


    // Call api lấy thông tin xã trong hộ khẩu thường trú
    useEffect(() => {
        const getInforXa = async () => {
            try {
                const list = await getCommunelistService(inforProfile?.MaQuanHuyen) || [];
                let check = false;
                list.forEach((commune) => {
                    if (commune.ma === inforProfile?.MaPhuongXa) {
                        check = true;
                        setTenXa(commune.tenDonVi);
                        return;
                    }
                })
                if (!check) setTenXa('Trống');
            } catch (e) {
                navigate('/500-ServerError');
            }
        }
        getInforXa();
    }, [maHS, inforProfile?.MaPhuongXa, inforProfile?.MaQuanHuyen, navigate])

    // Call api lấy thông tinh tỉnh của trường THPT mà học sinh học.
    useEffect(() => {
        const getInforTinhTHPT = async (maTinh) => {
            try {
                const list = await getCityListOfSchoolService() || [];
                let check = false;
                list.forEach((city) => {
                    if (city.maTinh === maTinh) {
                        check = true;
                        setTenTinhTHPT(city.tenTinhTP);
                        return;
                    }
                })
                if (!check) setTenTinhTHPT('Trống');
            } catch (e) {
                navigate('/500-ServerError');
            }
        }
        getInforTinhTHPT(inforProfile?.MaTinhTruong);
    }, [inforProfile?.MaTinhTruong, navigate])

    // Call api lấy thông tinh tỉnh của trường THPT mà học sinh học.
    useEffect(() => {
        const getInforHuyenTHPT = async (maTinh, maHuyen) => {
            try {
                const list = await getDistrictListOfSchoolService(maTinh) || [];
                let check = false;
                list.forEach((district) => {
                    if (district.maQH === maHuyen) {
                        check = true;
                        setTenHuyenTHPT(district.tenQH);
                        return;
                    }
                })
                if (!check) setTenHuyenTHPT('Trống');
            } catch (e) {
                navigate('/500-ServerError');
            }
        }
        getInforHuyenTHPT(inforProfile?.MaTinhTruong, inforProfile?.MaQuanHuyenTruong);
    }, [inforProfile?.MaTinhTruong, inforProfile?.MaQuanHuyenTruong, navigate])

    const handleCloseForm = () => {
        onClose();
    };

    const handleShowFormEditInfor = (e) => {
        e.preventDefault();
        onShowEdit(maHS);
        handleCloseForm();
    };

    return (
        <div className={cx('detail-admission')}>
            <div className={cx('title')}>
                <h4 className={cx('title-text', 'uppercase text-center py-5')}>Thông tin thí sinh</h4>
                <span className={cx('close')} onClick={handleCloseForm}>
                    <XSquareCloseIcon />
                </span>
            </div>
            <main className={cx('content')}>
                <div className={cx('content-item')}>
                    <div className={cx('content-container', 'container')}>
                        <div className={cx('content-container-item')}>
                            <div className={cx('content-name')}>
                                <div className={cx('content-infor', 'content-firstName')}>
                                    <label className={cx('content-item-label')}>
                                        Họ đệm
                                    </label>
                                    <p className={cx('content-item-input')}>{inforProfile?.HoDem}</p>
                                    <p className={cx('message')}> </p>
                                </div>
                                <div className={cx('content-infor', 'content-lastName')}>
                                    <label className={cx('content-item-label')}>
                                        Tên
                                    </label>
                                    <p className={cx('content-item-input')}>{inforProfile?.Ten}</p>

                                    <p className={cx('message')}> </p>
                                </div>
                            </div>
                            <div className={cx('content-infor', 'content-birthday')}>
                                <label className={cx('content-item-label')}>
                                    Ngày sinh
                                </label>
                                <p className={cx('content-item-input')}>
                                    {formatDate(inforProfile?.NgayThangNamSinh)}
                                </p>
                                <p className={cx('message')}> </p>
                            </div>
                            <div className={cx('content-gioiTinhAndDanToc')}>
                                <div className={cx('content-infor', 'content-grender')}>
                                    <label className={cx('content-item-label')}>
                                        Giới tính
                                    </label>
                                    <p className={cx('content-item-input')}>{inforProfile?.GioiTinh}</p>
                                    <p className={cx('message')}> </p>
                                </div>
                                <div className={cx('content-infor', 'content-dantoc')}>
                                    <label className={cx('content-item-label')}>
                                        Dân tộc
                                    </label>
                                    <p className={cx('content-item-input')}>{inforProfile?.DanToc}</p>
                                    <p className={cx('message')}> </p>
                                </div>
                            </div>
                            <div className={cx('content-infor', 'content-CCCD')}>
                                <label className={cx('content-item-label')}>
                                    CMND/CCCD
                                </label>
                                <p className={cx('content-item-input')}>{inforProfile?.CCCD}</p>
                                <p className={cx('message')}> </p>
                            </div>
                            <div className={cx('content-infor', 'content-email')}>
                                <label className={cx('content-item-label')}>
                                    Email:
                                </label>
                                <p className={cx('content-item-input')}>{inforProfile?.Email}</p>
                                <p className={cx('message')}> </p>
                            </div>
                            <div className={cx('content-infor', 'content-phone')}>
                                <label className={cx('content-item-label')}>
                                    Số điện thoại
                                </label>
                                <p className={cx('content-item-input')}>{inforProfile?.SDT}</p>
                                <p className={cx('message')}> </p>
                            </div>
                        </div>
                        <div className={cx('content-container-item', 'content-full', 'mt-6')}>
                            <div className={cx('content-infor', 'content-hometown')}>
                                <label htmlFor="Tinh" className={cx('content-item-label')}>
                                    Hộ khẩu thường trú
                                </label>
                                <div className={cx('content-full-item')}>
                                    <div className={cx('content-howtel-tinh')}>
                                        <p className={cx('content-item-input')}>{tenTinh}</p>
                                        <p className={cx('message')}> </p>
                                    </div>
                                    <div className={cx('content-howtel-huyen')}>
                                        <p className={cx('content-item-input')}>{tenHuyen}</p>
                                        <p className={cx('message')}> </p>
                                    </div>
                                    <div className={cx('content-howtel-xa')}>
                                        <p className={cx('content-item-input')}>{tenXa}</p>
                                        <p className={cx('message')}> </p>
                                    </div>
                                </div>
                                <div className={cx('content-infor', 'content-howtel-address', 'mt-6')}>
                                    <p className={cx('content-item-input')}>
                                        {inforProfile?.DiaChi}
                                    </p>
                                    <p className={cx('message')}> </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('content-item')}>
                    <div className={cx('content-item-title', 'flex items-center')}>
                        <span className={cx('flex-1')}></span>
                        <h4 className={cx('content-item-text', 'ml-2 uppercase')}>Quá trình học tập</h4>
                        <span className={cx('flex-1')}></span>
                    </div>
                    <div className={cx('content-container', 'container')}>
                        <div className={cx('content-container-item')}>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    Thành phố / Tỉnh
                                </label>
                                <p className={cx('content-item-input')}>{tenTinhTHPT}</p>
                                <p className={cx('message')}> </p>
                            </div>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    Quận / Huyện
                                </label>
                                <p className={cx('content-item-input')}>{tenHuyenTHPT}</p>
                                <p className={cx('message')}></p>
                            </div>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    Trường THPT
                                </label>
                                <p className={cx('content-item-input')}>{inforProfile?.TenTruong}</p>
                                <p className={cx('message')}> </p>
                            </div>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}> </span>
                                    Đối tượng ưu tiên
                                </label>
                                <p className={cx('content-item-input')}>
                                    {inforProfile?.DoiTuongUT ? inforProfile?.DoiTuongUT
                                        : 'Không thuộc diện ưu tiên'
                                    }</p>
                                <p className={cx('message')}></p>
                            </div>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    Khu vực ưu tiên
                                </label>
                                <p className={cx('content-item-input')}>{inforProfile?.KhuVucUT}</p>
                                <p className={cx('message')}></p>
                            </div>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    Năm tốt nghiệp
                                </label>
                                <p className={cx('content-item-input')}>
                                    {inforProfile?.NamTotNghiep}
                                </p>
                                <p className={cx('message')}></p>
                            </div>
                        </div>
                        <div className={cx('content-container-item', 'content-full', 'mt-6')}>
                            <div className={cx('content-infor', 'content-hinhthuc')}>
                                <label className={cx('content-item-label')}>
                                    Phương án xét tuyển
                                </label>
                                <div className={cx('content-infor', 'content--address', 'mt-6')}>
                                    <p className={cx('content-item-input')}>
                                        {inforProfile?.xet_tuyen?.HinhThuc}
                                    </p>
                                    <p className={cx('message')}></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('content-item')}>
                    <div className={cx('content-item-title', 'flex items-center')}>
                        <span className={cx('flex-1')}></span>
                        <h4 className={cx('content-item-text', 'ml-2 uppercase')}>Kết quả học tập THPT</h4>
                        <span className={cx('flex-1')}></span>
                    </div>
                    <div className={cx('content-container', 'container')}>
                        <div className={cx('content-container-item', 'content-full')}>
                            <div className={cx('content-scores')}>
                                <div className={cx('content-infor', 'content-scores-item')}>
                                    <div className={cx('content-infor-group')}>
                                        <label className={cx('content-item-label')}>
                                            Điểm TB lớp 10:
                                        </label>
                                        <p className={cx('content-item-input')}>
                                            {DiemTB10.toFixed(2)}
                                        </p>
                                    </div>
                                    <p className={cx('message')}></p>
                                </div>
                                <div className={cx('content-infor', 'content-scores-item')}>
                                    <div className={cx('content-infor-group')}>
                                        <label className={cx('content-item-label')}>
                                            Điểm TB lớp 11:
                                        </label>
                                        <p className={cx('content-item-input')}>
                                            {DiemTB11.toFixed(2)}
                                        </p>
                                    </div>
                                    <p className={cx('message')}></p>
                                </div>
                                <div className={cx('content-infor', 'content-scores-item')}>
                                    <div className={cx('content-infor-group')}>
                                        <label className={cx('content-item-label')}>
                                            Điểm TB HKI lớp 12:
                                        </label>
                                        <p className={cx('content-item-input')}>
                                            {DiemHKI12.toFixed(2)}
                                        </p>
                                    </div>
                                    <p className={cx('message')}></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('content-item')}>
                    <div className={cx('content-item-title', 'flex items-center')}>
                        <span className={cx('flex-1')}></span>
                        <h4 className={cx('content-item-text', 'mx-2 uppercase')}>Ngành xét tuyển</h4>
                        <span className={cx('flex-1')}></span>
                    </div>
                    <div className={cx('content-container', 'container')}>
                        <div className={cx('content-container-item', 'content-full')}>
                            <div className={cx('content-Fieldofstudy')}>
                                <div className={cx('content-infor', 'content-Fieldofstudy-item')}>
                                    <label className={cx('content-item-label')}>
                                        Ngành xét tuyển
                                    </label>
                                    <p className={cx('content-item-input')}>
                                        {inforProfile?.nganh?.TenNganh}
                                    </p>
                                </div>
                                <p className={cx('message')}></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('content-item')}>
                    <div className={cx('content-item-title', 'flex items-center')}>
                        <span className={cx('flex-1')}></span>
                        <h4 className={cx('content-item-text', 'mx-2 uppercase')}>
                            Danh sách minh chứng kèm theo
                        </h4>
                        <span className={cx('flex-1')}></span>
                    </div>
                    <div className={cx('content-container', 'container')}>
                        <table className={cx('content-infor', 'content-images')}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên giấy tờ</th>
                                    <th>File đính kèm</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={cx('content-images-col-1')}>1</td>
                                    <td className={cx('content-images-col-2', 'text-left px-3')}>
                                        Ảnh chụp học bạ trang có điểm tổng kết môn học năm lớp 12
                                    </td>
                                    <td>
                                        <div className={cx('content-images-group')}>

                                            {inforProfile?.minh_chung?.BangKQ12?.length > 0 ?
                                                inforProfile?.minh_chung?.BangKQ12?.map((img, index) => {
                                                    return (
                                                        <Image src={img}
                                                            className={cx('content-images-item')}
                                                            alt={'img-1' + index}
                                                            key={index}
                                                            onClick={() =>
                                                                openModal(img)
                                                            }
                                                        />
                                                    )
                                                }) :
                                                <NoImage classNane={cx('content-images-item', 'empty')} />
                                            }
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={cx('content-images-col-1')}>2</td>
                                    <td className={cx('content-images-col-2', 'text-left px-3')}>
                                        Ảnh chụp bìa học bạ
                                    </td>
                                    <td>
                                        <div className={cx('content-images-group')}>
                                            {inforProfile?.minh_chung?.HocBaBia ?
                                                <Image src={inforProfile?.minh_chung?.HocBaBia}
                                                    className={cx('content-images-item')}
                                                    alt='img-1'
                                                    onClick={() =>
                                                        openModal(inforProfile?.minh_chung?.HocBaBia)
                                                    }
                                                />
                                                :
                                                <NoImage classNane={cx('content-images-item', 'empty')} />
                                            }
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={cx('content-images-col-1')}>3</td>
                                    <td className={cx('content-images-col-2', 'text-left px-3')}>
                                        Ảnh chụp bằng tốt nghiệp
                                    </td>
                                    <td>
                                        <div className={cx('content-images-group')}>
                                            {inforProfile?.minh_chung?.ChungNhanTN ?
                                                <Image src={inforProfile?.minh_chung?.ChungNhanTN}
                                                    className={cx('content-images-item')}
                                                    alt='img-1'
                                                    onClick={() =>
                                                        openModal(inforProfile?.minh_chung?.ChungNhanTN)
                                                    }
                                                />
                                                :
                                                <NoImage classNane={cx('content-images-item', 'empty')} />
                                            }
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={cx('content-images-col-1')}>4</td>
                                    <td className={cx('content-images-col-2', 'text-left px-3')}>
                                        Ảnh chụp giấy chứng nhận ưu tiên (nếu có)
                                    </td>
                                    <td>
                                        <div className={cx('content-images-group')}>
                                            {inforProfile?.minh_chung?.ChungNhanUT ?
                                                <Image src={inforProfile?.minh_chung?.ChungNhanUT}
                                                    className={cx('content-images-item')}
                                                    alt='img-1'
                                                    onClick={() =>
                                                        openModal(inforProfile?.minh_chung?.ChungNhanUT)
                                                    }
                                                />
                                                :
                                                <NoImage classNane={cx('content-images-item', 'empty')} />
                                            }
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div
                    className={cx('content-container', 'content-group-button', {
                        'justify-around': path === '/hosoxettuyen',
                    })}
                >
                    <div
                        className={cx({
                            'flex-1': path === '/hosotrungtuyen',
                        })}
                    >
                        <Button className={cx('btn-item', 'btn-undo')} onClick={handleCloseForm} outline>
                            Quay lại
                        </Button>
                    </div>
                    <Button
                        className={cx('btn-item', 'btn-update')}
                        iconLeft={<ToolIcon width="16" height="16" />}
                        onClick={handleShowFormEditInfor}
                    >
                        Sửa
                    </Button>
                    {path === '/hosoxettuyen' && (
                        <>
                            <Button className={cx('btn-item', 'btn-failed')}
                                onClick={() => {
                                    handleUpdateStatusAdmission(inforProfile, false)
                                }}
                            >
                                Không đạt
                            </Button>
                            <Button className={cx('btn-item', 'btn-success')}
                                onClick={() => {
                                    handleUpdateStatusAdmission(inforProfile, true)
                                }}
                                primary
                            >
                                Đạt
                            </Button>
                        </>
                    )}
                </div>
            </main>
            {
                modalImgSrc && (
                    <div ref={modalContainerRef} className={cx('modal')}
                        onClick={closeModal}
                    >
                        <div className={cx('modal-container')}>
                            <div className={cx('modal-container-img')}>
                                <img className={cx('modal-img')} src={modalImgSrc} alt="img ảnh" />
                            </div>
                            <div className={cx('btn')}>
                                <button className={cx('btn-close')} onClick={closeModal}>
                                    &times;
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default memo(FormDetailAdmissionProfile);
