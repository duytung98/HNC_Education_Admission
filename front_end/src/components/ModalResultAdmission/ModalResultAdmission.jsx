import React, { useState } from "react";
import styles from "../ModaLookupProfile/ModaLookupProfile.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import Recruitment from "../Recruitment/Recruitment";
import ToastMessger from "../ToastMessger/ToastMessger";
import { getDetailProfileClientService } from "~/services";

function ModalResultAdmission({ result, onClose }) {
  // modal kết quả của tra cứu kết quả xét tuyển
  const [showRecruitment, setShowRecruitment] = useState(false);

  const [info, setInfo] = useState({});

  // toast messages không hợp lệ
  const [showToast, setShowToast] = useState(false);

  // trạng thái của toast message
  const [loader, setShowLoader] = useState(false);

  const handleSubmit = async (values, { resetForm, setErrors }) => {
    // Định nghĩa schema Yup để kiểm tra lỗi
    const validationSchema = Yup.object({
      selectForm: Yup.string().required("Chọn lại thông tin"),
      inputForm: Yup.lazy((selectForm) => {
        switch (values.selectForm) {
          case "SDT":
            return Yup.string()
              .matches(/^[0-9]{10}$/, {
                message: "SĐT không hợp lệ!",
                excludeEmptyString: true,
              })
              .required("Nhập lại SĐT");
          case "Email":
            return Yup.string()
              .email("Email không hợp lệ!")
              .required("Nhập lại Email!");
          case "CCCD":
            return Yup.string()
              .matches(/^\d{12}$/, "CCCD không hợp lệ!")
              .required("Nhập lại CCCD!");
          case "MaHoSo":
            return Yup.string()
              .matches(/^\d{7,8}$/, {
                message: "Mã hồ sơ không hợp lệ!",
                excludeEmptyString: true,
              })
              .required("Nhập lại mã hồ sơ");
          default:
            return Yup.string().required("Nhập lại thông tin!");
        }
      }),
    });

    try {
      // Sử dụng hàm validateSync của Yup để kiểm tra lỗi
      validationSchema.validateSync(values, { abortEarly: false });
      setShowLoader(true);

      // Gửi yêu cầu API và lấy dữ liệu
      const data = await getDetailProfileClientService(values?.inputForm);
      setInfo(data);
      if (data.message === "Không tìm thấy hồ sơ") {
        setShowToast(true);
        setShowLoader(false);

        setTimeout(() => {
          setShowToast(false);
        }, 1600);
      } else {
        setShowLoader(true);
        setTimeout(() => {
          setShowLoader(false);
        }, 10);
        setShowRecruitment(true);
      }
    } catch (error) {
      // Nếu có lỗi validate, hiển thị Toast và setErrors nếu cần
      const errors = {};
      error.inner.forEach((validationError) => {
        errors[validationError.path] = validationError.message;
      });

      setErrors(errors); // Set errors của Formik
      // setShowToast(false); // Hiển thị Toast chỉ khi có lỗi validate
      setTimeout(() => {
        setShowToast(false);
      }, 1500);
    }
  };

  const formik = useFormik({
    initialValues: {
      selectForm: "SDT",
      inputForm: "",
    },
    onSubmit: handleSubmit,
  });

  // kiểm tra prop result có rỗng không
  if (!result) return null;

  // hàm xử lý tắt modal
  const handleClick = (e) => {
    if (e.target.id === "result") return onClose();
  };

  return (
    <>
      <div className={styles.modal} id="result" onClick={handleClick}>
        <div className={styles.modal__container}>
          <div className={styles.modal__container_nav}>
            <h3 className={styles.modal__nav_title}>
              Tra cứu kết quả xét tuyển
            </h3>
            <button
              className={styles.modal__nav_close}
              onClick={() => onClose()}
            >
              &times;
            </button>
          </div>

          <div className={styles.modal__nav_line}></div>
          {/* search */}
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.modal__search}>
              <div className={styles.modal__search_container}>
                {/* select */}
                <select
                  values={formik.values.selectForm}
                  onChange={formik.handleChange}
                  name="selectForm"
                  id="searchType"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "0.4rem",
                    padding: "0.4rem 0.6rem",
                    cursor: "pointer",
                  }}
                >
                  <option value="SDT">Số điện thoại</option>
                  <option value="MaHoSo">Mã hồ sơ</option>
                  <option value="Email">Email</option>
                  <option value="CCCD">Số CCCD</option>
                </select>

                {/* input */}
                <input
                  type="text"
                  name="inputForm"
                  placeholder="Nhập thông tin..."
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "0.4rem",
                    padding: "0.3rem 0.3rem",
                    width: "48%",
                    position: "relative",
                  }}
                  className={styles.input__placeholder}
                  values={formik.values.inputForm}
                  onChange={formik.handleChange}
                />
                {formik.touched.inputForm && formik.errors.inputForm && (
                  <div className={styles.error__info}>
                    {formik.errors.inputForm}
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.modal__container_button}
                  style={{
                    borderRadius: "4px",
                    background: "#128080",
                    padding: "0.4rem 0.6rem",
                    color: "#fff",
                    marginBottom: "2px",
                    marginTop: "4px",
                  }}
                >
                  Tra cứu
                </button>
              </div>

              {/* Hiển thị loader */}
              {loader && (
                <div>
                  <div className={styles.loader}></div>
                  <h1 className="text-center text-[#128080] font-medium text-[20px] ">
                    Hệ thống đang xử lý
                  </h1>
                </div>
              )}
              {/* Hiển thị modal Recruitment nếu không có lỗi validate */}
              {showRecruitment && (
                <Recruitment
                  reasultModal={showRecruitment}
                  dataResult={info}
                  onClose={() => setShowRecruitment(false)}
                />
              )}
            </div>
          </form>
        </div>
      </div>
      {/* hiển thị toast mess */}
      {showToast && (
        <ToastMessger show={showToast} onClose={() => setShowToast(false)} />
      )}
    </>
  );
}

export default ModalResultAdmission;
