import { useEffect, useState, useRef, memo } from "react";
import classmames from 'classnames/bind';
import propTypes from 'prop-types';

import { useDebounce } from '~/hooks';
import { SearchIcon, XCircleCloseIcon, ChevronDownIcon } from '~/components/Icon';
import styles from './Select.module.scss';

const cx = classmames.bind(styles);
const Select = ({
    options = [], className = '', onChange, name, placeholder, initValue = '',
    ...props
}) => {

    const inputRef = useRef(null);
    const selectRef = useRef(null);
    const dropListRef = useRef(null);
    const closeIconRef = useRef(null);
    const closeIconChildrenRef = useRef(null);
    const searchIconRef = useRef(null);
    const arowDownRef = useRef(null);

    const [dropListShow, setDropListShow] = useState(options);
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const debounceSearch = useDebounce(searchValue);
    const [valueSelected, setValueSelected] = useState('');


    const handleChangeOption = (e) => {
        e.stopPropagation();
        let label = e.target.innerText;
        let value = e.target.getAttribute('data-value');
        searchIconRef.current.classList.add(cx('hidden'));
        arowDownRef.current.classList.remove(cx('hidden'));
        closeIconRef.current.classList.add(cx('hidden'));
        setValueSelected(label);
        setSearchValue(label);
        onChange(value)
        setIsOpen(false);
    }

    useEffect(() => {
        setDropListShow(options);
    }, [options])

    // handle fillter options by searchValue
    useEffect(() => {
        if (!debounceSearch || valueSelected === debounceSearch.trim())
            return setDropListShow(options);
        const optionsSearch = options.filter((option) =>
            option?.label.toLowerCase().includes(debounceSearch.trim().toLowerCase())
        )
        setDropListShow(optionsSearch);
    }, [options, debounceSearch, valueSelected])


    // handle active option selected
    useEffect(() => {
        let check = false;
        const eOptions = selectRef.current.querySelectorAll(`.${cx('select-dropList-item')}`);
        for (let i = 0; i < eOptions.length; i++) {
            let valueCheck = eOptions[i].getAttribute('data-value');
            let label = eOptions[i].innerText;
            if (valueCheck === initValue) {
                check = true;
                setSearchValue(label);
                setValueSelected(label);
                return;
            }
            eOptions[i].classList.remove(cx('active'));
        }
        if (!check) {
            setSearchValue('');
            setValueSelected('');
        }
    }, [options, initValue])

    // handle close drop list when clicked outside of drop list
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                e.target === selectRef.current || e.target === inputRef.current ||
                e.target === dropListRef.current
            )
                return;

            if (e.target === closeIconChildrenRef.current) {
                searchIconRef.current.classList.add(cx('hidden'));
                arowDownRef.current.classList.add(cx('hidden'));
                closeIconRef.current.classList.remove(cx('hidden'));
                setSearchValue('');
                return;
            }

            searchIconRef.current.classList.add(cx('hidden'));
            arowDownRef.current.classList.remove(cx('hidden'));
            closeIconRef.current.classList.add(cx('hidden'));
            setDropListShow(options);
            setSearchValue(valueSelected);
            setIsOpen(false);
        }
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        }
    }, [options, valueSelected])

    return (
        <div className={cx('select', className)}
            ref={selectRef}
            onClick={() => {
                setIsOpen(true);
                searchIconRef.current.classList.remove(cx('hidden'));
                arowDownRef.current.classList.add(cx('hidden'));
                closeIconRef.current.classList.add(cx('hidden'));
            }}
        >
            <input className={cx('select-input')}
                ref={inputRef}
                name={name}
                value={searchValue}
                placeholder={valueSelected ? valueSelected : placeholder}
                autoComplete="off"
                onChange={(e) => {
                    e.preventDefault();
                    searchIconRef.current.classList.add(cx('hidden'));
                    arowDownRef.current.classList.add(cx('hidden'));
                    closeIconRef.current.classList.remove(cx('hidden'));
                    setIsOpen(true);
                    setSearchValue(e.target.value);
                }}
            />
            <div className={cx('select-dropList-container', {
                hidden: !isOpen
            })}
            >
                {dropListShow.length ?
                    <ul
                        className={cx('select-dropList')}
                        ref={dropListRef}
                    >
                        {dropListShow.map((option, index) => {
                            return (
                                <li className={cx('select-dropList-item', {
                                    active: initValue === option.value
                                })}
                                    id="dropListItem"
                                    key={index}
                                    onClick={handleChangeOption}
                                    data-value={option?.value}
                                >
                                    {option?.label}
                                </li>
                            )
                        })}
                    </ul>
                    :
                    <div className={cx('select-dropList', 'empty')}>
                        Trống
                    </div>
                }
            </div>
            <span className={cx('select-icon', 'hidden', 'select-icon-close')} ref={closeIconRef}>
                <XCircleCloseIcon width='16px' height='16px' ref={closeIconChildrenRef} />
            </span>
            <span className={cx('select-icon', 'hidden', 'select-icon-search')} ref={searchIconRef}>
                <SearchIcon width='16px' height='16px' />
            </span>
            <span className={cx('select-icon', 'select-icon-arr')} ref={arowDownRef}>
                <ChevronDownIcon width='16px' height='16px' />
            </span>
        </div >
    );
};

Select.propTypes = {
    options: propTypes.array.isRequired,
    className: propTypes.string,
    onChange: propTypes.func.isRequired,
    name: propTypes.string.isRequired,
    placeholder: propTypes.string.isRequired,
    initValue: propTypes.string
}

export default memo(Select);