import { useEffect, useRef } from "react";
import QRCode from "qrcode";

import styles from "./ModalQr.module.scss";
import { DownloadIcon } from "../Icon";

function ModalQr({ maHoSo, onClose }) {
  const canvasRef = useRef(null);
  const url = process.env.REACT_APP_DOMAIN + "/tracuuhoso/" + maHoSo;

  useEffect(() => {
    QRCode.toCanvas(canvasRef.current, url, { width: 300, hight: 300 });
  }, [url])

  // hàm lưu mã QR
  const downloadQRCode = async () => {
    const qrDataURL = await QRCode.toDataURL(url);
    const response = await fetch(qrDataURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/force-download'
      }
    });
    const blobImage = await response.blob();
    const href = URL.createObjectURL(blobImage);

    const anchorElement = document.createElement('a');
    anchorElement.href = href;
    anchorElement.download = `sv_${maHoSo}.jpg`;

    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);

    window.URL.revokeObjectURL(href);
  };

  return (
    <div className={styles.modal} id="showModalQr">
      <div className={styles.modal__container}>
        <div className={styles.container__close} onClick={onClose}>
          &times;
        </div>
        <div className={styles.container__title}>
          <h1 className={styles.container__title_text}>Đăng ký thành công</h1>
        </div>

        <div className={styles.container__img}>
          <canvas ref={canvasRef} className="mt-0" />
        </div>

        <div className={styles.container__text}>
          <i>Lưu ý : Lưu mã Qr về máy để kiểm tra thông tin</i>
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
      </div>
    </div>
  );
}

export default ModalQr;
