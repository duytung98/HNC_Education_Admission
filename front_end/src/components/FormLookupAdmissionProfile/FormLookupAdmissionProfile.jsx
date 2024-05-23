import classnames from 'classnames/bind';
import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Image, NoImage } from '~/components';
import { XSquareCloseIcon } from '~/components/Icon';
import styles from './FormLookupAdmissionProfile.module.scss';
import {
    getDetailProfileClientService, getCityListService, getCommunelistService,
    getDistrictListService, getCityListOfSchoolService,
    getDistrictListOfSchoolService, getMajorListService
} from '~/services';
import { formatDate } from '~/utils'
const cx = classnames.bind(styles);

function FormLookupAdmissionProfile() {

    const navigate = useNavigate();
    // Lấy giá trị của tham số MaHoSo từ Url 
    const { maHoSo } = useParams();
    const [data, setData] = useState({});
    const [tenTinh, setTenTinh] = useState('Trống');
    const [tenHuyen, setTenHuyen] = useState('Trống');
    const [tenTinhTHPT, setTenTinhTHPT] = useState('Trống');
    const [tenHuyenTHPT, setTenHuyenTHPT] = useState('Trống');
    const [tenXa, setTenXa] = useState('Trống');
    const [tenNganh, setTenNganh] = useState('trông');

    const [modalImgSrc, setModalImgSrc] = useState(null);
    const modalContainerRef = useRef(null);

    const openModal = (imgSrc) => {
        setModalImgSrc(imgSrc);
    };

    const closeModal = () => {
        setModalImgSrc(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!maHoSo) return;
            try {
                const res = await getDetailProfileClientService(maHoSo);
                if (res?.message === 'Không tìm thấy hồ sơ') return navigate('/404-NotFound');

                if (res.data) {
                    setData({
                        ...data,
                        HoDem: res.data.HoDem,
                        Ten: res.data.Ten,
                        NgayThangNamSinh: res.data.NgayThangNamSinh,
                        GioiTinh: res.data.GioiTinh,
                        CCCD: res.data.CCCD,
                        DanToc: res.data.DanToc,
                        DiaChi: res.data.DiaChi,
                        DoiTuongUT: res.data.DoiTuongUT ? res.data.DoiTuongUT : 'Không thuộc diện ưu tiên',
                        Email: res.data.Email,
                        KhuVucUT: res.data.KhuVucUT,
                        MaPhuongXa: res.data.MaPhuongXa,
                        MaQuanHuyen: res.data.MaQuanHuyen,
                        MaTinh: res.data.MaTinh,
                        MaTinhTruong: res.data.MaTinhTruong,
                        NamTotNghiep: res.data.NamTotNghiep,
                        Nganh_ID: res.data.Nganh_ID,
                        SDT: res.data.SDT,
                        TenTruong: res.data.TenTruong,
                        MaQuanHuyenTruong: res.data.MaQuanHuyenTruong,
                        DiemTB10: res.data.xet_tuyen.DiemTB10,
                        DiemTB11: res.data.xet_tuyen.DiemTB11,
                        DiemHKI12: res.data.xet_tuyen.DiemHKI12,
                        HinhThuc: res.data.xet_tuyen.HinhThuc,
                        BangKQ12: res.data.minh_chung.BangKQ12,
                        ChungNhanTN: res.data.minh_chung.ChungNhanTN,
                        ChungNhanUT: res.data.minh_chung.ChungNhanUT,
                        HocBaBia: res.data.minh_chung.HocBaBia
                    });
                }

            } catch (error) {
                navigate('/500-ServerError');
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maHoSo]);

    // call api lấy tên ngành 
    useEffect(() => {
        const getMajorLis = async () => {
            try {
                const apiNganh = await getMajorListService() || [];
                apiNganh.forEach((major) => {
                    if (major.id === data?.Nganh_ID) {
                        setTenNganh(major.TenNganh);
                        return;
                    }
                })
            } catch (error) {
                navigate('/500-ServerError');
            }
        };
        getMajorLis();

    }, [maHoSo, data?.Nganh_ID, navigate]);

    // Call api lấy thông tin tỉnh trong hộ khẩu thường trú;
    useEffect(() => {
        const getInforTinh = async () => {
            try {
                const list = await getCityListService() || [];
                list.forEach((city) => {
                    if (city.ma === data?.MaTinh) {
                        setTenTinh(city.tenDonVi);
                        return;
                    }
                })
            }
            catch (e) {
                navigate('/500-ServerError');
            }
        }
        getInforTinh();
    }, [maHoSo, data?.MaTinh, navigate])

    // Call api lấy thông tin Huyện trong hộ khẩu thường trú;
    useEffect(() => {
        const getInforHuyen = async () => {
            try {
                const list = await getDistrictListService(data?.MaTinh) || [];
                let check = false;
                list.forEach((district) => {
                    if (district.ma === data?.MaQuanHuyen) {
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
    }, [maHoSo, data?.MaQuanHuyen, data?.MaTinh, navigate])

    // Call api lấy thông tin xã trong hộ khẩu thường trú
    useEffect(() => {
        const getInforXa = async () => {
            try {
                const list = await getCommunelistService(data?.MaQuanHuyen) || [];
                let check = false;
                list.forEach((commune) => {
                    if (commune.ma === data?.MaPhuongXa) {
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
    }, [maHoSo, data?.MaPhuongXa, data?.MaQuanHuyen, navigate])

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
        getInforTinhTHPT(data?.MaTinhTruong);
    }, [data?.MaTinhTruong, navigate])

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
        getInforHuyenTHPT(data?.MaTinhTruong, data?.MaQuanHuyenTruong);
    }, [data?.MaTinhTruong, data?.MaQuanHuyenTruong, navigate])

    return (
        <div className={cx('detail-admission')}>
            <div className={cx('title')}>
                <h4 className={cx('title-text', 'uppercase text-center py-5')}>Thông tin thí sinh</h4>
                <span
                    className={cx('close')}
                    onClick={() => {
                        navigate('/');
                    }}
                >
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
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Họ đệm
                                    </label>
                                    <p className={cx('content-item-input')}>{data.HoDem}</p>
                                    <p className={cx('message')}> </p>
                                </div>
                                <div className={cx('content-infor', 'content-lastName')}>
                                    <label className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Tên
                                    </label>
                                    <p className={cx('content-item-input')}>{data.Ten}</p>

                                    <p className={cx('message')}> </p>
                                </div>
                            </div>
                            <div className={cx('content-infor', 'content-birthday')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Ngày sinh
                                </label>
                                <p className={cx('content-item-input')}>{formatDate(data?.NgayThangNamSinh)}</p>
                                <p className={cx('message')}> </p>
                            </div>
                            <div className={cx('content-gioiTinhAndDanToc')}>
                                <div className={cx('content-infor', 'content-grender')}>
                                    <label className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Giới tính
                                    </label>
                                    <p className={cx('content-item-input')}>{data.GioiTinh}</p>
                                    <p className={cx('message')}> </p>
                                </div>
                                <div className={cx('content-infor', 'content-dantoc')}>
                                    <label className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Dân tộc
                                    </label>
                                    <p className={cx('content-item-input')}>{data.DanToc}</p>
                                    <p className={cx('message')}> </p>
                                </div>
                            </div>
                            <div className={cx('content-infor', 'content-CCCD')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Nhập vào CMND/CCCD
                                </label>
                                <p className={cx('content-item-input')}>{data.CCCD}</p>
                                <p className={cx('message')}> </p>
                            </div>
                            <div className={cx('content-infor', 'content-email')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Email
                                </label>
                                <p className={cx('content-item-input')}>{data.Email}</p>
                                <p className={cx('message')}> </p>
                            </div>
                            <div className={cx('content-infor', 'content-phone')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Số điện thoại
                                </label>
                                <p className={cx('content-item-input')}>{data.SDT}</p>
                                <p className={cx('message')}> </p>
                            </div>
                        </div>
                        <div className={cx('content-container-item', 'content-full', 'mt-6')}>
                            <div className={cx('content-infor', 'content-hometown')}>
                                <label htmlFor="Tinh" className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
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
                                    <p className={cx('content-item-input')}>{data.DiaChi}i</p>
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
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Thành phố / Tỉnh
                                </label>
                                <p className={cx('content-item-input')}>{tenTinhTHPT}</p>
                                <p className={cx('message')}> </p>
                            </div>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Quận / Huyện
                                </label>
                                <p className={cx('content-item-input')}>{tenHuyenTHPT}</p>
                                <p className={cx('message')}></p>
                            </div>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Trường THPT
                                </label>
                                <p className={cx('content-item-input')}>{data.TenTruong}</p>
                                <p className={cx('message')}> </p>
                            </div>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}> </span>
                                    Đối tượng ưu tiên
                                </label>
                                <p className={cx('content-item-input')}>{data.DoiTuongUT}</p>
                                <p className={cx('message')}></p>
                            </div>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Khu vực ưu tiên
                                </label>
                                <p className={cx('content-item-input')}>{data.KhuVucUT}</p>
                                <p className={cx('message')}></p>
                            </div>
                            <div className={cx('content-infor')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Năm tốt nghiệp
                                </label>
                                <p className={cx('content-item-input')}>{data.NamTotNghiep}</p>
                                <p className={cx('message')}></p>
                            </div>
                        </div>
                        <div className={cx('content-container-item', 'content-full', 'mt-6')}>
                            <div className={cx('content-infor', 'content-hinhthuc')}>
                                <label className={cx('content-item-label')}>
                                    <span className={cx('text-red-600 mr-1')}>*</span>
                                    Phương án xét tuyển
                                </label>
                                <div className={cx('content-infor', 'content--address', 'mt-6')}>
                                    <p className={cx('content-item-input')}>{data.HinhThuc}</p>
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
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Điểm TB lớp 10:
                                        </label>
                                        <p className={cx('content-item-input')}>{data.DiemTB10}</p>
                                    </div>
                                    <p className={cx('message')}></p>
                                </div>
                                <div className={cx('content-infor', 'content-scores-item')}>
                                    <div className={cx('content-infor-group')}>
                                        <label className={cx('content-item-label')}>
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Điểm TB lớp 11:
                                        </label>
                                        <p className={cx('content-item-input')}>{data.DiemTB11}</p>
                                    </div>
                                    <p className={cx('message')}></p>
                                </div>
                                <div className={cx('content-infor', 'content-scores-item')}>
                                    <div className={cx('content-infor-group')}>
                                        <label htmlFor="DiemMon3" className={cx('content-item-label')}>
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Điểm TB HKI lớp 12:
                                        </label>
                                        <p className={cx('content-item-input')}>{data.DiemHKI12}</p>
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
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Ngành xét tuyển
                                    </label>
                                    <p className={cx('content-item-input')}>{tenNganh}</p>
                                </div>
                                <p className={cx('message')}></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('content-item')}>
                    <div className={cx('content-item-title', 'flex items-center')}>
                        <span className={cx('flex-1')}></span>
                        <h4 className={cx('content-item-text', 'mx-2 uppercase')}>Danh sách minh chứng kèm theo</h4>
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
                                            {data?.BangKQ12?.length > 0 ?
                                                data?.BangKQ12?.map((img, index) => {
                                                    return (
                                                        <Image src={img}
                                                            className={cx('content-images-item')}
                                                            alt={'img-1' + index}
                                                            key={index}
                                                            onClick={() => openModal(img)}
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
                                            {data?.HocBaBia ?
                                                <Image src={data?.HocBaBia}
                                                    className={cx('content-images-item')}
                                                    alt={'img-1'}
                                                    onClick={() => openModal(data?.HocBaBia)}
                                                />
                                                :
                                                <NoImage classNane={cx('content-images-item', 'empty')} />
                                            }
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={cx('content-images-col-1')}>3</td>
                                    <td className={cx('content-images-col-2', 'text-left px-3', 'empty')}>
                                        Ảnh chụp bằng tốt nghiệp
                                    </td>
                                    <td>
                                        <div className={cx('content-images-group')}>
                                            {data?.ChungNhanTN ?
                                                <Image src={data?.ChungNhanTN}
                                                    className={cx('content-images-item')}
                                                    alt={'img-1'}
                                                    onClick={() => openModal(data?.ChungNhanTN)}
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
                                            {data?.ChungNhanUT ?
                                                <Image src={data?.ChungNhanUT}
                                                    className={cx('content-images-item')}
                                                    alt={'img-1'}
                                                    onClick={() => openModal(data?.ChungNhanUT)}
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
                <div className={cx('content-container', 'content-group-button')}>
                    <Button
                        className={cx('btn-item', 'btn-undo')}
                        outline
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate('/');
                        }}
                    >
                        Quay lại
                    </Button>
                </div>
            </main>

            {
                modalImgSrc && (
                    <div ref={modalContainerRef} className={cx('modal')}>
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
}

export default FormLookupAdmissionProfile;
