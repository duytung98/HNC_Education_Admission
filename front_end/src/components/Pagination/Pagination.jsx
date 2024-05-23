import { useState, useEffect, memo } from 'react';
import classNames from 'classnames/bind';
import styles from './Pagination.module.scss';
import { Button } from '~/components';

const cx = classNames.bind(styles);

function Pagination({ pagination, onChangePage }) {
    const { currentPage, totalPages } = pagination;
    const [pagesNumberShowed, setPagesNumberShowed] = useState([]);

    useEffect(() => {
        if (totalPages <= 1) return;

        const newPagesNumberShowed = [];
        for (let i = currentPage; i < currentPage + 4 && i <= totalPages; i++) {
            newPagesNumberShowed.push(i);
        }
        setPagesNumberShowed(newPagesNumberShowed);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalPages]);

    const handleChangePage = (e) => {
        const number = parseInt(e.target.innerText);
        onChangePage(number);
    };

    const handlePrevPage = () => {
        const prevPageNumber = currentPage - 1;
        if (prevPageNumber >= 1) {
            onChangePage(prevPageNumber);
        }
        // currnet page nằm trong khoảng pagesNumberShowed
        if (
            prevPageNumber > pagesNumberShowed[0] &&
            prevPageNumber < pagesNumberShowed[pagesNumberShowed.length - 1]
        )
            return;
        // currnet page không nằm trong khoảng pagesNumberShowed
        if (prevPageNumber < pagesNumberShowed[0]) {
            const newPagesNumberShowed = pagesNumberShowed.slice(0, pagesNumberShowed.length - 1);
            newPagesNumberShowed.unshift(prevPageNumber);
            setPagesNumberShowed(newPagesNumberShowed);
        }
    };

    const handleNextPage = () => {
        const nextPageNumber = currentPage + 1;
        if (nextPageNumber <= totalPages) {
            onChangePage(nextPageNumber);
        }
        // currnet page nằm trong khoảng pagesNumberShowed
        if (
            nextPageNumber > pagesNumberShowed[0] &&
            nextPageNumber < pagesNumberShowed[pagesNumberShowed.length - 1]
        )
            return;
        // currnet page không nằm trong khoảng pagesNumberShowed
        if (nextPageNumber > pagesNumberShowed[pagesNumberShowed.length - 1]) {
            const newPagesNumberShowed = pagesNumberShowed.slice(1, pagesNumberShowed.length);
            newPagesNumberShowed.push(nextPageNumber);
            setPagesNumberShowed(newPagesNumberShowed);
        }
    };

    return (
        <div>
            {currentPage > 1 && (
                <Button onClick={handlePrevPage} small text
                    className={cx('btn-pagination')}
                >
                    {'<<'}
                </Button>
            )}
            {pagesNumberShowed.map((number) => (
                <Button
                    key={number}
                    className={cx('btn-pagination', 'mx-2', {
                        'active': currentPage === number
                    })}
                    small text
                    onClick={handleChangePage}
                >
                    {number}
                </Button>
            ))}
            {
                pagesNumberShowed.length > 0 &&
                pagesNumberShowed[pagesNumberShowed.length - 1] < totalPages &&
                <span className='threedots'>....</span>
            }
            {currentPage < totalPages && (
                <Button onClick={handleNextPage} small text
                    className={cx('btn-pagination')}
                >
                    {'>>'}
                </Button>
            )}
        </div>
    );
};

export default memo(Pagination);