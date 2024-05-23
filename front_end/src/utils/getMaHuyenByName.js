import { getDistrictListService } from '~/services';

export const getMaHuyenByName = async (name, maTinh) => {
    const listDistrict = await getDistrictListService(maTinh);
    for (let i = 0; i < listDistrict.length; i++) {
        if (listDistrict[i].tenDonVi.toLowerCase().includes(name.toLowerCase())) {
            return listDistrict[i].ma;
        }
    }
    return -1;
}