import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ModaLookupProfile.module.scss';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getDetailProfileClientService } from '~/services'

function ModaLookupProfile({ isvisible, onClose }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);

  // click ra ngoài thì  modal đóng
  const handleClick = (e) => {
    if (e.target.id === "wrapper") return onClose();
  };

  const handleApi = async (value) => {
    const res = await getDetailProfileClientService(value);
    if (res.message === "Không tìm thấy hồ sơ") {
      setErrors(res.message);
    } else {
      navigate("/tracuuhoso/" + res.data.MaHoSo);
    }
  };

  const isvalideNumber = (phone) => {
    const phoneRegex = /^0[0-9]{9}$/;
    if (phoneRegex.test(phone)) {
      handleApi(phone);
    } else {
      setErrors("SĐT không hợp lệ!");
    }
  };

  const isvalideCCCD = (cccd) => {
    const cccdRegex = /^[0-9]{12}$/;
    if (cccdRegex.test(cccd)) {
      handleApi(cccd);
    } else {
      setErrors("CCCD không hợp lệ!");
    }
  };

  const isvalideMahoso = (mahoso) => {
    const mahosoRegex = /^[0-9]{8}$/;
    if (mahosoRegex.test(mahoso)) {
      handleApi(mahoso);
    } else {
      setErrors("Mã hồ sơ không hợp lệ!");
    }
  };

  const isvalideEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      handleApi(email);
    } else {
      setErrors("Email không hợp lệ!");
    }
  };
  const handleSubmit = async (values) => {
    if (!values.inputValue) {
      setErrors("Vui lòng nhập thông tin!");
      return;
    }

    if (values.select === "email") {
      isvalideEmail(values.inputValue);
    } else if (values.select === "cccd") {
      isvalideCCCD(values.inputValue);
    } else if (values.select === "phonenumber") {
      isvalideNumber(values.inputValue);
    } else if (values.select === "mahoso") {
      isvalideMahoso(values.inputValue);
    }
  };

  const formik = useFormik({
    initialValues: {
      select: "phonenumber",
      inputValue: "",
    },
    validationSchema: Yup.object({}),
    onSubmit: handleSubmit,
  });

  const handleOnchange = (e) => {
    setErrors(null);
  };

  if (!isvisible) return null;
  return (
    <>
      <div className={styles.modal} id="wrapper" onClick={handleClick}>
        <div className={styles.modal__container}>
          {/* navbar */}
          <div className={styles.modal__container_nav}>
            <h3 className={styles.modal__nav_title}>
              Tra cứu thông tin hồ sơ đã nộp
            </h3>
            <button
              className={styles.modal__nav_close}
              onClick={() => onClose()}
            >
              &times;
            </button>
          </div>
          <div className={styles.modal__nav_line}></div>
          <form
            className={styles.modal__search}
            method="POST"
            onSubmit={formik.handleSubmit}
          >
            <div className={styles.modal__search_container}>
              <select
                values={formik.values.select}
                onChange={(e) => {
                  formik.handleChange(e);
                  handleOnchange(e);
                }}
                name="select"
                id="searchType"
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "0.4rem",
                  padding: "0.4rem 0.6rem",
                  cursor: "pointer",
                }}
              >
                <option selected value="phonenumber">
                  Số điện thoại
                </option>
                <option value="mahoso">Mã hồ sơ</option>
                <option value="email">Email</option>
                <option value="cccd">Số CCCD</option>
              </select>

              <input
                type="text"
                name="inputValue"
                placeholder="Nhập thông tin..."
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "0.4rem",
                  padding: "0.3rem 0.3rem",
                  width: "48%",
                  position: "relative",
                }}
                className={styles.input__scholl}
                values={formik.values.inputValue}
                onChange={(e) => {
                  formik.handleChange(e);
                  handleOnchange(e);
                }}
              />
              {errors ? (
                <div className={styles.error__Lookup}>{errors}</div>
              ) : (
                <div className={styles.error__Lookup}></div>
              )}

              <button
                type="submit"
                className={styles.modal__container_button}
                style={{
                  borderRadius: "4px",
                  background: "#128080",
                  padding: "0.4rem 1.6rem",
                  color: "#fff",
                  cursor: "pointer",
                  marginBottom: "2px",
                  marginTop: "4px",
                }}
              >
                Tra cứu
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ModaLookupProfile;
