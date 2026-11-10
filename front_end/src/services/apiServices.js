import { getYHN, getHNC, post } from "~/utils";
import axios from "axios";
import { request } from "~/configs";

export const getNationListService = async () => {
  try {
    const url = request.apiUrlBaseYHN + request.apiNationYNH;
    const res = await getYHN(url);
    const data = res.data;
    return data;
  } catch (e) { }
};

export const getCityListService = async () => {
  try {
    const url = request.apiUrlBaseHNC + request.apiCityHNC;
    const res = await getHNC(url);
    const data = res.data;
    return data;
  } catch (e) { }
};
export const getCityListOfSchoolService = async () => {
  try {
    const url = request.apiUrlBaseYHN + request.apiCitySchoolYHN;
    const res = await getYHN(url);
    const data = res.data;
    return data;
  } catch (e) { }
};

export const getDistrictListService = async (maTinh) => {
  try {
    const url = request.apiUrlBaseYHN + request.apiDistrictYHN + maTinh;
    const res = await getYHN(url);
    return res.data;
  } catch (e) { }
};

export const getDistrictListOfSchoolService = async (maTinh) => {
  try {
    const url = request.apiUrlBaseYHN + request.apiDistrictSchoolYHN + maTinh;
    const res = await getYHN(url);
    return res.data;
  } catch (e) { }
};

export const getCommunelistService = async (maTinh) => {
  try {
    const url = request.apiUrlBaseHNC + request.apiCommuneHNC + maTinh;
    const res = await getHNC(url);
    return res.data;

  } catch (e) { }
};

export const getSchoollistService = async (maTinh, maHuyen) => {
  try {
    const url =
      request.apiUrlBaseYHN +
      "/truong-thpt/maTinhTP/" +
      maTinh +
      "/maQuanHuyen/" +
      maHuyen;
    const res = await getYHN(url);
    return res.data;
  } catch (e) { }
};

// Login and Logout
export const loginService = async (maCBTS, password) => {
  try {
    const url = request.apiLoginCanBoTS;
    const res = await post(url, {
      maCBTS,
      password,
    });
    return res;
  } catch (e) {
    return e.response.data;
  }
};

// xét tuyển hồ sơ clien

export const registerProfile = async (values) => {
  try {
    const url = request.apiXettuyenhoso;
    const res = await post(url, values, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (e) {
    return e.response.data;
  }
};

export const logoutService = async (accessToken, axiosInstance) => {
  try {
    const url = request.apiLogoutCanBoTS;
    const res = await axiosInstance.post(
      url,
      {},
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
    return res.data;
  } catch (e) {
    return e.response.data;
  }
};

// Danh sách hồ sơ xét tuyển;
export const admissionListService = async (accessToken, axiosInstance) => {
  try {
    const url = request.apiAdmissionList;
    const res = await axiosInstance.get(url, {
      headers: { Authorization: "Bearer " + accessToken },
    });
    return res.data.data;
  } catch (e) {
    return e.response.data;
  }
};

// Service thông tin chi tiết hồ sơ
export const detailAdmissionService = async (
  maHoSo,
  accessToken,
  axiosInstance
) => {
  try {
    const url = request.apiDetailProfile + maHoSo;
    const res = await axiosInstance.get(url, {
      headers: { Authorization: "Bearer " + accessToken },
    });
    return res.data.data;
  } catch (e) {
    return e.response.data;
  }
};

// Service danh sách hồ sơ trúng tuyển
export const admissionAcceptedListService = async (
  accessToken,
  axiosInstance
) => {
  try {
    const url = request.apiAdmissionAcceptedList;
    const res = await axiosInstance.get(url, {
      headers: { Authorization: "Bearer " + accessToken },
    });
    return res.data.data;
  } catch (e) {
    return e.response.data;
  }
};

// Service danh sách ngành học
export const getMajorListService = async () => {
  try {
    const url = request?.apiMajors;
    const res = await getHNC(url);
    return res.data;
  } catch (e) {
    return e.respone.data;
  }
};

// Service xóa hồ  sơ
export const deleteProfileService = async (
  maHS,
  accessToken,
  axiosInstance
) => {
  try {
    const url = request.apiDeleteProfile + maHS;
    const res = await axiosInstance.delete(url, {
      headers: { Authorization: "Bearer " + accessToken },
    });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
};

// Service xét duyệt hồ sơ
export const updateStatusAdmissionService = async (
  data,
  accessToken,
  axiosInstance
) => {
  try {
    const url = request.apiUpdateStateAdmission;
    const res = await axiosInstance.put(url, data, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
};

// Service update thông tin hồ sơ
export const updateInforProfileService = async (
  hoSoID,
  data,
  accessToken,
  axiosInstance
) => {
  try {
    const url = request.apiUpdateProfile + hoSoID;
    const res = await axiosInstance.post(url, data, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
};

// Services tracuuhoso đã nộp
export const getDetailProfileClientService = async maHoSo => {
  try {
    const url = request.apiTraCuuHoSo + maHoSo;
    const res = await getHNC(url);
    return res;
  } catch (e) {
    return e.response.data;
  }
};

export const convertUrlImgToFileService = async (urlImage, name) => {
  try {
    const response = await axios.get(urlImage, { responseType: "blob" });
    const file = new File([response.data], `${name}.jpg`, {
      type: "image/jpeg",
    });
    return file;
  } catch (error) { }
};

export const sendMailService = async (data, accessToken, axiosInstance) => {
  try {
    const url = request.apiSendMail;
    const res = await axiosInstance.post(url, { data },
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
          timeout: 10000, //10s
        }
      })
    return res.data;
  } catch (e) {
    throw e;
  }
}

// Reports 
export const getReportYears = async (accessToken, axiosInstance) => {
  try {
    const url = request?.apiReportYears;
    const res = await axiosInstance.get(url, {
      headers: { Authorization: 'Bearer ' + accessToken }
    });
    return res.data;
  } catch (e) {
    return e.respone.data;
  }
};

export const getReportMonth = async (year, accessToken, axiosInstance) => {
  try {
    const url = request?.apiReportMonth + year;
    const res = await axiosInstance.get(url, {
      headers: { Authorization: 'Bearer ' + accessToken }
    });
    return res.data;
  } catch (e) {
    return e.respone.data;
  }
};


export const getReportMajor = async (accessToken, axiosInstance) => {
  try {
    const url = request?.apiReportMajor;
    const res = await axiosInstance.get(url, {
      headers: { Authorization: 'Bearer ' + accessToken }
    });
    return res.data;
  } catch (e) {
    return e.respone.data;
  }
};
