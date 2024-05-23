const request = {
  apiUrlBaseYHN: process.env.REACT_APP_BASE_URL_API_YHN,
  apiNationYNH: '/dan-toc-ton-giao/dan-toc',
  apiCityYHN: '/don-vi-hanh-chinh/tinh',
  apiDistrictYHN: '/don-vi-hanh-chinh/quan-huyen/maTinh/',
  apiCommuneYHN: '/don-vi-hanh-chinh/xa-phuong/ma-quan-huyen/',
  apiCitySchoolYHN: '/truong-thpt/tinh-tp',
  apiDistrictSchoolYHN: '/truong-thpt/quan-huyen/tinh-tp/',
  apiUrlBaseHNC: process.env.REACT_APP_BASE_URL_API_HNC,
  apiLoginCanBoTS: '/api/v1/canbo/login',
  apiLogoutCanBoTS: '/api/v1/canbo/logout',
  apiRefreshToken: '/api/v1/canbo/refresh',
  apiAdmissionList: '/api/v1/ho-so/xet-tuyen',
  apiDetailProfile: '/api/v1/ho-so/xet-tuyen/',
  apiDeleteProfile: '/api/v1/ho-so/xet-tuyen/',
  apiUpdateProfile: '/api/v1/ho-so/xet-tuyen/',
  apiAdmissionAcceptedList: '/api/v1/ho-so/trung-tuyen',
  apiUpdateStateAdmission: '/api/v1/ho-so/update-trang-thai/',
  apiMajors: '/api/v1/nganh',
  apiXettuyenhoso: '/api/v1/xet-tuyen/ho-so',
  apiSendMail: '/api/v1/ho-so/gui-email',
  apiTraCuuHoSo: '/api/v1/tra-cuu/ho-so/?VALUES=',
  apiReportYears: '/api/v1/ho-so/report-nam',
  apiReportMonth: '/api/v1/ho-so/report-thang/',
  apiReportMajor: '/api/v1/ho-so/report-nganh'
};

export default request;
