import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './HomePage.module.scss';
import { CheckIcon, SearchIcon } from '~/components/Icon';
import { ModalLookupProfile, ModalResultAdmission } from '~/components';

function HomePage() {
    const [showModal, setShowModal] = useState(false);
    const [showResult, setShowResult] = useState(false);
    
 
    
    return (
        <>
            <div id="main">
                <div className={styles.login}>
                    {/* left */}
                    <div className={styles.login__left}>
                        <div className={styles.logo__modal}>
                            <div className={styles.login__logo}></div>
                            <div className={styles.logo__title}>
                                <h3 className={styles.logo__title_name}>
                                    TRƯỜNG CAO ĐẲNG HÀ NỘI
                                    <br />
                                    <span> HANOI COLLEGE</span>
                                </h3>
                                <p className={styles.schoolCode}>
                                    Mã trường: <span>CDD0147</span>
                                </p>
                            </div>
                            <div className={styles.logo__btn}>
                                <Link to="/nophosoxettuyen" style={{ textDecoration: 'none' }}>
                                    <div className={styles.logo__btn_children}>
                                        <div className={styles.logo__btn_icon}></div>

                                        <p className={styles.logo__btn_name}>Nộp hồ sơ trực tuyến</p>
                                    </div>
                                </Link>
                            </div>

                            <div className={styles.logo__search}>
                                <div className={styles.logo__search_left} onClick={() => setShowModal(true)}>
                                    <div className={styles.logo__search_iconleft}>
                                        <SearchIcon style={{ fontSize: '30px' }} />
                                    </div>
                                    <div className={styles.logo__search_nameleft}>
                                        Tra cứu hồ sơ
                                        <br /> đã nộp
                                    </div>
                                </div>
                                <div className={styles.logo__check_right} onClick={() => setShowResult(true)}>
                                    <div className={styles.logo__check_iconright}>
                                        <CheckIcon style={{ fontSize: '30px' }} />
                                    </div>
                                    <div className={styles.logo__check_nameright} onClick={() => setShowResult(true)}>
                                        Tra cứu kết quả <br /> xét tuyển
                                    </div>
                                </div>
                            </div>

                            <div className={styles.logo__description}>
                                <h3 className={styles.desription__school}>
                                    <a href="https://caodanghanoi.edu.vn/">Trường Cao Đẳng Hà Nội</a>
                                </h3>
                                <p className={styles.description__name}>©2024 Developed by HPC - v1.0</p>
                            </div>
                        </div>
                    </div>

                    {/* right */}
                    <div className={styles.login__right}></div>
                </div>
            </div>
            <ModalLookupProfile isvisible={showModal} onClose={() => setShowModal(false)} />
            <ModalResultAdmission result={showResult} onClose={() => setShowResult(false)}  />
            
        </>
    );
}
export default HomePage;
