import { memo, useState } from 'react';
import classnames from 'classnames/bind';
import Proptypes from 'prop-types';

import { getElementParent, formatDate } from '~/utils';
import { Button, ModalAlert } from '~/components';
import { CheckSquareIcon } from '~/components/Icon';

import styles from './Table.module.scss';
const cx = classnames.bind(styles);

const Table = ({ className, fields, data, onShowInforDetail, onShowFormEditInfor, onClickDeleting }) => {
    const [deleting, setDeleting] = useState(false);
    const [profileDeleting, setProfileDeleting] = useState('');


    const handleShowInforDetail = (e) => {
        e.stopPropagation();
        const targetElement = getElementParent(e, cx('table-link'));
        const maHS = targetElement.getAttribute('data-target');
        onShowInforDetail(maHS);
    };

    const handleShowFormEditInfor = (e) => {
        e.stopPropagation();
        const targetElement = getElementParent(e, cx('btn-edit'));
        const maHS = targetElement.getAttribute('data-target');
        onShowFormEditInfor(maHS);
    };

    const handleDelInfor = () => {
        // call api tiến hành xóa hồ sơ với mã hồ sơ;
        onClickDeleting(profileDeleting);
        setDeleting(false);
    };

    const handleShowAlertDelete = (e) => {
        e.stopPropagation();
        const targetElement = getElementParent(e, cx('btn-delete'));
        const maHS = targetElement.getAttribute('data-target');
        setProfileDeleting(maHS);
        setDeleting(true);
    };

    return (
        <>
            <table className={cx(className, 'table')}>
                <thead>
                    <tr>
                        <th>STT</th>
                        {fields.map((field, index) => (
                            <th key={index}>{field?.alias}</th>
                        ))}
                        <th>Chi tiết</th>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    {fields.map((field, index) => {
                                        if (field?.property === 'TrangThai' &&
                                            record?.xet_tuyen[field?.property]) {
                                            return (
                                                <td key={index} className={cx('table-col', 'status')}>
                                                    <CheckSquareIcon />
                                                </td>
                                            );
                                        }
                                        if (field?.property === 'TrangThai' &&
                                            record?.xet_tuyen[field?.property] !== false) {
                                            return (
                                                <td key={index} className={cx('table-col', 'status', 'status-warning')}>
                                                    Đang chờ
                                                </td>
                                            );
                                        }
                                        if (field?.property === 'TrangThai' &&
                                            record?.xet_tuyen[field?.property] === false) {
                                            return (
                                                <td key={index} className={cx('table-col', 'status', 'status-error')}>
                                                    Không trúng tuyển
                                                </td>
                                            );
                                        }
                                        if (field?.property === 'NganhHoc') {
                                            return (<td key={index}>{record?.nganh?.TenNganh}</td>)
                                        }
                                        if (field?.property === 'NgayNop') {
                                            return (<td key={index}>{formatDate(record?.NgayNop)}</td>)
                                        }
                                        if (field?.property === 'NgayThangNamSinh') {
                                            return (
                                                <td key={index}>
                                                    {formatDate(record?.NgayThangNamSinh)}
                                                </td>
                                            )
                                        }
                                        return <td key={index}>{record[field?.property]}</td>;
                                    })}
                                    <td>
                                        <Button
                                            onClick={handleShowInforDetail}
                                            className={cx('table-link')}
                                            text
                                            data-target={record?.MaHoSo}
                                        >
                                            Chi tiết
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            onClick={handleShowFormEditInfor}
                                            className={cx('btn-edit')}
                                            small
                                            data-target={record?.MaHoSo}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            className={cx('btn-delete')}
                                            small
                                            onClick={handleShowAlertDelete}
                                            data-target={record?.MaHoSo}
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <>
                            {/* Mặc định sẽ hiển thị 3 row trống */}
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </>
                    )}
                </tbody>
            </table>
            <ModalAlert
                message="Bạn có chắc chắn muốn xóa không ?"
                enabled={deleting}
                onClose={() => {
                    setProfileDeleting('');
                    setDeleting(false);
                }}
                onAccepted={handleDelInfor}
            />
        </>
    );
};

Table.propTypes = {
    fields: Proptypes.array.isRequired,
    data: Proptypes.array.isRequired,
};
export default memo(Table);
