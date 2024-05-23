import { getMajorListService } from '~/services';

export const getIDNganhByName = async (name) => {
    const listMajor = await getMajorListService();
    for (let i = 0; i < listMajor.length; i++) {
        if (listMajor[i].TenNganh.toLowerCase() === name.toLowerCase()) {
            return listMajor[i].id;
        }
    }
    return -1;
}