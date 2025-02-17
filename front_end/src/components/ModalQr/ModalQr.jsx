import { useEffect, useRef } from "react";
import QRCode from "qrcode";

import styles from "./ModalQr.module.scss";
import { DownloadIcon } from "../Icon";
import imgLogo from "~/assets/images/logo.png";
import imgThanhToan from "~/assets/images/thanhtoan.jpg";

function ModalQr({ maHoSo, onClose }) {
  // hàm lưu mã QR
  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.download = "MaQr";
    link.href = imgThanhToan;
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className={styles.modal} id="showModalQr">
      <div className={styles.modal__container}>
        <div className={styles.container__close} onClick={onClose}>
          &times;
        </div>

        <div className={styles.container__title}>
          <img className={styles.container__img} src={imgLogo} alt="img logo" />
          <div className={styles.right__text}>
            <h1 className={styles.container__title_text}>
              HANOI <span>COLLEGE</span>
            </h1>
            <p className={styles.container__title_text1}>
              TRƯỜNG CAO ĐẲNG HÀ NỘI
            </p>
          </div>
        </div>

        <div className={styles.title__chucmung}>
          <h3 className={styles.text}>
            CHÚC MỪNG THÍ SINH ĐÃ <br /> ĐĂNG KÝ XÉT TUYỂN THÀNH CÔNG!
          </h3>

          <div className={styles.title__thanhtoan}>
            <p className={styles.thanhtoan__lephi}>
              Để thanh toán 100.000 vnđ lệ phí xét tuyển, thí sinh <br /> chuyển
              khoản qua tài khoản của nhà trường như sau:
            </p>
          </div>
        </div>

        <div className={styles.container__img}>
          {/* <canvas ref={canvasRef} className="mt-0" /> */}
          <img
            src={imgThanhToan}
            alt="img thanh toán"
            className={styles.img__thanhtoan}
          />
        </div>

        <div className={styles.container__btn}>
          <DownloadIcon />
          <button
            className={styles.container__btn_file}
            onClick={downloadQRCode}
          >
            Lưu mã QR
          </button>
        </div>

        <div className={styles.list__nganhang}>
          <ul className={styles.nganhang__nav}>
            <li className={styles.nganhang__item}>
              Ngân hàng:
              <span className={styles.item__span}>
                TMCP Đầu tư và Phát triển Việt Nam (BIDV)
              </span>
            </li>
            <li className={styles.nganhang__item}>
              Số tài khoản:
              <span className={styles.item__span}>1992862888</span>
            </li>
            <li className={styles.nganhang__item}>
              Chủ tài khoản:
              <span className={styles.item__span}>TRƯỜNG CAO ĐẲNG HÀ NỘI</span>
            </li>
            <li className={styles.nganhang__item}>
              Nội dung chuyển khoản:
              <span className={styles.item__span}>
                Ms hoten ngaythangnamsinh
              </span>
            </li>
          </ul>
        </div>

        <div className={styles.text__footer}>
          <p className={styles.container__text}>
            Lưu ý: Sau khi chuyển khoản thành công vui lòng liên hệ <br /> GVHD
            hoặc Hotline: 0976.862.442
          </p>
        </div>
      </div>
    </div>
  );
}

export default ModalQr;
