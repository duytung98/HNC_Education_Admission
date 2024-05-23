import classnames from 'classnames/bind';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { useDebounce } from '~/hooks';
import { userSelector, loginSuccess } from '~/store';
import styles from './AdmissionAcceptedListPage.module.scss';
import {
    exportDataToFileExcel, createAxios,
} from '~/utils';
import { getMajorListService, admissionAcceptedListService, deleteProfileService } from '~/services';
import { SearchIcon, ChevronDownIcon, ExcelIcon } from '~/components/Icon';
import {
    Pagination, Table, FormDetailAdmissionProfile, FormEditAdmissionProfile,
    ModalAlertOneButton, LoadingCricle
}
    from '~/components';

const cx = classnames.bind(styles);
const functionsExportList = [];
const fieldsOfTable = [
    {
        property: 'MaHoSo',
        alias: 'Mã Hồ sơ',
    },
    {
        property: 'HoDem',
        alias: 'Họ đệm',
    },
    {
        property: 'Ten',
        alias: 'Tên',
    },
    {
        property: 'NgayThangNamSinh',
        alias: 'Ngày sinh',
    },
    {
        property: 'CCCD',
        alias: 'Số CMND/CCCD',
    },
    {
        property: 'SDT',
        alias: 'Điện thoại',
    },
    {
        property: 'Email',
        alias: 'Email',
    },
    {
        property: 'NganhHoc',
        alias: 'Ngành học',
    },
    {
        property: 'TrangThai',
        alias: 'Trạng Thái',
    },
];

function AdmissionAcceptedListPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [detailing, setDetailing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [editing, setEditing] = useState(false);
    const user = useSelector(userSelector);
    const requestJWT = createAxios(user, dispatch, loginSuccess)

    const [admissionAcceptedList, setAdmissionAcceptedList] = useState([]);
    const [fieldOfStudy, setFieldOfStudy] = useState('');
    const [valueSearch, setValueSearch] = useState('');
    const [majorList, setMajorList] = useState([]);
    const searchDebounce = useDebounce(valueSearch, 500); //0.5s
    const [loading, setLoading] = useState(false);
    const [currentAdmissionAcceptedList, setCurrentAdmissionAcceptedList] = useState([]);
    const [admissionAcceptedListShow, setAdmissionAcceptedListShow] = useState([]);
    const [maHS, setMaHS] = useState('');

    const [pagination, setPagination] = useState({
        totalPerPages: 50, // default 50
        currentPage: 1, //Default page to 1
        totalPages: 0, //Default 0
        totalPerInDB: 0, //Default 0
    });

    // Call api lấy danh sách hồ sơ trúng tuyển
    useEffect(() => {
        setLoading(true);
        const getAdmissionAcceptedList = async (access_token, request) => {
            try {
                const res = await admissionAcceptedListService(access_token, request) || [];
                if (res?.error) return navigate('/500-ServerError');
                setAdmissionAcceptedList(res);
                setCurrentAdmissionAcceptedList(res);
                setPagination({
                    totalPages: Math.ceil(res.length / 50),
                    currentPage: 1,
                    totalPerInDB: res.length,
                    totalPerPages: 50,
                });
            } catch (e) {
                navigate('/500-ServerError');
            }
        }
        getAdmissionAcceptedList(user?.access_token, requestJWT);
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Call api lấy danh sách ngành học;
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

    //Xử lý lọc các bản ghi có giá trị khớp với valueSearh và fieldOfStudy
    useEffect(() => {
        setLoading(true);
        const acceptedListFillted = admissionAcceptedList.filter((admission) => {
            if (!fieldOfStudy && !searchDebounce) {
                return true;
            }

            let fullName = admission?.HoDem + ' ' + admission?.Ten;
            if (!fieldOfStudy) {
                return (
                    admission?.MaHoSo?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    admission?.SDT?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    admission?.CCCD?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    fullName.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    admission?.Email.toLowerCase().includes(searchDebounce.trim().toLowerCase())
                );
            }

            return (
                admission?.nganh?.TenNganh?.toLowerCase().includes(fieldOfStudy.trim().toLowerCase()) &&
                (admission?.MaHoSo?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    admission?.SDT?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    admission?.CCCD?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    fullName.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    admission?.Email?.toLowerCase().includes(searchDebounce.trim().toLowerCase()))
            );
        });
        setCurrentAdmissionAcceptedList(acceptedListFillted);
        setPagination((prev) => {
            return {
                ...prev,
                currentPage: 1,
                totalPages: Math.ceil(acceptedListFillted.length / prev?.totalPerPages),
            }
        })
        setLoading(false);
    }, [searchDebounce, fieldOfStudy, admissionAcceptedList]);

    //Xử lý phân trang
    useEffect(() => {
        setLoading(true);
        try {
            //Danh sách hồ sơ giới hạn trên một page
            let indexLastOfPost = pagination.currentPage * pagination.totalPerPages;
            let indexFirstOfPost = indexLastOfPost - pagination.totalPerPages;
            let data = currentAdmissionAcceptedList.slice(indexFirstOfPost, indexLastOfPost);
            setAdmissionAcceptedListShow(data);
        } catch (e) {
            navigate('/500-ServerError');
        }
        setLoading(false);
    }, [pagination.currentPage, pagination.totalPerPages, currentAdmissionAcceptedList, navigate]);

    //Xử lý change page khi use click vào một trang khác
    const onChangePage = (number) => {
        setPagination({
            ...pagination,
            currentPage: number,
        });
    };

    //Cập nhật state value search khi user change state
    function handleOnChangeSearch(e) {
        let text = e.target.value;
        setValueSearch(text);
    }

    //Cập nhật state value fieldOfStudy khi user change state
    function handleOnChangeFieldOfStudy(e) {
        let element = e.target;
        let value = element.getAttribute('value');
        setFieldOfStudy(value);
    }

    // xử lý export data ra file excel
    const handleExportData = async (e) => {
        try {
            setLoading(true);
            const dataFormated = currentAdmissionAcceptedList.map((profile, index) => {
                console.log(profile?.GioiTinh);
                return {
                    STT: index + 1,
                    MaHoSo: profile?.MaHoSo,
                    HoDem: profile?.HoDem,
                    Ten: profile?.Ten,
                    GioiTinh: profile?.GioiTinh,
                    NgaySinh: new Date(profile?.NgayThangNamSinh),
                    CCCD: profile?.CCCD,
                    SDT: profile?.SDT,
                    Email: profile?.Email,
                    HinhThuc: profile?.xet_tuyen?.HinhThuc,
                    Nganh: profile?.nganh?.TenNganh,
                    DiemTB10: profile?.xet_tuyen?.DiemTB10,
                    DiemTB11: profile?.xet_tuyen?.DiemTB11,
                    DiemHKI12: profile?.xet_tuyen?.DiemHKI12,
                    NgayXetTuyen: new Date(profile?.NgayNop),
                    Link: process.env.REACT_APP_DOMAIN + 'tracuuhoso/' + profile?.MaHoSo
                }
            })

            fieldOfStudy ?
                await exportDataToFileExcel(dataFormated, 'Danh sách hồ sơ trúng tuyển theo: ' + fieldOfStudy)
                :
                await exportDataToFileExcel(dataFormated, 'Danh sách hồ sơ trúng tuyển');
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    //Hiển thị thông tin chi tiết hồ sơ xét tuyển
    const onShowInforDetail = useCallback((maHS) => {
        setDetailing(true);
        setMaHS(maHS);
    }, []);

    //Đóng form hiển thị thông tin chi tiết hồ sơ xét tuyển
    const onCloseFormInforDetail = useCallback(() => {
        setDetailing(false);
    }, []);

    //Hiển thị form chỉnh sửa thông tin hồ sơ
    const onShowFormEditInforProfile = useCallback((maHS) => {
        setEditing(true);
        setMaHS(maHS);
    }, []);

    //Đóng form chỉnh sửa thông tin hồ sơ;
    //Đóng form chỉnh sửa thông tin hồ sơ;
    const onCloseFormEditInforProfile = useCallback((statusEdit = false) => {
        if (!statusEdit) {
            setEditing(false);
            return;
        }
        // cập nhật thông tin của hồ sơ mới update
        const getAdmissionAcceptedList = async () => {
            const admission = await admissionAcceptedListService(user?.access_token, requestJWT);
            setAdmissionAcceptedList(admission);
        }
        getAdmissionAcceptedList();
        setEditing(false);
    }, [requestJWT, user?.access_token]);

    const handleDeleteProfile = useCallback((maHS) => {
        try {
            setLoading(true);
            const deleteProfile = async (maHS) => {
                const res = await deleteProfileService(maHS, user?.access_token, requestJWT);
                if (res?.success) {
                    const newAdmissionAcceptedList = (admissionAcceptedList.length >= 2) ?
                        admissionAcceptedList?.filter(
                            (admission) => maHS !== admission?.MaHoSo)
                        : [];
                    setAdmissionAcceptedList(newAdmissionAcceptedList);
                    setDeleteMessage('Bạn đã thành công!')
                    setDeleting(true);
                    return;
                }

                if (res?.error) {
                    setDeleteMessage('Xóa thất bại, Có một sự cố đã xảy ra!')
                    setDeleting(true);
                }
            }
            deleteProfile(maHS)
            setLoading(false);
        } catch (e) {
            navigate('/500-ServerError');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, requestJWT])

    return (
        <div className={cx('admissionAcceptedList-page')}>
            <div className={cx('admissionAcceptedList-title', 'py-3')}>
                <h2 className={cx('admissionAcceptedList-title-text', 'font-bold text-center text-2xl')}>
                    Tổng số hồ sơ đã trúng tuyển:
                    <span className={cx('admissionAcceptedList-amount', 'text-red-600')}
                    > {admissionAcceptedList.length} </span>hồ sơ
                </h2>
                <p className={cx('admissionAcceptedList-title-description', 'text-center text-[18px] mt-1')}>
                    Danh sách hồ sơ đã trúng tuyển bằng học bạ THPT - Tuyển sinh năm học {new Date().getFullYear()}
                </p>
            </div>
            <div className={cx('admissionAcceptedList-function', 'flex justify-center p-5 mb-5')}>
                <div className={cx('admissionAcceptedList-function-group', 'flex')}>
                    <div className={cx('function-export')}>
                        <h4 className={cx('function-export-item', 'current')} onClick={handleExportData}>
                            <ExcelIcon className={cx('function-export-icon')} />
                            Xuất excel
                        </h4>
                        <ul className={cx('function-export-list')}>
                            {functionsExportList.length > 0 &&
                                functionsExportList.map((item, index) => {
                                    return (
                                        <li className={cx('function-export-item')} key={index}>
                                            {item?.icon}
                                            {item.title}
                                        </li>
                                    );
                                })}
                        </ul>
                        <ChevronDownIcon />
                    </div>
                </div>
                <div className={cx('admissionAcceptedList-function-search', 'flex items-center')}>
                    <button className={cx('btn-search', 'px-3 h-full cursor-default')}>
                        <SearchIcon />
                    </button>
                    <input
                        name="search"
                        placeholder="Tìm kiếm ..."
                        id="search"
                        onChange={handleOnChangeSearch}
                        className={cx('input-search', 'h-full border-')}
                    />
                </div>
                <div className={cx('function-filter', 'flex items-center ml-4')}>
                    <label>Lọc theo ngành: </label>
                    <div className={cx('function-filter-select', 'justify-between')}>
                        <h4 className={cx('function-filter-select-item', 'current')}>
                            {fieldOfStudy ? fieldOfStudy : 'Chọn ngành học'}
                        </h4>
                        <ul className={cx('function-filter-select-list')}>
                            <li
                                className={cx('function-filter-select-item')}
                                value=""
                                onClick={handleOnChangeFieldOfStudy}
                            >
                                Tất cả
                            </li>
                            {majorList.length > 0 &&
                                majorList.map((item, index) => {
                                    return (
                                        <li
                                            className={cx('function-filter-select-item')}
                                            key={index}
                                            value={item?.TenNganh}
                                            onClick={handleOnChangeFieldOfStudy}
                                        >
                                            {item.TenNganh}
                                        </li>
                                    );
                                })}
                        </ul>
                        <ChevronDownIcon />
                    </div>
                </div>
            </div>
            <div className={cx('admissionAcceptedList-content')}>
                <Table
                    className={cx('admissionAcceptedList-table')}
                    fields={fieldsOfTable}
                    data={admissionAcceptedListShow}
                    onShowInforDetail={onShowInforDetail}
                    onShowFormEditInfor={onShowFormEditInforProfile}
                    onClickDeleting={handleDeleteProfile}
                />
            </div>
            {
                pagination?.totalPages > 1 &&
                <div className={cx('admissionAcceptedList-pagination', 'flex justify-center mt-10')}>
                    <Pagination onChangePage={onChangePage} pagination={pagination} />
                </div>
            }
            <LoadingCricle loading={loading} />
            {detailing &&
                (<div className={cx('form-detail')}>
                    <FormDetailAdmissionProfile
                        maHS={maHS}
                        onClose={onCloseFormInforDetail}
                        onShowEdit={onShowFormEditInforProfile}
                    />
                </div>)
            }
            {editing &&
                (<div className={cx('form-editInfor')}>
                    <FormEditAdmissionProfile
                        onCloseForm={onCloseFormEditInforProfile}
                        maHS={maHS}
                    />
                </div>)
            }
            <ModalAlertOneButton
                message={deleteMessage}
                enabled={deleting}
                onClick={() => {
                    setDeleting(false)
                    setDeleteMessage('')
                }}
            />
        </div>
    );
}

export default AdmissionAcceptedListPage;
