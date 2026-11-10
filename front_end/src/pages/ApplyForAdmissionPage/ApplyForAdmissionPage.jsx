import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import classnames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Button, ModalAlert, Select } from "~/components";
import { formatDate, show10LastYear, capitalizeTheFirstLetter } from "~/utils";
import logoImage from "~/assets/images/logo.png";
import { ArrowUp, UploadIcon } from "~/components/Icon";
import styles from "./ApplyForAdmissionPage.module.scss";

import {
  getNationListService, getCityListService, getMajorListService, getDistrictListService,
  getCommunelistService, getCityListOfSchoolService, getDistrictListOfSchoolService,
  getSchoollistService, registerProfile,
} from "~/services";

import { createRoot } from "react-dom/client";
import ToastMessgerSignUp from "~/components/ToastMessgerSignUp/ToastMessgerSignUp";
import ModalQr from "~/components/ModalQr/ModalQr";

const cx = classnames.bind(styles);

function ApplyForAdmissionPage() {
  const navigate = useNavigate();
  // toast messages
  const [showToastSignUp, setShowToastSignUp] = useState(false);
  const [showModalQr, setShowModalQr] = useState(false);
  const [nationList, setNationList] = useState([]);

  const [cityList, setCityList] = useState([]);
  const [majors, setMajors] = useState([]);
  const [districtList, setDistrictList] = useState([]);

  const [citysOfSchool, setCitysOfSchool] = useState([]);
  const [districtsOfSchool, setDistrictsOfSchool] = useState([]);
  const [communelist, setCommunelist] = useState([]);
  const [schoolList, setSchoolList] = useState([]);

  const [maTinh, setMaTinh] = useState('');
  const [maHuyen, setMaHuyen] = useState('');
  const [maXa, setMaXa] = useState('');
  const [maTinhTHPT, setMaTinhTHPT] = useState('');
  const [MaHuyenTHPT, setMaHuyenTHPT] = useState('');
  const [TruongTHPT, setTruongTHPT] = useState(null);

  const [errors, setErrors] = useState(null);
  const [birthday, setBirthday] = useState(new Date());
  const [year, setYear] = useState(null);

  const [maHoSo, setMaHoSo] = useState(null);

  // các trường lưu trữ trong state cho back end lấy file ảnh
  const [BangKQ12, setBangKQ12] = useState([]);
  const [HocBaBia, setHocBaBia] = useState(null);
  const [ChungNhanTN, setChungNhanTN] = useState(null);
  const [ChungNhanUT, setChungNhanUT] = useState(null);

  const [exit, setExit] = useState(false);
  const [isScrollTop, setIsScrollTop] = useState(false);

  // state modal img
  const [modalImgSrc, setModalImgSrc] = useState(null);
  // lấy thẻ modal-container
  const modalContainerRef = useRef(null);

  const openModal = (imgSrc) => {
    setModalImgSrc(imgSrc);
  };

  const closeModal = () => {
    setModalImgSrc(null);
  };

  // Call api lấy danh sách dân tộc
  useEffect(() => {
    const getNationList = async () => {
      try {
        const data = await getNationListService();
        setNationList(data);
      } catch (e) {
        navigate('/500-ServerError');
      }
    };
    getNationList();
  }, [navigate]);

  // Call api lấy danh sách thành phố Việt Nam
  useEffect(() => {
    const getCityList = async () => {
      try {
        const data = (await getCityListService()) || [];
        const dataFormated = data.map((item) => {
          return {
            value: item?.ma,
            label: item?.tenDonVi
          }
        })
        setCityList(dataFormated);
      } catch (e) {
        navigate('/500-ServerError');
      }
    };
    getCityList();
  }, [navigate]);

  //Call api lấy danh sách huyện của tỉnh
  useEffect(() => {
    const getDistrictList = async () => {
      try {
        const data = (await getDistrictListService(maTinh)) || [];
        const dataFormated = data.map((item) => {
          return {
            value: item?.ma,
            label: item?.tenDonVi
          }
        })
        setDistrictList(dataFormated);
      } catch (e) {
        navigate('/500-ServerError');
      }
    };
    getDistrictList();
  }, [maTinh, navigate]);

  //Call api lấy danh sách xã của huyện
  useEffect(() => {
    const getCommunelist = async () => {
      try {
        console.log('sau khi chon tinh xong thi chay vao day')
        const data = (await getCommunelistService(maTinh)) || [];
        const dataFormated = data.map((item) => {
          return {
            value: item?.ma,
            label: item?.tenDonVi
          }
        })
        setCommunelist(dataFormated);
      } catch (e) {
        navigate('/500-ServerError');
      }
    };
    getCommunelist();
  }, [maTinh, navigate]);

  // Call api lấy danh sách thành phố của Schools
  useEffect(() => {
    const getCityList = async () => {
      try {
        const data = await getCityListOfSchoolService();
        const dataFormated = data.map((item) => {
          return {
            value: item?.maTinh,
            label: item?.tenTinhTP
          }
        })
        setCitysOfSchool(dataFormated);
      } catch (e) {
        navigate('/500-ServerError');
      }
    };
    getCityList();
  }, [navigate]);

  //Call api lấy danh sách huyện của school
  useEffect(() => {
    const getDistrictList = async () => {
      try {
        const data = (await getDistrictListOfSchoolService(maTinhTHPT)) || [];
        const dataFormated = data.map((item) => {
          return {
            value: item?.maQH,
            label: item?.tenQH
          }
        })
        setDistrictsOfSchool(dataFormated);
      } catch (e) {
        navigate('/500-ServerError');
      }
    };
    getDistrictList();
  }, [maTinhTHPT, navigate]);

  //Call api lấy danh sách school
  useEffect(() => {
    const getSchoolList = async () => {
      try {
        const data = (await getSchoollistService(maTinhTHPT, MaHuyenTHPT)) || [];
        const dataFormated = data.map((item) => {
          return {
            value: JSON.stringify({
              ma: item?.ma,
              TenTruong: item?.tenTruong,
              khuVucUT: item?.khuVuc
            }),
            label: item?.tenTruong
          }
        })
        setSchoolList(dataFormated);
      } catch (e) {
        navigate('/500-ServerError');
      }
    };
    getSchoolList();
  }, [maTinhTHPT, MaHuyenTHPT, navigate]);

  // call api lấy danh sách ngành học
  useEffect(() => {
    const getMajorLis = async () => {
      try {

        const data = await getMajorListService();
        setMajors(data);
      } catch (e) {
        navigate('/500-ServerError');
      }
    };
    getMajorLis();
  }, [navigate]);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    let date = formatDate(birthday);
    let paths = date.split('/');
    let NgayThangNamSinh = paths[2] + '-' + paths[1] + '-' + paths[0];
    formData.append('NgayThangNamSinh', NgayThangNamSinh);
    formData.append('KhuVucUT', TruongTHPT?.khuVucUT);

    let HoDem = capitalizeTheFirstLetter(formik.values.HoDem);
    let Ten = capitalizeTheFirstLetter(formik.values.Ten);
    formData.append('HoDem', HoDem);
    formData.append('Ten', Ten);

    for (const image of BangKQ12) {
      formData.append("BangKQ12[]", image);
    }
    if (ChungNhanTN) {
      formData.append("ChungNhanTN", ChungNhanTN);
    }
    if (ChungNhanUT) {
      formData.append("ChungNhanUT", ChungNhanUT);
    }
    if (HocBaBia) {
      formData.append("HocBaBia", HocBaBia);
    }
    const res = await registerProfile(formData);
    if (res?.errors) {
      setShowToastSignUp(true);
      setTimeout(() => {
        setShowToastSignUp(false);
      }, 1500);

      setErrors({
        ...errors,
        NgaySinh: res?.errors?.NgayThangNamSinh,
        HocBaBia: res?.errors?.HocBaBia,
        ChungNhanTN: res?.errors?.ChungNhanTN,
        ChungNhanUT: res?.errors?.ChungNhanUT,
        'BangKQ12.0': res?.errors?.['BangKQ12.0'],
        'BangKQ12.1': res?.errors?.['BangKQ12.1'],
      });
      formik.errors.CCCD = res?.errors.CCCD;
      formik.errors.Email = res?.errors.Email;
      formik.errors.SDT = res?.errors.SDT;
      formik.errors.MaTinh = res?.errors.MaTinh;
      // formik.errors.MaQuanHuyen = res?.errors.MaQuanHuyen;
      formik.errors.MaPhuongXa = res?.errors.MaPhuongXa;
      formik.errors.DiaChi = res?.errors.DiaChi;
      formik.errors.MaTinhTruong = res?.errors.MaTinhTruong;
      formik.errors.MaQuanHuyenTruong = res?.errors.MaQuanHuyenTruong;
      formik.errors.TenTruong = res?.errors.TenTruong;
      formik.errors.DiemTB10 = res?.errors.DiemTB10;
      formik.errors.DiemTB11 = res?.errors.DiemTB11;
      formik.errors.DiemKHI12 = res?.errors.DiemKHI12;
      return;
    }
    setMaHoSo(res?.code);
    formik.resetForm();
    setShowModalQr(true);
  };
  const formik = useFormik({
    initialValues: {
      HoDem: "",
      Ten: "",
      CCCD: "",
      Email: "",
      DiaChi: "",
      GioiTinh: "Nam",
      DanToc: "Kinh",
      SDT: "",
      MaTinh: '',
      // MaQuanHuyen: '',
      MaPhuongXa: '',
      MaTinhTruong: '',
      MaQuanHuyenTruong: '',
      TenTruong: '',
      NamTotNghiep: "",
      DoiTuongUT: "",
      HinhThuc: "",
      Nganh_ID: "",
      DiemTB10: "",
      DiemTB11: "",
      DiemHKI12: "",
    },
    validationSchema: Yup.object({
      NamTotNghiep: Yup.string().required("Vui lòng chọn thông tin!"),
      HoDem: Yup.string().required("Vui lòng nhập thông tin!"),
      Nganh_ID: Yup.string().required("Vui lòng chọn thông tin!"),
      Ten: Yup.string().required("Vui lòng nhập thông tin!"),
      DiaChi: Yup.string().required("Vui lòng nhập thông tin!"),
      CCCD: Yup.string().required('Vui lòng nhập thông tin!')
        .matches(/^\d{12}$/, 'CCCD không hợp lệ!'),
      Email: Yup.string()
        .required("Vui lòng nhập thông tin!")
        .email("Email không hợp lệ")
        .max(255, "Email quá dài!"),
      SDT: Yup.string()
        .required('Vui lòng nhập thông tin!')
        .matches(/^[0][0-9]{9}$/, 'Số điện thoại không hợp lệ!'),
      MaTinh: Yup.string().required('Vui lòng chọn thông tin!'),
      // MaQuanHuyen: Yup.string().required('Vui lòng chọn thông tin!'),
      MaPhuongXa: Yup.string().required('Vui lòng chọn thông tin!'),
      MaTinhTruong: Yup.string().required('Vui lòng  chọn thông tin!'),
      MaQuanHuyenTruong: Yup.string().required('Vui lòng chọn thông tin!'),
      HinhThuc: Yup.string().required('Vui lòng chọn thông tin!'),
      TenTruong: Yup.string().required('Vui lòng chọn thông tin!'),
      DiemTB10: Yup.string().required("Vui lòng nhập điểm"),
      DiemTB11: Yup.string().required("Vui lòng nhập điểm"),
      DiemHKI12: Yup.string().required("Vui lòng nhập điểm"),
    }),
    onSubmit: handleSubmit,
  });

  // chức năng xử lý scroll to top
  useEffect(() => {
    window.addEventListener("scroll", toggleScrollTop);
  }, []);

  // điều kiện scroll hiện
  const toggleScrollTop = () => {
    if (window.scrollY > 600) {
      setIsScrollTop(true);
    } else {
      setIsScrollTop(false);
    }
  };

  // hàm updal img
  const handleUploadImages = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const element = e.target;
    const type = element?.name;
    const files = Array.from(element.files);
    const eParent = element.parentNode;
    const eImgContainer = eParent.querySelector("#img-container");

    // kiểm tra quá số file upload
    if (files.length > 2) {
      alert("Tải quá số file quy định");
      return;
    }

    switch (type) {
      case "BangKQ12":
        errors && (errors['BangKQ12.0'] = '');
        errors && (errors['BangKQ12.1'] = '');
        setBangKQ12(files);
        break;
      case "HocBaBia":
        errors && (errors.HocBaBia = '');
        setHocBaBia(files[0]);
        break;
      case "ChungNhanTN":
        errors && (errors.ChungNhanTN = '');
        setChungNhanTN(files[0]);
        break;
      case "ChungNhanUT":
        errors && (errors.ChungNhanUT = '');
        setChungNhanUT(files[0]);
        break;
      default:
    }

    const images = [];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const img_src = await readFile(file);

      const imgElement = (
        <img
          key={index}
          src={img_src}
          className={cx("content-images-item")}
          onClick={() => openModal(img_src)}
          alt={`img_${index}`}
        />
      );

      images.push(imgElement);
    }

    const root = createRoot(eImgContainer);
    root.render(<>{images}</>);
  };

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (
        modalContainerRef.current &&
        !modalContainerRef.current.contains(e.target)
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);

    //Clean up
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  const handleShowNamTotNghiep = () => {
    const date = new Date();
    const currentYear = date.getFullYear();
    return show10LastYear(formik.values.NamTotNghiep, currentYear)
  }

  return (
    <React.Fragment>
      <div className={cx("detail-admission")}>
        <header className={cx("header", "flex")}>
          <div className={cx("header-logo")}>
            <div className={cx("header-logo-img", "flex justify-center")}>
              <Link to="/" className={cx("header-logo-link")}>
                <img src={logoImage} alt="logo" />
              </Link>
            </div>
            <div className={cx("header-brand")}>
              <h3 className={cx("header-brand-subtitle", "text-center")}>
                BỘ GIÁO DỤC VÀ ĐÀO TẠO
              </h3>
              <h3 className={cx("header-brand-title", "text-center")}>
                TRƯỜNG CAO ĐẲNG HÀ NỘI
              </h3>
            </div>
          </div>
          <div
            className={cx("header-title", "flex items-center justify-center")}
          >
            <h2 className={cx("header-title-text", "text-center uppercase")}>
              Nộp hồ sơ trực tuyến
            </h2>
          </div>
        </header>
        <main className={cx("content")}>
          <form className={cx('form-applyAdmission')}>
            <div className={cx("content-item")}>
              <div className={cx("content-item-title", "flex items-center")}>
                <span className={cx("flex-1")}></span>
                <h4 className={cx("content-item-text", "ml-2 uppercase")}>
                  Thông tin thí sinh
                </h4>
                <span className={cx("flex-1")}></span>
              </div>
              <div className={cx("content-container", "container")}>
                <div className={cx("content-container-item")}>
                  <div className={cx("content-name")}>
                    <div className={cx("content-infor", "content-firstName")}>
                      <label
                        htmlFor="HoDem"
                        className={cx("content-item-label")}
                      >
                        <span className={cx("text-red-600 mr-1")}>*</span>
                        Họ đệm
                      </label>
                      <input
                        type="text"
                        name="HoDem"
                        id="HoDem"
                        autoComplete="off"
                        placeholder="Nhập vào họ đệm"
                        className={cx("content-item-input")}
                        value={formik.values.HoDem}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.HoDem && formik.touched.HoDem ? (
                        <p className={cx("message")}>{formik.errors.HoDem}</p>
                      ) : (
                        <p className={cx("message")}> </p>
                      )}
                    </div>
                    <div className={cx("content-infor", "content-lastName")}>
                      <label htmlFor="Ten" className={cx("content-item-label")}>
                        <span className={cx("text-red-600 mr-1")}>*</span>
                        Tên
                      </label>
                      <input
                        type="text"
                        name="Ten"
                        id="Ten"
                        autoComplete="off"
                        placeholder="Nhập vào tên"
                        className={cx("content-item-input")}
                        value={formik.values.Ten}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.Ten && formik.touched.Ten ? (
                        <p className={cx("message")}>{formik.errors.Ten}</p>
                      ) : (
                        <p className={cx("message")}> </p>
                      )}
                    </div>
                  </div>

                  {/* ngày sinh */}
                  <div className={cx("content-infor", "content-birthday")}>
                    <label
                      htmlFor="NgaySinh"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Ngày sinh
                    </label>
                    <DatePicker
                      selected={birthday}
                      name="NgayThangNamSinh"
                      showMonthDropdown
                      showYearDropdown
                      dateFormat="dd/MM/yyyy"
                      dropdownMode="select"
                      className={cx("content-item-input")}
                      placeholderText="dd/MM/YYYY"
                      onChange={(date) => {
                        setBirthday(date);
                      }}
                    />

                    {errors?.NgaySinh ? (
                      <p className={cx("message")}>Vui lòng nhập thông tin</p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>
                  <div className={cx("content-gioiTinhAndDanToc")}>
                    <div className={cx("content-infor", "content-grender")}>
                      <label
                        htmlFor="GioiTinh"
                        className={cx("content-item-label")}
                      >
                        <span className={cx("text-red-600 mr-1")}>*</span>
                        Giới tính
                      </label>
                      <select
                        name="GioiTinh"
                        id="GioiTinh"
                        value={formik.values?.GioiTinh}
                        className={cx("content-item-input")}
                        onChange={formik.handleChange}
                      >
                        <option
                          value="Nam"
                          selected={formik.values.GioiTinh === "Nam"}
                        >
                          Nam
                        </option>
                        <option
                          value="Nữ"
                          selected={formik.values.GioiTinh === "Nữ"}
                        >
                          Nữ
                        </option>
                      </select>
                      <p className={cx("message")}> </p>
                    </div>

                    {/* dân tộc */}
                    <div className={cx("content-infor", "content-dantoc")}>
                      <label
                        htmlFor="DanToc"
                        className={cx("content-item-label")}
                      >
                        <span className={cx("text-red-600 mr-1")}>*</span>
                        Dân tộc
                      </label>
                      <select
                        name="DanToc"
                        id="DanToc"
                        value={formik.values?.DanToc}
                        className={cx("content-item-input")}
                        onChange={formik.handleChange}
                      >
                        {nationList.map((nation) => {
                          return (
                            <option
                              key={nation.ma}
                              value={nation.tenDanToc}
                              selected={
                                nation.tenDanToc === formik.values.DanToc
                              }
                            >
                              {nation.tenDanToc}
                            </option>
                          );
                        })}
                      </select>
                      {formik.errors.DanToc && formik.touched.DanToc ? (
                        <p className={cx("message")}>{formik.errors.DanToc}</p>
                      ) : (
                        <p className={cx("message")}> </p>
                      )}
                    </div>
                  </div>

                  {/* chứng minh căn cước công dân */}
                  <div className={cx("content-infor", "content-CCCD")}>
                    <label htmlFor="CCCD" className={cx("content-item-label")}>
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Nhập vào CMND/CCCD
                    </label>
                    <input
                      type="text"
                      name="CCCD"
                      id="CCCD"
                      autoComplete="off"
                      placeholder="Nhập vào CMND/CCCD"
                      className={cx("content-item-input")}
                      value={formik.values.CCCD}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.CCCD && formik.touched.CCCD ? (
                      <p className={cx("message")}>{formik.errors.CCCD}</p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>

                  {/* email */}
                  <div className={cx("content-infor", "content-email")}>
                    <label htmlFor="Email" className={cx("content-item-label")}>
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Email
                    </label>
                    <input
                      type="text"
                      name="Email"
                      id="Email"
                      autoComplete="off"
                      placeholder="Nhập vào địa chỉ email"
                      className={cx("content-item-input")}
                      value={formik.values.Email}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.Email && formik.touched.Email ? (
                      <p className={cx("message")}>{formik.errors.Email}</p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>

                  {/* số điện thoại */}
                  <div className={cx("content-infor", "content-phone")}>
                    <label htmlFor="SDT" className={cx("content-item-label")}>
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      name="SDT"
                      id="Email"
                      autoComplete="off"
                      placeholder="Nhập vào số điện thoại"
                      className={cx("content-item-input")}
                      value={formik.values.SDT}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.SDT && formik.touched.SDT ? (
                      <p className={cx("message")}>{formik.errors.SDT}</p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>
                </div>
                <div className={cx("content-container-item", "content-full", "mt-6")}
                >
                  <div className={cx("content-infor", "content-hometown")}>
                    <label htmlFor="Tinh" className={cx("content-item-label")}>
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Hộ khẩu thường trú
                    </label>
                    <div className={cx("content-full-item", "content-grid-item-2")}>
                      <div className={cx('content-howtel-tinh', 'content-input-select')}>
                        <Select
                          options={cityList}
                          className={cx('content-item-input')}
                          name='MaTinh'
                          initValue={maTinh}
                          onChange={(value) => {
                            setMaHuyen('');
                            setMaXa('');
                            formik.values.MaTinh = value;
                            // formik.values.MaQuanHuyen = '';
                            formik.values.MaPhuongXa = '';
                            if (value)
                              formik.errors.MaTinh = '';
                            setMaTinh(value);
                          }}
                          placeholder='Chọn Tỉnh / Thành Phố'
                        />
                        {formik.errors.MaTinh && formik.touched.MaTinh ? (
                          <p className={cx("message")}>
                            {formik.errors.MaTinh}
                          </p>
                        ) : (
                          <p className={cx("message")}> </p>
                        )}
                      </div>
                      {/* <div className={cx("content-howtel-huyen")}>
                        <Select
                          options={districtList}
                          className={cx('content-item-input', 'content-input-select')}
                          name='MaQuanHuyen'
                          initValue={maHuyen}
                          onChange={(value) => {
                            setMaXa('');
                            formik.values.MaQuanHuyen = value;
                            formik.values.MaPhuongXa = '';
                            if (value)
                              formik.errors.MaQuanHuyen = '';
                            setMaHuyen(value);
                          }}
                          placeholder='Chọn Quận / Huyện'
                        />
                        {formik.errors.MaQuanHuyen &&
                          formik.touched.MaQuanHuyen ? (
                          <p className={cx("message")}>
                            {formik.errors.MaQuanHuyen}
                          </p>
                        ) : (
                          <p className={cx("message")}> </p>
                        )}
                      </div> */}
                      <div className={cx("content-howtel-xa")}>
                        <Select
                          options={communelist}
                          className={cx('content-item-input', 'content-input-select')}
                          name='MaPhuongXa'
                          initValue={maXa}
                          onChange={(value) => {
                            formik.values.MaPhuongXa = value;
                            if (value)
                              formik.errors.MaPhuongXa = '';
                            setMaXa(value)
                          }}
                          placeholder='Chọn Xã / Phường'
                        />
                        {formik.errors.MaPhuongXa &&
                          formik.touched.MaPhuongXa ? (
                          <p className={cx("message")}>
                            {formik.errors.MaPhuongXa}
                          </p>
                        ) : (
                          <p className={cx("message")}> </p>
                        )}
                      </div>
                    </div>
                    <div
                      className={cx(
                        "content-infor",
                        "content-howtel-address",
                        "mt-6"
                      )}
                    >
                      <input
                        type="text"
                        name="DiaChi"
                        id="address"
                        autoComplete="off"
                        placeholder="Nhập vào địa chỉ nhận thư báo trúng tuyển"
                        className={cx("content-item-input")}
                        value={formik.values.DiaChi}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.DiaChi && formik.touched.DiaChi ? (
                        <p className={cx("message")}>{formik.errors.DiaChi}</p>
                      ) : (
                        <p className={cx("message")}> </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={cx("content-item")}>
              <div className={cx("content-item-title", "flex items-center")}>
                <span className={cx("flex-1")}></span>
                <h4 className={cx("content-item-text", "ml-2 uppercase")}>
                  Quá trình học tập
                </h4>
                <span className={cx("flex-1")}></span>
              </div>
              <div className={cx("content-container", "container")}>
                <div className={cx("content-container-item")}>
                  <div className={cx("content-infor")}>
                    <label
                      htmlFor="thpt/thanhphp"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Thành phố / Tỉnh
                    </label>
                    <Select
                      options={citysOfSchool}
                      className={cx('content-item-input')}
                      name='MaTinhTruong'
                      initValue={maTinhTHPT}
                      onChange={(value) => {
                        formik.values.MaTinhTruong = value;
                        formik.values.MaQuanHuyenTruong = '';
                        formik.values.TenTruong = '';
                        if (value)
                          formik.errors.MaTinhTruong = '';
                        setMaHuyenTHPT('');
                        setTruongTHPT(null);
                        setMaTinhTHPT(value);
                      }}
                      placeholder='Chọn Tỉnh / Thành Phố'
                    />

                    {formik.errors.MaTinhTruong &&
                      formik.touched.MaTinhTruong ? (
                      <p className={cx("message")}>
                        {formik.errors.MaTinhTruong}
                      </p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>
                  <div className={cx("content-infor")}>
                    <label
                      htmlFor="thpt/huyen"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Xã / Phường
                    </label>
                    <Select
                      options={districtsOfSchool}
                      className={cx('content-item-input', 'content-input-select')}
                      name='MaQuanHuyenTruong'
                      initValue={MaHuyenTHPT}
                      onChange={(value) => {
                        formik.values.MaQuanHuyenTruong = value;
                        formik.values.TenTruong = '';
                        if (value)
                          formik.errors.MaQuanHuyenTruong = '';
                        setTruongTHPT(null);
                        setMaHuyenTHPT(value);
                      }}
                      placeholder='Chọn Xã / Phường'
                    />
                    {(formik.errors?.MaQuanHuyenTruong && formik.touched.MaQuanHuyenTruong) ||
                      errors?.MaQuanHuyenTruong ?
                      <p className={cx('message')}>
                        {formik.errors?.MaQuanHuyenTruong || errors?.MaQuanHuyenTruong}
                      </p> :
                      <p className={cx('message')}> </p>
                    }
                  </div>
                  <div className={cx("content-infor")}>
                    <label
                      htmlFor="Truong"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Trường THPT
                    </label>
                    <Select
                      options={schoolList}
                      className={cx('content-item-input')}
                      name='TenTruong'
                      initValue={JSON.stringify(null)}
                      onChange={(value) => {
                        let valueFormated = value
                          ? JSON.parse(value)
                          : null;
                        formik.values.TenTruong = valueFormated?.TenTruong ? valueFormated?.TenTruong : '';
                        if (valueFormated)
                          formik.errors.TenTruong = '';
                        setTruongTHPT(valueFormated);
                      }}
                      placeholder='Chọn Trường THPT'
                    />
                    {formik.errors.TenTruong && formik.touched.TenTruong ? (
                      <p className={cx("message")}>{formik.errors.TenTruong}</p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>
                  <div className={cx("content-infor")}>
                    <label
                      htmlFor="DoiTuongUT"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}> </span>
                      Đối tượng ưu tiên
                    </label>
                    <select
                      name="DoiTuongUT"
                      id="DoiTuongUT"
                      value={formik.values?.DoiTuongUT}
                      placeholder="Đối tượng ưu tiên"
                      className={cx("content-item-input")}
                      onChange={formik.handleChange}
                    >
                      <option value="" selected={!formik.values.DoiTuongUT}>
                        Không thuộc diện ưu tiên
                      </option>
                      <option
                        value="01"
                        selected={formik.values.DoiTuongUT === "01"}
                      >
                        01
                      </option>
                      <option
                        value="02"
                        selected={formik.values.DoiTuongUT === "02"}
                      >
                        02
                      </option>
                      <option
                        value="03"
                        selected={formik.values.DoiTuongUT === "03"}
                      >
                        03
                      </option>
                      <option
                        value="04"
                        selected={formik.values.DoiTuongUT === "04"}
                      >
                        04
                      </option>
                      <option
                        value="05"
                        selected={formik.values.DoiTuongUT === "05"}
                      >
                        05
                      </option>
                      <option
                        value="06"
                        selected={formik.values.DoiTuongUT === "06"}
                      >
                        06
                      </option>
                      <option
                        value="07"
                        selected={formik.values.DoiTuongUT === "07"}
                      >
                        07
                      </option>
                    </select>
                    {formik.errors.DoiTuongUT && formik.touched.DoiTuongUT ? (
                      <p className={cx("message")}>
                        {formik.errors.DoiTuongUT}
                      </p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>
                  <div className={cx("content-infor")}>
                    <label
                      htmlFor="KhuVucUT"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Khu vực ưu tiên
                    </label>
                    <p
                      id="KhuVucUT"
                      className={cx("content-item-input", "disable")}
                    >
                      {TruongTHPT
                        ? TruongTHPT.khuVucUT
                        : "Vui lòng chọn trường"}
                    </p>
                    <p className={cx("message")}></p>
                  </div>
                  <div className={cx("content-infor")}>
                    <label
                      htmlFor="NamTotNghiep"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Năm tốt nghiệp
                    </label>
                    <select
                      name="NamTotNghiep"
                      id="NamTotNghiep"
                      value={formik.values?.NamTotNghiep}
                      className={cx("content-item-input")}
                      onChange={(e) => {
                        setYear(e.target.value);
                        formik.handleChange(e);
                      }}
                    >
                      <option value="" selected={!year}>
                        Chọn năm tốt nghiệp
                      </option>
                      {handleShowNamTotNghiep()}
                    </select>
                    {formik.errors.NamTotNghiep &&
                      formik.touched.NamTotNghiep ? (
                      <p className={cx("message")}>
                        {formik.errors.NamTotNghiep}
                      </p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>
                </div>
                <div className={cx("content-container-item", "content-full", "mt-6")}
                >
                  <div className={cx("content-infor", "content-hinhthuc")}>
                    <label
                      htmlFor="HinhThuc"
                      className={cx("content-item-label")}
                    >
                      <span className={cx("text-red-600 mr-1")}>*</span>
                      Phương án xét tuyển
                    </label>
                    <div
                      className={cx(
                        "content-infor",
                        "content--address",
                        "mt-6"
                      )}
                    >
                      <select
                        name="HinhThuc"
                        id="HinhThuc"
                        className={cx("content-item-input")}
                        value={formik.values.HinhThuc}
                        onChange={formik.handleChange}
                      >
                        <option value="">Chọn phương án xét tuyển</option>
                        <option value="Xét tuyển bằng học bạ THPT">
                          Xét tuyển bằng học bạ THPT
                        </option>
                      </select>
                      {formik.errors.HinhThuc &&
                        formik.touched.HinhThuc ? (
                        <p className={cx("message")}>
                          {formik.errors.HinhThuc}
                        </p>
                      ) : (
                        <p className={cx("message")}> </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* kết quả học tập */}
            <div className={cx("content-item")}>
              <div className={cx("content-item-title", "flex items-center")}>
                <span className={cx("flex-1")}></span>
                <h4 className={cx("content-item-text", "ml-2 uppercase")}>
                  Kết quả học tập THPT
                </h4>
                <span className={cx("flex-1")}></span>
              </div>
              <div className={cx("content-container", "container")}>
                <div className={cx("content-container-item", "content-full")}>
                  <div className={cx("content-scores")}>
                    <div className={cx("content-infor", "content-scores-item")}>
                      <div className={cx("content-infor-group")}>
                        <label
                          htmlFor="DiemTB10"
                          className={cx("content-item-label")}
                        >
                          <span className={cx("text-red-600 mr-1")}>*</span>
                          Điểm TB lớp 10:
                        </label>
                        <input
                          id="DiemTB10"
                          name="DiemTB10"
                          className={cx("content-item-input")}
                          placeholder="0.0"
                          autoComplete="off"
                          value={formik.values.DiemTB10}
                          onChange={formik.handleChange}
                        />
                      </div>
                      {formik.errors.DiemTB10 && formik.touched.DiemTB10 ? (
                        <p className={cx("message")}>
                          {formik.errors.DiemTB10}
                        </p>
                      ) : (
                        <p className={cx("message")}></p>
                      )}
                    </div>
                    <div className={cx("content-infor", "content-scores-item")}>
                      <div className={cx("content-infor-group")}>
                        <label
                          htmlFor="DiemTB11"
                          className={cx("content-item-label")}
                        >
                          <span className={cx("text-red-600 mr-1")}>*</span>
                          Điểm TB lớp 11:
                        </label>
                        <input
                          id="DiemTB11"
                          name="DiemTB11"
                          className={cx("content-item-input")}
                          placeholder="0.0"
                          autoComplete="off"
                          value={formik.values.DiemTB11}
                          onChange={formik.handleChange}
                        />
                      </div>
                      {formik.errors.DiemTB11 && formik.touched.DiemTB11 ? (
                        <p className={cx("message")}>
                          {formik.errors.DiemTB11}
                        </p>
                      ) : (
                        <p className={cx("message")}></p>
                      )}
                    </div>
                    <div className={cx("content-infor", "content-scores-item")}>
                      <div className={cx("content-infor-group")}>
                        <label
                          htmlFor="DiemMon2"
                          className={cx("content-item-label")}
                        >
                          <span className={cx("text-red-600 mr-1")}>*</span>
                          Điểm TB HK1 lớp 12:
                        </label>
                        <input
                          id="DiemHKI12"
                          name="DiemHKI12"
                          className={cx("content-item-input")}
                          placeholder="0.0"
                          autoComplete="off"
                          value={formik.values.DiemHKI12}
                          onChange={formik.handleChange}
                        />
                      </div>
                      {formik.errors.DiemHKI12 && formik.touched.DiemHKI12 ? (
                        <p className={cx("message")}>
                          {formik.errors.DiemHKI12}
                        </p>
                      ) : (
                        <p className={cx("message")}></p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ngành xét tuyển */}
            <div className={cx("content-item")}>
              <div className={cx("content-item-title", "flex items-center")}>
                <span className={cx("flex-1")}></span>
                <h4 className={cx("content-item-text", "mx-2 uppercase")}>
                  Ngành xét tuyển
                </h4>
                <span className={cx("flex-1")}></span>
              </div>
              <div className={cx("content-container", "container")}>
                <div className={cx("content-container-item", "content-full")}>
                  <div className={cx("content-Fieldofstudy")}>
                    <div
                      className={cx(
                        "content-infor",
                        "content-Fieldofstudy-item"
                      )}
                    >
                      <label
                        htmlFor="nganh"
                        className={cx("content-item-label")}
                      >
                        <span className={cx("text-red-600 mr-1")}>*</span>
                        Ngành xét tuyển
                      </label>
                      <select
                        id="nganh"
                        name="Nganh_ID"
                        className={cx("content-item-input")}
                        value={formik.values?.Nganh_ID}
                        placeholder="Tùy chọn ngành xét tuyển"
                        onChange={formik.handleChange}
                      >
                        <option value="" selected={!formik.values.Nganh_ID}>
                          Tùy chọn ngành xét tuyển
                        </option>
                        {majors.map((major) => {
                          return (
                            <option
                              key={major.MaNganh}
                              value={major.MaNganh}
                              selected={
                                formik.values.Nganh_ID === major.maNganh
                              }
                            >
                              {major.MaNganh} - {major.TenNganh}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    {formik.errors.Nganh_ID && formik.touched.Nganh_ID ? (
                      <p className={cx("message")}>
                        {formik.errors.Nganh_ID}
                      </p>
                    ) : (
                      <p className={cx("message")}> </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* danh sách minh chứng kèm theo */}
            <div className={cx("content-item")}>
              <div className={cx("content-item-title", "flex items-center")}>
                <span className={cx("flex-1")}></span>
                <h4 className={cx("content-item-text", "mx-2 uppercase")}>
                  Danh sách minh chứng kèm theo
                </h4>
                <span className={cx("flex-1")}></span>
              </div>
              <div className={cx("content-container", "container")}>
                <p className={cx("content-note")}>
                  Chú ý: các hình ảnh minh chứng có thể bổ sung sau khi trúng
                  tuyển !
                </p>
                <table className={cx("content-infor", "content-images")}>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên giấy tờ</th>
                      <th>File đính kèm</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={cx("content-images-col-1")}>1</td>
                      <td
                        className={cx("content-images-col-2", "text-left px-3")}
                      >
                        Ảnh chụp học bạ trang có điểm tổng kết môn học năm lớp
                        12
                      </td>
                      <td>
                        <div className={cx("content-images-group")}>
                          <div
                            className={cx("content-images-list")}
                            id="img-container"
                          ></div>
                          <label
                            htmlFor="BangKQ12"
                            className={cx("content-btn", "btn-upload")}
                          >
                            <span className={cx("content-btn-icon")}>
                              <UploadIcon />
                            </span>
                            Chọn tệp
                          </label>
                          <input
                            type="file"
                            hidden
                            name="BangKQ12"
                            id="BangKQ12"
                            accept=".jpg"
                            onChange={handleUploadImages}
                            multiple
                          />
                          {errors?.['BangKQ12.0'] || errors?.['BangKQ12.1'] ? (
                            <p className={cx("message")}>
                              {errors?.['BangKQ12.0'] || errors?.['BangKQ12.1']}
                            </p>
                          ) : (
                            <p className={cx("message")}> </p>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className={cx("content-images-col-1")}>2</td>
                      <td
                        className={cx("content-images-col-2", "text-left px-3")}
                      >
                        Ảnh chụp bìa học bạ
                      </td>
                      <td>
                        <div className={cx("content-images-group")}>
                          <div
                            className={cx("content-images-list")}
                            id="img-container"
                          ></div>
                          <label
                            htmlFor="HocBaBia"
                            className={cx("content-btn", "btn-upload")}
                          >
                            <span className={cx("content-btn-icon")}>
                              <UploadIcon />
                            </span>
                            Chọn tệp
                          </label>
                          <input
                            type="file"
                            hidden
                            name="HocBaBia"
                            id="HocBaBia"
                            accept=".jpg"
                            onChange={handleUploadImages}
                          />

                          {errors?.HocBaBia ? (
                            <p className={cx("message")}>{errors?.HocBaBia}</p>
                          ) : (
                            <p className={cx("message")}> </p>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className={cx("content-images-col-1")}>3</td>
                      <td
                        className={cx("content-images-col-2", "text-left px-3")}
                      >
                        Ảnh chụp bằng tốt nghiệp
                      </td>
                      <td>
                        <div className={cx("content-images-group")}>
                          <div
                            className={cx("content-images-list")}
                            id="img-container"
                          ></div>
                          <label
                            htmlFor="ChungNhanTN"
                            className={cx("content-btn", "btn-upload")}
                          >
                            <span className={cx("content-btn-icon")}>
                              <UploadIcon />
                            </span>
                            Chọn tệp
                          </label>
                          <input
                            type="file"
                            hidden
                            name="ChungNhanTN"
                            id="ChungNhanTN"
                            accept=".jpg"
                            onChange={handleUploadImages}
                          />
                          {errors?.ChungNhanTN ? (
                            <p className={cx("message")}>
                              {errors?.ChungNhanTN}
                            </p>
                          ) : (
                            <p className={cx("message")}> </p>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className={cx("content-images-col-1")}>4</td>
                      <td
                        className={cx("content-images-col-2", "text-left px-3")}
                      >
                        Ảnh chụp giấy chứng nhận ưu tiên (nếu có)
                      </td>
                      <td>
                        <div className={cx("content-images-group")}>
                          <div
                            className={cx("content-images-list")}
                            id="img-container"
                          ></div>
                          <label
                            htmlFor="ChungNhanUT"
                            className={cx("content-btn", "btn-upload")}
                          >
                            <span className={cx("content-btn-icon")}>
                              <UploadIcon />
                            </span>
                            Chọn tệp
                          </label>
                          <input
                            type="file"
                            hidden
                            name="ChungNhanUT"
                            id="ChungNhanUT"
                            accept=".jpg"
                            onChange={handleUploadImages}
                          />
                          {errors?.ChungNhanUT ? (
                            <p className={cx("message")}>
                              {errors?.ChungNhanUT}
                            </p>
                          ) : (
                            <p className={cx("message")}> </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className={cx("content-note")}>
                  Chú ý: Học sinh có thể sửa đổi thông tin khi nhập học (bao gồm
                  ngành xét tuyển và thông tin cá nhân).
                </p>
              </div>
            </div>

            <div className={cx("content-container", "content-group-button")}>
              <Button
                className={cx("btn-back")}
                outline
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setExit(true);
                }}
              >
                Quay lại
              </Button>
              <input
                type="submit"
                className={cx("btn-submit")}
                value="Đăng ký"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  Object.keys(formik.values).forEach((key) => {
                    if ((key !== 'DoiTuongUT' && !formik.values[key]) || formik.errors?.[key]) {
                      setShowToastSignUp(true);
                      setTimeout(() => {
                        setShowToastSignUp(false);
                      }, 1500);
                      return;
                    }
                  });
                  formik.handleSubmit();
                }}
              />
            </div>
          </form>
        </main>

        {/* modal exit */}
        <ModalAlert
          message="Bạn có chắc chắn muốn thoát không ?"
          enabled={exit}
          onClose={() => {
            setExit(false);
          }}
          onAccepted={() => {
            setExit(false);
            navigate('/');
          }}
        />

        {/* button scroll to top */}
        {isScrollTop && (
          <button
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="fixed right-4 bottom-[100px] bg-white shadow-lg shadow-slate-400 p-2 rounded"
          >
            <ArrowUp />
          </button>
        )}

        {
          modalImgSrc && (
            <div ref={modalContainerRef} className={cx('modal')}>
              <div className={cx('modal-container')}>
                <div className={cx('modal-container-img')}>
                  <img className={cx('modal-img')} src={modalImgSrc} alt="img ảnh" />
                </div>
                <div className={cx('btn')}>
                  <button className={cx('btn-close')} onClick={closeModal}>
                    &times;
                  </button>
                </div>
              </div>
            </div>
          )
        }
      </div>

      {/* toast messenger */}
      {showToastSignUp && (
        <ToastMessgerSignUp
          showToast={showToastSignUp}
          onClose={() => setShowToastSignUp(false)}
        />
      )}

      {/* show modal QR */}
      {showModalQr && (
        <ModalQr
          maHoSo={maHoSo}
          onClose={() => {
            setShowModalQr(false);
            navigate("/");
          }}
        />
      )}

    </React.Fragment>
  );
}

export default ApplyForAdmissionPage;
