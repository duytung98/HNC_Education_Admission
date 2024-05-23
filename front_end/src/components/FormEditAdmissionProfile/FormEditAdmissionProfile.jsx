import * as Yup from 'yup';
import classnames from 'classnames/bind';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, memo, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import styles from './FormEditAdmissionProfile.module.scss';
import { createAxios, formatDate, capitalizeTheFirstLetter } from '~/utils';
import { userSelector, loginSuccess } from '~/store';
import {
    Button, Image, ModalAlert, NoImage, ModalAlertOneButton, LoadingCricle
}
    from '~/components';
import { UploadIcon, XSquareCloseIcon } from '~/components/Icon';
import {
    getNationListService, getCityListService, getDistrictListService, getCommunelistService,
    getCityListOfSchoolService, getDistrictListOfSchoolService, getSchoollistService, getMajorListService, detailAdmissionService, updateInforProfileService, convertUrlImgToFileService
} from '~/services';
const cx = classnames.bind(styles);

function FormEditAdmissionProfile({ maHS, onCloseForm }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isChangeBKQ12 = useRef(false);
    const isChangeHocBaBia = useRef(false);
    const isChangeChungNhanTN = useRef(false);
    const isChangeChungNhanUT = useRef(false);

    const formContainerRef = useRef(null);
    const user = useSelector(userSelector);
    const requestJWT = createAxios(user, dispatch, loginSuccess);

    const [loading, setLoading] = useState(false);
    const [exit, setExit] = useState(false);
    const [messResp, setMessResp] = useState('');
    const [errors, setErrors] = useState(null);
    const [responsed, setResponsed] = useState(false);
    const [dataUpdated, setDataUpdated] = useState(null);
    const [majorList, setMajorList] = useState([]);
    const [nationList, setNationList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [citysOfSchool, setCitysOfSchool] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [districtsOfSchool, setDistrictsOfSchool] = useState([]);
    const [communelist, setCommunelist] = useState([]);
    const [schoolList, setSchoolList] = useState([]);
    const [birthday, setBirthday] = useState(null);
    const [TruongTHPT, setTruongTHPT] = useState(null);
    const [BangKQ12, setBangKQ12] = useState([]);
    const [HocBaBia, setHocBaBia] = useState(null);
    const [ChungNhanTN, setChungNhanTN] = useState(null);
    const [ChungNhanUT, setChungNhanUT] = useState(null);

    const [modalImgSrc, setModalImgSrc] = useState(null);
    const modalContainerRef = useRef(null);

    const openModal = (imgSrc) => {
        setModalImgSrc(imgSrc);
    };

    const closeModal = () => {
        setModalImgSrc(null);
    };

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append('_method', 'put');
            Object.keys(values).forEach((key) => {
                formData.append(key, values[key]);
            })

            let date = formatDate(birthday);
            let paths = date.split('/');
            let NgayThangNamSinh = paths[2] + '-' + paths[1] + '-' + paths[0];

            formData.append('TenTruong', TruongTHPT?.tenTruong);
            formData.append('KhuVucUT', TruongTHPT?.khuVucUT);
            formData.append('NgayThangNamSinh', NgayThangNamSinh);

            let HoDem = capitalizeTheFirstLetter(formik.values.HoDem);
            let Ten = capitalizeTheFirstLetter(formik.values.Ten);
            formData.append('HoDem', HoDem);
            formData.append('Ten', Ten);

            if (isChangeBKQ12.current) {
                for (const image of BangKQ12) {
                    const fileImage = await convertUrlImgToFileService(image, 'BangKQ12[]');
                    formData.append("BangKQ12[]", fileImage);
                }
            }

            if (isChangeHocBaBia.current && HocBaBia) {
                const fileImage = await convertUrlImgToFileService(HocBaBia, 'HocBaBia');
                formData.append("HocBaBia", fileImage);
            }
            if (isChangeChungNhanTN.current && ChungNhanTN) {
                const fileImage = await convertUrlImgToFileService(ChungNhanTN, 'ChungNhanTN');
                formData.append("ChungNhanTN", fileImage);
            }
            if (isChangeChungNhanUT.current && ChungNhanUT) {
                const fileImage = await convertUrlImgToFileService(ChungNhanUT, 'ChungNhanUT');
                formData.append("ChungNhanUT", fileImage);
            }

            let HoSoID = formik.values?.id;
            const res = await updateInforProfileService(HoSoID, formData, user?.access_token, requestJWT);

            if (res?.errors) {
                setErrors(res?.errors);
                setMessResp('Cập nhật thất bại, Đã xảy ra lỗi.');
                setResponsed(true);
                return;
            }
            if (res?.success) setDataUpdated(true);

        } catch (e) {
            setMessResp('Cập nhật thất bại, Đã xảy ra lỗi.');
            setResponsed(true);
        }
    }

    const formik = useFormik({
        initialValues: {
            id: null,
            HoDem: '',
            Ten: '',
            CCCD: '',
            Email: '',
            DiaChi: '',
            GioiTinh: '',
            DanToc: '',
            SDT: '',
            MaTinh: '',
            MaQuanHuyen: '',
            MaPhuongXa: '',
            NamTotNghiep: '',
            MaTinhTruong: '',
            MaQuanHuyenTruong: '',
            TenTruong: '',
            DoiTuongUT: '',
            HinhThuc: 'Xét tuyển bằng học bạ THPT',
            Nganh_ID: '',
            DiemTB10: '',
            DiemTB11: '',
            DiemHKI12: '',
            NgayNop: '',
        },
        validationSchema: Yup.object({
            HoDem: Yup.string().required('Vui lòng nhập thông tin!'),
            Ten: Yup.string().required('Vui lòng nhập thông tin!'),
            DiaChi: Yup.string().required('Vui lòng nhập thông tin!'),
            CCCD: Yup.string().required('Vui lòng nhập thông tin!')
                .matches(/^\d{12}$/, 'CCCD không hợp lệ!'),
            MaTinh: Yup.string().required('Vui lòng chọn thông tin!'),
            MaQuanHuyen: Yup.string().required('Vui lòng chọn thông tin!'),
            MaPhuongXa: Yup.string().required('Vui lòng chọn thông tin!'),
            MaTinhTruong: Yup.string().required('Vui lòng chọn thông tin!'),
            MaQuanHuyenTruong: Yup.string().required('Vui lòng chọn thông tin!'),
            Email: Yup.string()
                .required('Vui lòng nhập thông tin!')
                .email('Email không hợp lệ!')
                .max('255', 'Email quá dài!'),
            SDT: Yup.string()
                .required('Vui lòng nhập thông tin!')
                .matches(/^[0][0-9]{9}$/, 'Số điện thoại không hợp lệ!'),
            Nganh_ID: Yup.string().required('Vui lòng chọn thông tin'),
            DiemTB10: Yup.string().required('Vui lòng nhập thông tin'),
            DiemTB11: Yup.string().required('Vui lòng nhập thông tin'),
            DiemHKI12: Yup.string().required('Vui lòng nhập thông tin'),
        }),
        onSubmit: handleSubmit,
    });

    //Call api để lấy thông tin chi tiết của hồ sơ
    useEffect(() => {
        if (!maHS) return;
        const getDetailProfile = async (maHS) => {
            try {
                const inforDetail = await detailAdmissionService(maHS, user?.access_token, requestJWT);
                if (inforDetail) {
                    formik.resetForm({
                        values: {
                            id: inforDetail?.id,
                            HoDem: inforDetail?.HoDem,
                            Ten: inforDetail?.Ten,
                            CCCD: inforDetail?.CCCD,
                            Email: inforDetail?.Email,
                            DiaChi: inforDetail?.DiaChi,
                            GioiTinh: inforDetail?.GioiTinh,
                            DanToc: inforDetail?.DanToc,
                            SDT: inforDetail?.SDT,
                            MaTinh: inforDetail?.MaTinh,
                            MaQuanHuyen: inforDetail?.MaQuanHuyen,
                            MaPhuongXa: inforDetail?.MaPhuongXa,
                            MaTinhTruong: inforDetail?.MaTinhTruong,
                            MaQuanHuyenTruong: inforDetail?.MaQuanHuyenTruong,
                            NamTotNghiep: +inforDetail?.NamTotNghiep,
                            DoiTuongUT: inforDetail?.DoiTuongUT ? inforDetail?.DoiTuongUT : '',
                            HinhThuc: inforDetail?.xet_tuyen?.HinhThuc,
                            Nganh_ID: inforDetail?.Nganh_ID,
                            DiemTB10: (+inforDetail?.xet_tuyen?.DiemTB10).toFixed(2),
                            DiemTB11: (+inforDetail?.xet_tuyen?.DiemTB11).toFixed(2),
                            DiemHKI12: (+inforDetail?.xet_tuyen?.DiemHKI12).toFixed(2),
                        }
                    });
                    setBangKQ12(inforDetail?.minh_chung?.BangKQ12);
                    setHocBaBia(inforDetail?.minh_chung?.HocBaBia);
                    setChungNhanTN(inforDetail?.minh_chung?.ChungNhanTN);
                    setChungNhanUT(inforDetail?.minh_chung?.ChungNhanUT);
                    setTruongTHPT({
                        tenTruong: inforDetail?.TenTruong,
                        khuVucUT: inforDetail?.KhuVucUT
                    });
                    const ngaySinh = formatDate(inforDetail?.NgayThangNamSinh);
                    const paths = ngaySinh.split('/');
                    const formattedDate = new Date(paths[2], paths[1] - 1, paths[0]);
                    setBirthday(formattedDate);
                }
            } catch (e) {
                navigate('/500-ServerError');
            }
        }
        getDetailProfile(maHS);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maHS]);

    // Call api lấy danh sách dân tộc
    useEffect(() => {
        const getNationList = async () => {
            try {
                const data = await getNationListService();
                setNationList(data);
            } catch (e) {
                navigate('/500-ServerError');
            }
        };
        getNationList();
    }, [navigate]);

    // Call api lấy danh sách thành phố Việt Nam;
    useEffect(() => {
        const getCityList = async () => {
            try {
                const data = await getCityListService();
                setCityList(data);
            } catch (e) {
                navigate('/500-ServerError');
            }
        };
        getCityList();
    }, [navigate]);

    //Call api lấy danh sách huyện của tỉnh
    let MaTinh = formik.values.MaTinh;
    useEffect(() => {
        const getDistrictList = async () => {
            try {
                const data = (await getDistrictListService(MaTinh)) || [];
                setDistrictList(data);
            } catch (e) {
                navigate('/500-ServerError');
            }
        };
        getDistrictList();
    }, [MaTinh, navigate]);

    //Call api lấy danh sách xã của huyện
    let MaQuanHuyen = formik.values.MaQuanHuyen;
    useEffect(() => {
        const getCommunelist = async () => {
            try {
                const data = (await getCommunelistService(MaQuanHuyen)) || [];
                setCommunelist(data);
            } catch (e) {
                navigate('/500-ServerError');
            }
        };
        getCommunelist();
    }, [MaQuanHuyen, navigate]);

    // Call api lấy danh sách thành phố của Schools
    useEffect(() => {
        const getCityList = async () => {
            try {
                const data = await getCityListOfSchoolService();
                setCitysOfSchool(data);
            } catch (e) {
                navigate('/500-ServerError');
            }
        };
        getCityList();
    }, [navigate]);

    //Call api lấy danh sách huyện của school
    let maTinhTHPT = formik.values.MaTinhTruong;
    useEffect(() => {
        const getDistrictList = async () => {
            try {
                const data = (await getDistrictListOfSchoolService(maTinhTHPT)) || [];
                setDistrictsOfSchool(data);
            } catch (e) {
                navigate('/500-ServerError');
            }
        };
        getDistrictList();
    }, [maTinhTHPT, navigate]);

    //Call api lấy danh sách school
    let MaHuyenTHPT = formik.values.MaQuanHuyenTruong;
    useEffect(() => {
        const getSchoolList = async () => {
            try {
                const data = (await getSchoollistService(maTinhTHPT, MaHuyenTHPT)) || [];
                setSchoolList(data);
            } catch (e) {
                navigate('/500-ServerError');
            }
        };
        getSchoolList();
    }, [maTinhTHPT, MaHuyenTHPT, navigate]);

    // Call api lấy danh sách ngành học
    useEffect(() => {
        const getMajorList = async () => {
            try {
                const list = await getMajorListService();
                setMajorList(list);
            } catch (e) {
                navigate('/500-ServerError');
            }
        }
        getMajorList();
    }, [navigate])

    // hàm updal img
    const handleUploadImages = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const element = e.target;
        const type = element?.name;
        const files = Array.from(element.files);

        // kiểm tra quá số file upload
        if (files.length > 2) {
            setMessResp('Bạn chỉ được tải tối đa 2 hình ảnh lên!');
            setResponsed(true);
            return;
        }

        const BangKQ12temp = [];
        for (let index = 0; index < files.length; index++) {
            const img_src = await readFile(files[index]);
            switch (type) {
                case 'BangKQ12':
                    errors && (errors['BangKQ12.0'] = '');
                    errors && (errors['BangKQ12.1'] = '');
                    BangKQ12temp.push(img_src);
                    isChangeBKQ12.current = true;
                    break;
                case 'HocBaBia':
                    errors && (errors.HocBaBia = '');
                    setHocBaBia(img_src);
                    isChangeHocBaBia.current = true;
                    break;
                case 'ChungNhanTN':
                    errors && (errors.ChungNhanTN = '');
                    setChungNhanTN(img_src);
                    isChangeChungNhanTN.current = true;
                    break;
                case 'ChungNhanUT':
                    errors && (errors.ChungNhanUT = '');
                    setChungNhanUT(img_src);
                    isChangeChungNhanUT.current = true;
                    break;
                default:
                    return;
            }
        }
        if (type === 'BangKQ12') {
            setBangKQ12(BangKQ12temp);
        }
        setLoading(false);
    };
    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleCloseForm = e => {
        e.preventDefault();
        e.stopPropagation();
        if (formik.dirty) {
            setExit(true);
        } else {
            onCloseForm();
        }
    };

    const handleShowNamTotNghiep = () => {
        const date = new Date();
        const currentYear = date.getFullYear();
        const years = [currentYear];
        for (let i = 1; i <= 9; i++) {
            years.push(currentYear - i);
        }
        const yearsHttml = years.map(year => {
            return (
                <option value={year} selected={formik?.values?.NamTotNghiep === year}
                    key={year}
                >
                    {year}
                </option>
            )
        })
        return yearsHttml;
    }

    return (
        <div className={cx('edit-admission')} ref={formContainerRef}>
            <div className={cx('title')}>
                <h4 className={cx('title-text', 'uppercase text-center py-5')}>Thông tin thí sinh</h4>
                <span className={cx('close')} onClick={handleCloseForm}>
                    <XSquareCloseIcon />
                </span>
            </div>
            <main className={cx('content')}>
                <form method='POST' onSubmit={formik.handleSubmit}>
                    <div className={cx('content-item')}>
                        <div className={cx('content-container', 'container')}>
                            <div className={cx('content-container-item')}>
                                <div className={cx('content-name')}>
                                    <div className={cx('content-infor', 'content-firstName')}>
                                        <label htmlFor='HoDem' className={cx('content-item-label')}>
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Họ đệm
                                        </label>
                                        <input
                                            type='text'
                                            name='HoDem'
                                            id='HoDem'
                                            placeholder='Nhập vào họ đệm'
                                            autoComplete="off"
                                            className={cx('content-item-input')}
                                            value={formik?.values?.HoDem}
                                            onChange={(e) => {
                                                errors && (errors.HoDem = '');
                                                formik.handleChange(e);
                                            }}
                                        />
                                        {(formik.errors.HoDem && formik.touched.HoDem) ||
                                            errors?.HoDem ?
                                            <p className={cx('message')}>
                                                {formik.errors.HoDem || errors?.HoTen}
                                            </p>
                                            :
                                            <p className={cx('message')}> </p>
                                        }
                                    </div>
                                    <div className={cx('content-infor', 'content-lastName')}>
                                        <label htmlFor='Ten' className={cx('content-item-label')}>
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Tên
                                        </label>
                                        <input
                                            type='text'
                                            name='Ten'
                                            id='Ten'
                                            placeholder='Nhập vào tên'
                                            autoComplete="off"
                                            className={cx('content-item-input')}
                                            value={formik?.values?.Ten}
                                            onChange={(e) => {
                                                errors && (errors.Ten = '');
                                                formik.handleChange(e);
                                            }}
                                        />
                                        {(formik.errors.Ten && formik.touched.Ten) || errors?.Ten ?
                                            <p className={cx('message')}>
                                                {formik.errors.Ten || errors?.Ten}
                                            </p>
                                            :
                                            <p className={cx('message')}> </p>
                                        }
                                    </div>
                                </div>
                                <div className={cx('content-infor', 'content-birthday')}>
                                    <label htmlFor='NgaySinh' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Ngày sinh
                                    </label>
                                    <DatePicker
                                        selected={birthday}
                                        showMonthDropdown
                                        showYearDropdown
                                        dateFormat="dd/MM/yyyy"
                                        dropdownMode="select"
                                        className={cx('content-item-input')}
                                        placeholderText="dd/MM/YYYY"
                                        onChange={(date) => {
                                            errors && (errors.NgayThangNamSinh = '');
                                            setBirthday(date);
                                        }}
                                    />
                                    {errors?.NgayThangNamSinh ?
                                        <p className={cx('message')}>{errors?.NgayThangNamSinh}</p> :
                                        <p className={cx('message')}> </p>
                                    }
                                </div>
                                <div className={cx('content-gioiTinhAndDanToc')}>
                                    <div className={cx('content-infor', 'content-grender')}>
                                        <label htmlFor='GioiTinh' className={cx('content-item-label')}>
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Giới tính
                                        </label>
                                        <select
                                            name='GioiTinh'
                                            id='GioiTinh'
                                            className={cx('content-item-input')}
                                            defaultValue={formik.values?.GioiTinh}
                                            value={formik.values.GioiTinh}
                                            onChange={(e) => {
                                                errors && (errors.GioiTinh = '');
                                                formik.handleChange(e)
                                            }}
                                        >
                                            <option value='Nam'
                                                selected={formik.values?.GioiTinh === 'Nam'}
                                            >
                                                Nam
                                            </option>
                                            <option value='Nữ'
                                                selected={formik.values?.GioiTinh === 'Nữ'}
                                            >
                                                Nữ
                                            </option>
                                        </select>
                                        {(formik.errors.GioiTinh && formik.touched.GioiTinh) || errors?.GioiTinh ?
                                            <p className={cx('message')}>
                                                {formik.errors.GioiTinh || errors?.GioiTinh}
                                            </p> :
                                            <p className={cx('message')}> </p>
                                        }
                                    </div>

                                    <div className={cx('content-infor', 'content-dantoc')}>
                                        <label htmlFor='DanToc' className={cx('content-item-label')}>
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Dân tộc
                                        </label>
                                        <select
                                            name='DanToc'
                                            id='DanToc'
                                            className={cx('content-item-input')}
                                            value={formik.values?.DanToc}
                                            defaultValue={formik.values?.DanToc}
                                            onChange={(e) => {
                                                errors && (errors.DanToc = '');
                                                formik.handleChange(e);
                                            }}
                                        >
                                            {nationList.map(nation => {
                                                return (
                                                    <option
                                                        value={nation?.tenDanToc}
                                                        key={nation?.ma}
                                                        selected={formik.values?.DanToc === nation?.tenDanToc}>
                                                        {nation?.tenDanToc}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        {(formik.errors.DanToc && formik.touched.DanToc) || errors?.DanToc ?
                                            <p className={cx('message')}>
                                                {formik.errors.DanToc || errors?.DanToc}
                                            </p> :
                                            <p className={cx('message')}> </p>
                                        }
                                    </div>
                                </div>
                                <div className={cx('content-infor', 'content-CCCD')}>
                                    <label htmlFor='CCCD' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Nhập vào CMND/CCCD
                                    </label>
                                    <input
                                        type='text'
                                        name='CCCD'
                                        id='CCCD'
                                        placeholder='Nhập vào CMND/CCCD'
                                        autoComplete="off"
                                        className={cx('content-item-input')}
                                        value={formik.values?.CCCD}
                                        onChange={(e) => {
                                            errors && (errors.CCCD = '');
                                            formik.handleChange(e);
                                        }}
                                    />
                                    {(formik.errors.CCCD && formik.touched.CCCD) || errors?.CCCD ?
                                        <p className={cx('message')}>
                                            {formik.errors.CCCD || errors?.CCCD}
                                        </p> :
                                        <p className={cx('message')}> </p>
                                    }
                                </div>
                                <div className={cx('content-infor', 'content-email')}>
                                    <label htmlFor='Email' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Email
                                    </label>
                                    <input
                                        type='text'
                                        name='Email'
                                        id='Email'
                                        placeholder='Nhập vào địa chỉ email'
                                        autoComplete="off"
                                        className={cx('content-item-input')}
                                        value={formik.values?.Email}
                                        onChange={(e) => {
                                            errors && (errors.Email = '');
                                            formik.handleChange(e);
                                        }}
                                    />
                                    {(formik.errors.Email && formik.touched.Email) || errors?.Email ?
                                        <p className={cx('message')}>
                                            {formik.errors.Email || errors?.Email}
                                        </p> :
                                        <p className={cx('message')}> </p>
                                    }
                                </div>
                                <div className={cx('content-infor', 'content-phone')}>
                                    <label htmlFor='SDT' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Số điện thoại
                                    </label>
                                    <input
                                        type='text'
                                        name='SDT'
                                        id='SDT'
                                        placeholder='Nhập vào số điện thoại'
                                        autoComplete="off"
                                        className={cx('content-item-input')}
                                        value={formik.values?.SDT}
                                        onChange={(e) => {
                                            errors && (errors.SDT = '');
                                            formik.handleChange(e);
                                        }}
                                    />
                                    {(formik.errors.SDT && formik.touched.SDT) || errors?.Email ?
                                        <p className={cx('message')}>
                                            {formik.errors.SDT || errors?.Email}
                                        </p>
                                        :
                                        <p className={cx('message')}> </p>
                                    }
                                </div>
                            </div>
                            <div className={cx('content-container-item', 'content-full', 'mt-6')}>
                                <div className={cx('content-infor', 'content-hometown')}>
                                    <label htmlFor='Tinh' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Hộ khẩu thường trú
                                    </label>
                                    <div className={cx('content-full-item')}>
                                        <div className={cx('content-howtel-tinh')}>
                                            <select
                                                name='MaTinh'
                                                id='Tinh'
                                                className={cx('content-item-input')}
                                                defaultValue={formik.values?.MaTinh}
                                                onChange={(e) => {
                                                    errors && (errors.MaTinh = '');
                                                    formik.values.MaQuanHuyen = ''
                                                    formik.values.MaPhuongXa = '';
                                                    formik.handleChange(e)
                                                }}
                                            >
                                                <option value=''
                                                    selected={formik.values.MaTinh === ''}
                                                >
                                                    Chọn Tỉnh / Thành Phố
                                                </option>
                                                {cityList.map(city => {
                                                    return (
                                                        <option value={city?.ma} key={city?.ma}
                                                            selected={formik.values?.MaTinh === city?.ma}
                                                        >
                                                            {city?.tenDonVi}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            {(formik.errors.MaTinh && formik.touched.MaTinh) || errors?.MaTinh ?
                                                <p className={cx('message')}>
                                                    {formik.errors.MaTinh || errors?.MaTinh}
                                                </p> :
                                                <p className={cx('message')}> </p>
                                            }
                                        </div>
                                        <div className={cx('content-howtel-huyen')}>
                                            <select
                                                name='MaQuanHuyen'
                                                id='Huyen'
                                                className={cx('content-item-input')}
                                                defaultValue={formik.values?.MaQuanHuyen}
                                                value={formik.values.MaQuanHuyen}
                                                onChange={(e) => {
                                                    errors && (errors.MaQuanHuyen = '');
                                                    formik.values.MaPhuongXa = '';
                                                    formik.handleChange(e)
                                                }}
                                            >
                                                <option value=''
                                                    selected={formik?.values?.MaQuanHuyen === ''}
                                                >
                                                    Chọn Quận / Huyện
                                                </option>
                                                {districtList.map(district => {
                                                    return (
                                                        <option
                                                            value={district?.ma}
                                                            key={district?.ma}
                                                            selected={formik.values?.MaQuanHuyen === district?.ma}
                                                        >
                                                            {district?.tenDonVi}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            {(formik.errors.MaQuanHuyen && formik.touched.MaQuanHuyen) ||
                                                errors?.MaQuanHuyen ?
                                                <p className={cx('message')}>
                                                    {formik.errors.MaQuanHuyen || errors?.MaQuanHuyen}
                                                </p> :
                                                <p className={cx('message')}> </p>
                                            }
                                        </div>
                                        <div className={cx('content-howtel-xa')}>
                                            <select
                                                name='MaPhuongXa'
                                                id='Xa'
                                                className={cx('content-item-input')}
                                                defaultValue={formik.values?.MaPhuongXa}
                                                value={formik.values?.MaPhuongXa}
                                                onChange={(e) => {
                                                    errors && (errors.MaPhuongXa = '');
                                                    formik.handleChange(e);
                                                }}
                                            >
                                                <option
                                                    value=''
                                                    selected={formik?.values?.MaPhuongXa === ''}
                                                >
                                                    Chọn xã
                                                </option>
                                                {communelist.map(commune => {
                                                    return (
                                                        <option
                                                            value={commune?.ma}
                                                            key={commune?.ma}
                                                            selected={formik?.values?.MaPhuongXa === commune?.ma}
                                                        >
                                                            {commune?.tenDonVi}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            {(formik.errors.MaPhuongXa && formik.touched.MaPhuongXa) ||
                                                errors?.MaPhuongXa ?
                                                <p className={cx('message')}>
                                                    {formik.errors.MaPhuongXa || errors?.MaPhuongXa}
                                                </p> :
                                                <p className={cx('message')}> </p>
                                            }
                                        </div>
                                    </div>
                                    <div className={cx('content-infor', 'content-howtel-address', 'mt-6')}>
                                        <input
                                            type='text'
                                            name='DiaChi'
                                            id='address'
                                            placeholder='Nhập vào địa chỉ liên hệ'
                                            autoComplete="off"
                                            className={cx('content-item-input')}
                                            value={formik.values.DiaChi}
                                            onChange={(e) => {
                                                errors && (errors.DiaChi = '');
                                                formik.handleChange(e);
                                            }}
                                        />
                                        {(formik.errors.DiaChi && formik.touched.DiaChi) || errors?.DiaChi ?
                                            <p className={cx('message')}>
                                                {formik.errors.DiaChi || errors?.DiaChi}
                                            </p> :
                                            <p className={cx('message')}> </p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* quá trình học tập */}
                    <div className={cx('content-item')}>
                        <div className={cx('content-item-title', 'flex items-center')}>
                            <span className={cx('flex-1')}></span>
                            <h4 className={cx('content-item-text', 'ml-2 uppercase')}>
                                Quá trình học tập
                            </h4>
                            <span className={cx('flex-1')}></span>
                        </div>
                        <div className={cx('content-container', 'container')}>
                            <div className={cx('content-container-item')}>
                                <div className={cx('content-infor')}>
                                    <label htmlFor='thpt/thanhphp' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Thành phố / Tỉnh
                                    </label>
                                    <select
                                        name='MaTinhTruong'
                                        id='thpt/thanhpho'
                                        className={cx('content-item-input')}
                                        defaultValue={formik.values.MaTinhTruong}
                                        value={formik.values?.MaTinhTruong}
                                        onChange={(e) => {
                                            errors && (errors.MaTinhTruong = '');
                                            formik.values.MaQuanHuyenTruong = '';
                                            formik.handleChange(e);
                                            setTruongTHPT(null);
                                        }}
                                    >
                                        <option
                                            value=''
                                            selected={formik.values.MaTinhTruong === ''}
                                        >
                                            Chọn Tỉnh / Thành Phố
                                        </option>
                                        {
                                            citysOfSchool.map(city => {
                                                return (
                                                    <option
                                                        value={city?.maTinh}
                                                        key={city?.maTinh}
                                                        selected={formik.values.MaTinhTruong === city?.maTinh}
                                                    >
                                                        {city?.tenTinhTP}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                    {(formik.errors.MaTinhTruong && formik.touched.MaTinhTruong) ||
                                        errors?.MaTinhTruong ?
                                        <p className={cx('message')}>
                                            {formik.errors.MaTinhTruong || errors?.MaTinhTruong}
                                        </p> :
                                        <p className={cx('message')}> </p>
                                    }
                                </div>
                                <div className={cx('content-infor')}>
                                    <label htmlFor='thpt/huyen' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Quận / Huyện
                                    </label>
                                    <select
                                        id='thpt/huyen'
                                        name='MaQuanHuyenTruong'
                                        className={cx('content-item-input')}
                                        defaultValue={formik.values?.MaQuanHuyenTruong}
                                        value={formik.values?.MaQuanHuyenTruong}
                                        onChange={(e) => {
                                            errors && (errors.MaQuanHuyenTruong = '');
                                            formik.handleChange(e);
                                            setTruongTHPT(null);
                                        }}
                                    >
                                        <option value='' selected={formik.values?.MaQuanHuyenTruong === ''}>
                                            Chọn Quận / Huyện
                                        </option>
                                        {districtsOfSchool.map((district) => {
                                            return (
                                                <option value={district?.maQH}
                                                    key={district?.maQH}
                                                    selected={formik.values?.MaQuanHuyenTruong === district?.maQH}
                                                >
                                                    {district?.tenQH}
                                                </option>
                                            )
                                        })}
                                    </select>
                                    {(formik.errors.MaQuanHuyenTruong && formik.touched.MaQuanHuyenTruong) ||
                                        errors?.MaQuanHuyenTruong ?
                                        <p className={cx('message')}>
                                            {formik.errors.MaQuanHuyenTruong || errors?.MaQuanHuyenTruong}
                                        </p> :
                                        <p className={cx('message')}> </p>
                                    }
                                </div>
                                <div className={cx('content-infor')}>
                                    <label htmlFor='Truong' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Trường THPT
                                    </label>
                                    <select
                                        name='Truong'
                                        id='Truong'
                                        className={cx('content-item-input')}
                                        defaultValue={null}
                                        onChange={(e) => {
                                            errors && (errors.TenTruong = '');
                                            errors && (errors.KhuVucUT = '');
                                            let value = JSON.parse(e.target.value);
                                            formik.values.TenTruong = value.tenTruong;
                                            setTruongTHPT(value);
                                        }}
                                    >
                                        <option value={JSON.stringify(null)} selected={!TruongTHPT}>
                                            Chọn trường THPT
                                        </option>
                                        {schoolList.map((school) => {
                                            return (
                                                <option
                                                    key={school.maTruong}
                                                    value={JSON.stringify({
                                                        tenTruong: school.tenTruong,
                                                        khuVucUT: school.khuVuc,
                                                    })}
                                                    selected={TruongTHPT?.tenTruong === school.tenTruong}
                                                >
                                                    {school.tenTruong}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {(formik.errors.TenTruong && formik.touched.TenTruong) ||
                                        errors?.TenTruong ?
                                        <p className={cx('message')}>
                                            {formik.errors.TenTruong || errors?.TenTruong}
                                        </p> :
                                        <p className={cx('message')}> </p>
                                    }
                                </div>
                                <div className={cx('content-infor')}>
                                    <label htmlFor='DoiTuongUT' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}> </span>
                                        Đối tượng ưu tiên
                                    </label>
                                    <select
                                        name='DoiTuongUT'
                                        id='DoiTuongUT'
                                        className={cx('content-item-input')}
                                        defaultValue={formik.values?.DoiTuongUT}
                                        value={formik.values?.DoiTuongUT}
                                        onChange={(e) => {
                                            errors && (errors.DoiTuongUt = '');
                                            formik.handleChange(e);
                                        }}
                                    >
                                        <option value="" selected={formik.values.DoiTuongUT === ''}>
                                            Không thuộc diện ưu tiên
                                        </option>
                                        <option value="01" selected={formik.values.DoiTuongUT === '01'}>
                                            01
                                        </option>
                                        <option value="02" selected={formik.values.DoiTuongUT === '02'}>
                                            02
                                        </option>
                                        <option value="03" selected={formik.values.DoiTuongUT === '03'}>
                                            03
                                        </option>
                                        <option value="04" selected={formik.values.DoiTuongUT === '04'}>
                                            04
                                        </option>
                                        <option value="05" selected={formik.values.DoiTuongUT === '05'}>
                                            05
                                        </option>
                                        <option value="06" selected={formik.values.DoiTuongUT === '06'}>
                                            06
                                        </option>
                                        <option value="07" selected={formik.values.DoiTuongUT === '07'}>
                                            07
                                        </option>
                                    </select>
                                    {(formik.errors.DoiTuongUT && formik.touched.DoiTuongUT) ||
                                        errors?.DoiTuongUT ?
                                        <p className={cx('message')}>
                                            {formik.errors.DoiTuongUT || errors?.DoiTuongUT}
                                        </p> :
                                        <p className={cx('message')}> </p>
                                    }
                                </div>
                                <div className={cx('content-infor')}>
                                    <label htmlFor='KhuVucUT' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Khu vực ưu tiên
                                    </label>
                                    <p id="KhuVucUT" className={cx('content-item-input', 'disable')}>
                                        {TruongTHPT ? TruongTHPT.khuVucUT : 'Vui lòng chọn trường'}
                                    </p>
                                    {errors?.KhuVucUT ?
                                        <p className={cx('message')}>
                                            {formik.errors?.KhuVucUT || errors?.KhuVucUT}
                                        </p> :
                                        <p className={cx('message')}> </p>
                                    }
                                </div>
                                <div className={cx('content-infor')}>
                                    <label htmlFor='NamTotNghiep' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Năm tốt nghiệp
                                    </label>
                                    <select name='NamTotNghiep'
                                        defaultValue={formik.values.NamTotNghiep}
                                        id='NamTotNghiep'
                                        className={cx('content-item-input')}
                                        onChange={(e) => {
                                            errors && (errors.NamTotNghiep = '');
                                            formik.handleChange(e);
                                        }}
                                    >
                                        {
                                            handleShowNamTotNghiep()
                                        }
                                    </select>
                                    {(formik.errors.NamTotNghiep && formik.touched.NamTotNghiep) ||
                                        errors?.NamTotNghiep ?
                                        <p className={cx('message')}>
                                            {formik.errors.NamTotNghiep || errors?.NamTotNghiep}
                                        </p> :
                                        <p className={cx('message')}> </p>
                                    }
                                </div>
                            </div>
                            <div className={cx('content-container-item', 'content-full', 'mt-6')}>
                                <div className={cx('content-infor', 'content-hinhthuc')}>
                                    <label htmlFor='HinhThuc' className={cx('content-item-label')}>
                                        <span className={cx('text-red-600 mr-1')}>*</span>
                                        Phương án xét tuyển
                                    </label>
                                    <div className={cx('content-infor', 'content--address', 'mt-6')}>
                                        <select
                                            name='HinhThuc'
                                            id='HinhThuc'
                                            className={cx('content-item-input')}
                                            defaultValue={formik.values?.HinhThuc}
                                            value={formik.values.HinhThuc}
                                            onChange={(e) => {
                                                errors && (errors.HinhThuc = '');
                                                formik.handleChange(e);
                                            }}
                                        >
                                            <option value=''
                                                selected={formik.values?.HinhThuc === 'Điểm TB lớp 10, 11 và học kỳ I lớp 12'}
                                            >
                                                Điểm TB lớp 10, 11 và học kỳ I lớp 12
                                            </option>
                                        </select>
                                        {(formik.errors.HinhThuc && formik.touched.HinhThuc) ||
                                            errors?.HinhThuc ?
                                            <p className={cx('message')}>
                                                {formik.errors.HinhThuc || errors?.HinhThuc}
                                            </p> :
                                            <p className={cx('message')}> </p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cx('content-item')}>
                        <div className={cx('content-item-title', 'flex items-center')}>
                            <span className={cx('flex-1')}></span>
                            <h4 className={cx('content-item-text', 'ml-2 uppercase')}>
                                Kết quả học tập THPT
                            </h4>
                            <span className={cx('flex-1')}></span>
                        </div>
                        <div className={cx('content-container', 'container')}>
                            <div className={cx('content-container-item', 'content-full')}>
                                <div className={cx('content-scores')}>
                                    <div className={cx('content-infor', 'content-scores-item')}>
                                        <div className={cx('content-infor-group')}>
                                            <label htmlFor='DiemTB10'
                                                className={cx('content-item-label')}
                                            >
                                                <span className={cx('text-red-600 mr-1')}>*</span>
                                                Điểm TB lớp 10:
                                            </label>
                                            <input
                                                id='DiemTB10'
                                                name='DiemTB10'
                                                className={cx('content-item-input')}
                                                placeholder='0.00'
                                                autoComplete="off"
                                                value={formik.values?.DiemTB10}
                                                onChange={(e) => {
                                                    errors && (errors.DiemTB10 = '');
                                                    formik.handleChange(e);
                                                }}
                                            />
                                        </div>
                                        {(formik.errors.DiemTB10 && formik.touched.DiemTB10) ||
                                            errors?.DiemTB10 ?
                                            <p className={cx('message')}>
                                                {formik.errors.DiemTB10 || errors?.DiemTB10}
                                            </p> :
                                            <p className={cx('message')}> </p>
                                        }
                                    </div>
                                    <div className={cx('content-infor', 'content-scores-item')}>
                                        <div className={cx('content-infor-group')}>
                                            <label htmlFor='DiemTB11' className={cx('content-item-label')}>
                                                <span className={cx('text-red-600 mr-1')}>*</span>
                                                Điểm TB lớp 11:
                                            </label>
                                            <input
                                                id='DiemTB11'
                                                name='DiemTB11'
                                                className={cx('content-item-input')}
                                                placeholder='0.00'
                                                autoComplete="off"
                                                value={formik.values?.DiemTB11}
                                                onChange={(e) => {
                                                    errors && (errors.DiemTB11 = '');
                                                    formik.handleChange(e);
                                                }}
                                            />
                                        </div>
                                        {(formik.errors.DiemTB11 && formik.touched.DiemTB11) ||
                                            errors?.DiemTB11 ?
                                            <p className={cx('message')}>
                                                {formik.errors.DiemTB11 || errors?.DiemTB11}
                                            </p> :
                                            <p className={cx('message')}> </p>
                                        }
                                    </div>
                                    <div className={cx('content-infor', 'content-scores-item')}>
                                        <div className={cx('content-infor-group')}>
                                            <label htmlFor='DiemMon2' className={cx('content-item-label')}>
                                                <span className={cx('text-red-600 mr-1')}>*</span>
                                                Điểm TB HKI lớp 12:
                                            </label>
                                            <input
                                                id='DiemHKI12'
                                                name='DiemHKI12'
                                                className={cx('content-item-input')}
                                                placeholder='0.00'
                                                autoComplete="off"
                                                value={formik.values?.DiemHKI12}
                                                onChange={(e) => {
                                                    errors && (errors.DiemHKI12 = '');
                                                    formik.handleChange(e);
                                                }}
                                            />
                                        </div>
                                        {(formik.errors.DiemHKI12 && formik.touched.DiemHKI12) ||
                                            errors?.DiemHKI12 ?
                                            <p className={cx('message')}>
                                                {formik.errors.DiemHKI12 || errors?.DiemHKI12}
                                            </p> :
                                            <p className={cx('message')}> </p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cx('content-item')}>
                        <div className={cx('content-item-title', 'flex items-center')}>
                            <span className={cx('flex-1')}></span>
                            <h4 className={cx('content-item-text', 'mx-2 uppercase')}>
                                Ngành xét tuyển
                            </h4>
                            <span className={cx('flex-1')}></span>
                        </div>
                        <div className={cx('content-container', 'container')}>
                            <div className={cx('content-container-item', 'content-full')}>
                                <div className={cx('content-Fieldofstudy')}>
                                    <div className={cx('content-infor', 'content-Fieldofstudy-item')}>
                                        <label htmlFor='nganh' className={cx('content-item-label')}>
                                            <span className={cx('text-red-600 mr-1')}>*</span>
                                            Ngành xét tuyển
                                        </label>
                                        <select
                                            id='nganh'
                                            name='Nganh_ID'
                                            className={cx('content-item-input')}
                                            placeholder='Tùy chọn ngành xét tuyển'
                                            defaultValue={formik.values?.Nganh_ID}
                                            value={formik.values?.Nganh_ID}
                                            onChange={(e) => {
                                                errors && (errors.Nganh_ID = '');
                                                formik.handleChange(e);
                                            }}>
                                            <option value='' selected={formik.values?.Nganh_ID === ''}>
                                                Tùy chọn ngành xét tuyển
                                            </option>
                                            {majorList.map((major) => {
                                                return (
                                                    <option value={major?.id}
                                                        key={major?.id}
                                                        selected={major?.id === formik.values?.Nganh_ID}
                                                    >
                                                        {major.TenNganh}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    {(formik.errors.Nganh_ID && formik.touched.Nganh_ID) ||
                                        errors?.Nganh_ID ?
                                        <p className={cx('message')}>
                                            {formik.errors.Nganh_ID || errors?.Nganh_ID}
                                        </p> :
                                        <p className={cx('message')}> </p>
                                    }
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
                                                <div className={cx('content-images-list')} id='img-container'>
                                                    {BangKQ12?.length > 0 ?
                                                        BangKQ12?.map((img, index) => {
                                                            return (
                                                                <Image src={img}
                                                                    className={cx('content-images-item')}
                                                                    onClick={() => openModal(img)}
                                                                    alt={'img-1' + index}
                                                                    key={index} />
                                                            )
                                                        }) :
                                                        <NoImage
                                                            className={cx('content-images-item', 'empty')}
                                                        />
                                                    }
                                                </div>
                                                {errors?.['BangKQ12.0'] || errors?.['BangKQ12.1'] ?
                                                    <p className={cx('message')}>
                                                        {
                                                            errors?.['BangKQ12.0'] ||
                                                            errors?.['BangKQ12.1']
                                                        }
                                                    </p> :
                                                    <p className={cx('message')}> </p>
                                                }
                                                <label htmlFor='BangKQ12'
                                                    className={cx('content-btn', 'btn-upload')}
                                                >
                                                    <span className={cx('content-btn-icon')}>
                                                        <UploadIcon />
                                                    </span>
                                                    Chọn tệp
                                                </label>
                                                <input
                                                    type='file'
                                                    hidden
                                                    name='BangKQ12'
                                                    id='BangKQ12'
                                                    accept='.jpg'
                                                    onChange={handleUploadImages}
                                                    multiple
                                                />
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
                                                <div className={cx('content-images-list')} id='img-container'>
                                                    {HocBaBia ?
                                                        <Image src={HocBaBia}
                                                            className={cx('content-images-item')}
                                                            alt='img-1'
                                                            onClick={() => openModal(HocBaBia)}
                                                        />
                                                        :
                                                        <NoImage
                                                            className={cx('content-images-item', 'empty')}
                                                        />
                                                    }
                                                </div>
                                                {errors?.HocBaBia ?
                                                    <p className={cx('message')}>
                                                        {errors?.HocBaBia}
                                                    </p> :
                                                    <p className={cx('message')}> </p>
                                                }
                                                <label htmlFor='HocBaBia' className={cx('content-btn', 'btn-upload')}>
                                                    <span className={cx('content-btn-icon')}
                                                    >
                                                        <UploadIcon />
                                                    </span>
                                                    Chọn tệp
                                                </label>
                                                <input
                                                    type='file'
                                                    hidden
                                                    name='HocBaBia'
                                                    id='HocBaBia'
                                                    accept='.jpg'
                                                    onChange={handleUploadImages}
                                                />
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
                                                <div className={cx('content-images-list')} id='img-container'>
                                                    {ChungNhanTN ?
                                                        <Image src={ChungNhanTN}
                                                            className={cx('content-images-item')}
                                                            alt='img-1'
                                                            onClick={() => openModal(ChungNhanTN)}
                                                        />
                                                        :
                                                        <NoImage
                                                            className={cx('content-images-item', 'empty')}
                                                        />
                                                    }
                                                </div>
                                                {errors?.ChungNhanTN ?
                                                    <p className={cx('message')}>
                                                        {errors?.ChungNhanTN}
                                                    </p> :
                                                    <p className={cx('message')}> </p>
                                                }
                                                <label
                                                    htmlFor='ChungNhanTN'
                                                    className={cx('content-btn', 'btn-upload')}
                                                >
                                                    <span className={cx('content-btn-icon')}>
                                                        <UploadIcon />
                                                    </span>
                                                    Chọn tệp
                                                </label>
                                                <input
                                                    type='file'
                                                    hidden
                                                    name='ChungNhanTN'
                                                    id='ChungNhanTN'
                                                    accept='.jpg'
                                                    onChange={handleUploadImages}
                                                />
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
                                                <div className={cx('content-images-list')} id='img-container'>
                                                    {ChungNhanUT ?
                                                        <Image src={ChungNhanUT}
                                                            className={cx('content-images-item')}
                                                            alt='img-1'
                                                            onClick={() => openModal(ChungNhanUT)}
                                                        />
                                                        :
                                                        <NoImage
                                                            className={cx('content-images-item', 'empty')}
                                                        />
                                                    }
                                                </div>
                                                {errors?.ChungNhanUT ?
                                                    <p className={cx('message')}>
                                                        {errors?.ChungNhanUT}
                                                    </p> :
                                                    <p className={cx('message')}> </p>
                                                }
                                                <label
                                                    htmlFor='ChungNhanUT'
                                                    className={cx('content-btn', 'btn-upload')}
                                                >
                                                    <span className={cx('content-btn-icon')}>
                                                        <UploadIcon />
                                                    </span>
                                                    Chọn tệp
                                                </label>
                                                <input
                                                    type='file'
                                                    hidden
                                                    name='ChungNhanUT'
                                                    id='ChungNhanUT'
                                                    accept='.jpg'
                                                    onChange={handleUploadImages}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={cx('content-container', 'content-group-button')}>
                        <Button className={cx('btn-back')} outline onClick={handleCloseForm}>
                            Quay lại
                        </Button>
                        <input type='submit' className={cx('btn-submit')} value='Lưu' />
                    </div>
                </form>
            </main>

            {!dataUpdated &&
                <ModalAlert
                    message='Bạn có chắc chắn muốn thoát không ?'
                    enabled={exit}
                    onClose={() => {
                        setExit(false);
                    }}
                    onAccepted={() => {
                        setExit(false);
                        onCloseForm();
                    }}
                />
            }

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
            <ModalAlertOneButton
                message={messResp}
                enabled={responsed}
                onClick={() => {
                    setResponsed(false)
                }}
            />
            <ModalAlertOneButton
                message={'Cập nhật thông tin hồ sơ thành công!'}
                enabled={dataUpdated}
                onClick={() => {
                    setResponsed(false)
                    onCloseForm(true)
                }}
            />
            <LoadingCricle loading={loading} message='Hệ thống đang xử lý upload...!' />
        </div >
    );
}

export default memo(FormEditAdmissionProfile);
