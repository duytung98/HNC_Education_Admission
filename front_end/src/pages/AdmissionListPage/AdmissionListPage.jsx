import classnames from 'classnames/bind';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { useDebounce } from '~/hooks';
import { userSelector, loginSuccess } from '~/store';
import {
    createAxios, formatDate, getMaHuyenTHPT, getIDNganhByName, getMaTinhTHPT,
    getMaTinhByName, getMaHuyenByName, getMaXaByName
}
    from '~/utils';
import {
    admissionListService, deleteProfileService,
    updateStatusAdmissionService, sendMailService, registerProfile
}
    from '~/services';
import { readDataFromFileExcel, exportDataToFileExcel } from '~/utils';
import {
    PlusCircleIcon, SearchIcon, DownloadIcon, ChevronDownIcon,
    ExcelIcon
}
    from '~/components/Icon';
import {
    Button, Pagination, Table, LoadingCricle,
    FormDetailAdmissionProfile, FormEditAdmissionProfile,
    ModalAlertOneButton
}
    from '~/components';
import styles from './AdmissionListPage.module.scss';

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
        property: 'NgayNop',
        alias: 'Ngày nộp',
    },
    {
        property: 'TrangThai',
        alias: 'Trạng thái',
    },
];

function AdmissionListPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const importDataInputRef = useRef(null);
    const user = useSelector(userSelector);
    const requestJWT = createAxios(user, dispatch, loginSuccess);

    const [loading, setLoading] = useState(false);
    const [valueSearch, setValueSearch] = useState('');
    const searchDebounce = useDebounce(valueSearch, 500); //0.5s;
    const [admissionList, setAdmissionList] = useState([]);
    const [detailing, setDetailing] = useState(false);
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [messageRep, setMessageRep] = useState('');
    const [importRep, setImportRep] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(false);
    const [currentAdmissionList, setCurrentAdmissionList] = useState([]);
    const [admissionListShow, setAdmissionListShow] = useState([]);
    const [maHS, setMaHS] = useState('');

    const [pagination, setPagination] = useState({
        totalPerPages: 50, // default 50
        currentPage: 1, //Default page to 1
        totalPages: 0, //Default 0
        totalPerInDB: 0, //Default 0
    });

    // Call api lấy danh sách hồ sơ xét tuyển!
    useEffect(() => {
        const getAdmission = async () => {
            try {
                setLoading(true);
                const res = await admissionListService(user?.access_token, requestJWT);
                if (res?.error) return navigate('/500-ServerError')
                setAdmissionList(res);
                setCurrentAdmissionList(res);
                setPagination({
                    totalPages: Math.ceil(res.length / 50),
                    currentPage: 1,
                    totalPerInDB: res.length,
                    totalPerPages: 50,
                });
                setLoading(false);
            }
            catch (e) {
                navigate('/500-ServerError')
            }
        }
        getAdmission();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //Xử lý lọc ra các bản ghi có giá trị trùng với giá trị search
    useEffect(() => {
        if (admissionList.length > 0) {
            setLoading(true);
            if (!searchDebounce) {
                setPagination((prev) => {
                    return {
                        ...prev,
                        totalPages: Math.ceil(admissionList.length / prev?.totalPerPages),
                        currentPage: 1
                    }
                })
                setCurrentAdmissionList(admissionList);
                return;
            }

            const admissionListFillted = admissionList.filter((admission) => {
                let fullName = admission?.HoDem + ' ' + admission?.Ten;
                return (
                    admission?.MaHoSo?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    admission?.SDT?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    admission?.CCCD?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    fullName?.toLowerCase().includes(searchDebounce.trim().toLowerCase()) ||
                    admission?.Email?.toLowerCase().includes(searchDebounce.trim().toLowerCase())
                );
            });
            setPagination((prev) => {
                return {
                    ...prev,
                    totalPages: Math.ceil(admissionListFillted.length / prev?.totalPerPages),
                    currentPage: 1
                }
            })
            setCurrentAdmissionList(admissionListFillted);
            setLoading(false);
        } else {
            setCurrentAdmissionList([]);
        }
    }, [searchDebounce, admissionList, setCurrentAdmissionList]);

    //Xử lý phân trang data
    useEffect(() => {
        try {
            setLoading(true);
            //Danh sách hồ sơ giới hạn trên một page
            let indexLastOfPost = pagination.currentPage * pagination.totalPerPages;
            let indexFirstOfPost = indexLastOfPost - pagination.totalPerPages;
            let admissionListLimit = currentAdmissionList?.slice(indexFirstOfPost, indexLastOfPost);
            setAdmissionListShow(admissionListLimit);
            setLoading(false);
        }
        catch (e) {
            navigate('/500-ServerError');
        }
    }, [pagination.currentPage, pagination.totalPerPages, currentAdmissionList, navigate]);

    //Xử lý change page khi use click vào một trang khác
    const onChangePage = (number) => {
        setLoading(true);
        setPagination({
            ...pagination,
            currentPage: number,
        });
        setLoading(false);
    };

    // xử lý import data từ file excel
    const handleImportData = async (e) => {
        setLoading(true);
        const file = e.target.files[0];
        e.target.value = null;
        await handleReadDataFile(file);
        setLoading(false);
    };

    // xử lý đọc dữ liệu có trong file excel
    const handleReadDataFile = async (file) => {
        let countInsert = 0;
        try {
            const data = await readDataFromFileExcel(file);
            //Sau khi đọc thành công data gửi lên và chuyển đổi thành kiểu dữ liệu JS tiến hành upate state
            // và đồng thời gửi data lên server để lưu trữ;
            for (let i = 0; i < data.length; i++) {
                const inforHKTT = data[i].QueQuan.split(' - ');
                const inforSchool = data[i].Truong.split(' - ');
                const MaTinh = await getMaTinhByName(inforHKTT[2]);
                const MaQuanHuyen = await getMaHuyenByName(inforHKTT[1], MaTinh);
                const MaPhuongXa = await getMaXaByName(inforHKTT[0], MaQuanHuyen);
                const MaTinhTruong = await getMaTinhTHPT(inforSchool[2])
                const MaQuanHuyenTruong = await getMaHuyenTHPT(inforSchool[1], MaTinhTruong)
                const Nganh_ID = await getIDNganhByName(data[i].TenNganh);
                let date = formatDate(data[i].NgaySinh);
                let paths = date.split('/');
                let NgayThangNamSinh = paths[2] + '-' + paths[1] + '-' + paths[0];

                const dataFormated = {
                    HoDem: data[i].HoDem,
                    Ten: data[i].Ten,
                    NgayThangNamSinh,
                    GioiTinh: data[i].GioiTinh,
                    DanToc: data[i].DanToc,
                    CCCD: data[i].CCCD,
                    Email: data[i].Email.text,
                    SDT: data[i].SDT,
                    MaTinh,
                    MaQuanHuyen,
                    MaPhuongXa,
                    DiaChi: data[i].DiaChi,
                    MaTinhTruong,
                    MaQuanHuyenTruong,
                    TenTruong: inforSchool[0],
                    DoiTuongUT: data[i].DoiTuongUT,
                    KhuVucUT: data[i].KhuVucUT,
                    NamTotNghiep: data[i].NamTotNghiep,
                    HinhThuc: data[i].HinhThuc,
                    DiemTB10: data[i].DiemTB10,
                    DiemTB11: data[i].DiemTB11,
                    DiemHKI12: data[i].DiemHKI12,
                    Nganh_ID,
                }
                const res = await registerProfile(dataFormated);
                if (res.errors) {
                    throw new Error('Lỗi xảy ra khi đăng ký hồ sơ');
                }
                countInsert++;
            }
            const newAdmissionList = await admissionListService(user?.access_token, requestJWT);
            setAdmissionList(newAdmissionList);
            setCurrentAdmissionList(newAdmissionList);
            setPagination({
                totalPages: Math.ceil(newAdmissionList.length / 50),
                currentPage: 1,
                totalPerInDB: newAdmissionList.length,
                totalPerPages: 50,
            });
            setMessageRep('Đã import: ' + countInsert + ' Hồ sơ !.')
            setImportRep(true);
        } catch (err) {
            setMessageRep('Đã import: ' + countInsert + ' Hồ sơ !. Sau đó đã có lỗi xảy ra');
            const newAdmissionList = await admissionListService(user?.access_token, requestJWT);
            setAdmissionList(newAdmissionList);
            setCurrentAdmissionList(newAdmissionList);
            setPagination({
                totalPages: Math.ceil(newAdmissionList.length / 50),
                currentPage: 1,
                totalPerInDB: newAdmissionList.length,
                totalPerPages: 50,
            });
            setImportRep(true);
        }
    };

    // xử lý export data ra file excel
    const handleExportData = async (e) => {
        try {
            setLoading(true);
            const dataFormated = admissionList.map((admission, index) => {
                return {
                    STT: index + 1,
                    MaHoSo: admission?.MaHoSo,
                    HoDem: admission?.HoDem,
                    Ten: admission?.Ten,
                    GioiTinh: admission?.GioiTinh,
                    NgaySinh: new Date(admission?.NgayThangNamSinh),
                    CCCD: admission?.CCCD,
                    SDT: admission?.SDT,
                    Email: admission?.Email,
                    HinhThuc: admission?.xet_tuyen?.HinhThuc,
                    Nganh: admission?.nganh?.TenNganh,
                    DiemTB10: admission?.xet_tuyen?.DiemTB10,
                    DiemTB11: admission?.xet_tuyen?.DiemTB11,
                    DiemHKI12: admission?.xet_tuyen?.DiemHKI12,
                    NgayXetTuyen: new Date(admission?.NgayNop),
                    Link: process.env.REACT_APP_DOMAIN + '/tracuuhoso/' + admission?.MaHoSo
                }
            })
            await exportDataToFileExcel(dataFormated, 'Danh sách hồ sơ xét tuyển');
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
    const onCloseFormEditInforProfile = useCallback((statusEdit = false) => {
        if (!statusEdit) {
            setEditing(false);
            return;
        }
        // cập nhật thông tin của hồ sơ mới update
        const getAdmissionList = async () => {
            const admission = await admissionListService(user?.access_token, requestJWT);
            setAdmissionList(admission);
        }
        getAdmissionList();
        setEditing(false);
    }, [requestJWT, user?.access_token]);

    const handleDeleteProfile = useCallback((maHS) => {
        try {
            const deleteProfile = async (maHS) => {
                setLoading(true);
                const res = await deleteProfileService(maHS, user?.access_token, requestJWT);
                if (res?.success) {
                    const newAdmissionList = (admissionList.length >= 2) ?
                        admissionList?.filter(
                            (admission) => maHS !== admission?.MaHoSo)
                        : [];
                    setAdmissionList(newAdmissionList);
                    setDeleting(false);
                    setMessageRep('Bạn đã xóa thành công!')
                    return;
                }

                if (res?.error) {
                    setMessageRep('Xóa thất bại, Có một sự cố đã xảy ra!')
                    setDeleting(false);
                }
                setLoading(false);
            }
            deleteProfile(maHS)
        } catch (e) {
            navigate('/500-ServerError');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, requestJWT])

    const handleUpdateStatusAdmission = useCallback((profile, status) => {
        const updateStatus = async (profile, status) => {
            try {
                setLoading(true);
                const data = {
                    idHoSo: profile?.id,
                    fullName: `${profile?.HoDem} ${profile?.Ten}`,
                    email: profile?.Email,
                    ngaySinh: formatDate(profile?.NgayThangNamSinh),
                    gioiTinh: profile?.GioiTinh,
                    diaChi: profile?.DiaChi,
                    nganhHoc: profile?.nganh?.TenNganh,
                    trangthai: status,
                }
                const res = await updateStatusAdmissionService(data, user?.access_token, requestJWT);
                if (res.message === 'Cập nhật trạng thái thành công') {
                    const newAdmissionList = (admissionList.length >= 2) ?
                        admissionList?.filter(
                            (admission) => maHS !== admission?.MaHoSo)
                        : [];
                    setDetailing(false);
                    setMessageRep('Trạng thái hồ sơ đã được xử lý!');
                    setAdmissionList(newAdmissionList);
                    setUpdateStatus(true);

                    if (status)
                        sendMailService(data, user?.access_token, requestJWT);
                    return;
                }

                if (res?.error) {
                    setMessageRep('Update thất bại, Đã có sự cố gì đó xảy ra!');
                    updateStatus(true);
                    return;
                }
                setLoading(false);
            } catch (e) {
                navigate('/500-ServerError');
            }
        }
        updateStatus(profile, status);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestJWT, user])

    return (
        <div className={cx('admissionList-page')}>
            <div className={cx('admissionList-title', 'py-3')}>
                <h2 className={cx('admissionList-title-text', 'font-bold text-center text-2xl')}>
                    Tổng số hồ sơ đã xét tuyển:
                    <span className={cx('admissionList-amount', 'text-red-600')}
                    > {admissionList.length} </span>hồ sơ
                </h2>
                <p className={cx('admissionList-title-description', 'text-center text-[18px] mt-1')}>
                    Danh sách hồ sơ đã đăng ký xét tuyển bằng học bạ THPT - Tuyển sinh năm học{' '}
                    {new Date().getFullYear()}
                </p>
            </div>
            <div className={cx('admissionList-function', 'flex justify-center p-5 mb-5')}>
                <div className={cx('admissionList-function-group', 'flex')}>
                    <Button to="/nophosoxettuyen" primary className={cx('function-btn')} iconLeft={<PlusCircleIcon />}>
                        Thêm hồ sơ
                    </Button>
                    <div className={cx('function-import', 'ml-2')}>
                        <Button
                            outline
                            iconLeft={<DownloadIcon />}
                            onClick={() => {
                                importDataInputRef.current.click();
                            }}
                        >
                            Import
                        </Button>
                        <input
                            type="file"
                            accept=".xlsx"
                            name="data"
                            hidden
                            ref={importDataInputRef}
                            onChange={handleImportData}
                        />
                    </div>
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
                <div className={cx('admissionList-function-search', 'flex items-center')}>
                    <button className={cx('btn-search', 'px-3 cursor-default h-full')}>
                        <SearchIcon />
                    </button>
                    <input
                        name="search"
                        placeholder="Tìm kiếm ..."
                        id="search"
                        value={valueSearch}
                        onChange={(e) => {
                            setValueSearch(e.target.value);
                        }}
                        className={cx('input-search', 'h-full border-')}
                    />
                </div>
            </div>
            <div className={cx('addmissionList-content')}>
                <Table
                    className={cx('admissionList-table')}
                    fields={fieldsOfTable}
                    data={admissionListShow}
                    onShowInforDetail={onShowInforDetail}
                    onShowFormEditInfor={onShowFormEditInforProfile}
                    onClickDeleting={handleDeleteProfile}
                />
            </div>
            {
                pagination?.totalPages > 1 &&
                <div className={cx('admissionList-pagination', 'flex justify-center mt-10')}>
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
                        handleUpdateStatusAdmission={handleUpdateStatusAdmission}
                    />
                </div>)
            }
            {editing &&
                (<div className={cx('form-editInfor')}>
                    <FormEditAdmissionProfile onCloseForm={onCloseFormEditInforProfile} maHS={maHS} />
                </div>)
            }
            <ModalAlertOneButton
                message={messageRep}
                enabled={deleting}
                onClick={() => {
                    setDeleting(false)
                }}
            />
            <ModalAlertOneButton
                message={messageRep}
                enabled={updateStatus}
                onClick={() => {
                    setUpdateStatus(false)
                }}
            />
            <ModalAlertOneButton
                message={messageRep}
                enabled={importRep}
                onClick={() => {
                    setImportRep(false)
                }}
            />
        </div>
    );
}

export default AdmissionListPage;
