import React from "react";
import styles from "./Recruitment.module.scss";

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function Recruitment({ reasultModal, onClose, dataResult }) {
    if (!reasultModal) return null;

    // click ra ngoài thì  modal đóng
    const handleClick = (e) => {
        if (e.target.id === "Recruitment") return onClose();
    };

    // format ngày / tháng / năm
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const formattedDateString = formatDate(dataResult.data?.NgayThangNamSinh);

    return (
        <div className={cx('modal')} id="Recruitment" onClose={handleClick}>
            <div className={cx('modal__container')}>
                <div className={cx('container__close')} onClick={() => onClose()}>
                    &times;
                </div>
                <div className={cx('container__title')}>
                    <h1 className={cx('container__title_text')}>Kết quả xét tuyển</h1>
                </div>

                {/* table */}
                <table className={cx('recruitment-table')}>
                    <thead className={cx('recruiment-thead')}>
                        <tr className={cx('recruiment-tr')}>
                            <th className={cx('recruiment-th')}>Mã hồ sơ</th>
                            <th className={cx('recruiment-th')}>Họ và tên</th>
                            <th className={cx('recruiment-th')}>Ngày sinh</th>
                            <th className={cx('recruiment-th')}>Điện thoại</th>
                            <th className={cx('recruiment-th')}>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className={cx('recruiment-tbody')}>
                        <tr className={cx('recruiment-tr')}>
                            <td className={cx('recruiment-td')}>{dataResult.data?.MaHoSo}</td>
                            <td className={cx('recruiment-td')}>
                                {dataResult.data?.HoDem + " " + dataResult.data?.Ten}
                            </td>
                            <td className={cx('recruiment-td')}>{formattedDateString}</td>
                            <td className={cx('recruiment-td')}>{dataResult.data?.SDT}</td>
                            <td className={cx('recruiment-td')}>
                                <div className={cx('table__status')}>
                                    {dataResult.data.xet_tuyen.TrangThai === 1
                                        ? "Trúng tuyển"
                                        : dataResult.data.xet_tuyen.TrangThai === 0
                                            ? "Không trúng tuyển"
                                            : "Đang chờ"}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Recruitment;
