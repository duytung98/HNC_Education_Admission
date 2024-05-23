import { getDistrictListOfSchoolService } from '~/services';

export const getMaHuyenTHPT = async (nameHuyenTHPT, maTinh) => {
    const listDistrict = await getDistrictListOfSchoolService(maTinh);
    for (let i = 0; i < listDistrict.length; i++) {
        if (listDistrict[i].tenQH.toLowerCase().includes(nameHuyenTHPT.toLowerCase())) {
            return listDistrict[i].maQH;
        }
    }
    return -1;
}