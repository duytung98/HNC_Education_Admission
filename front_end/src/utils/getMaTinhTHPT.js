import { getCityListOfSchoolService } from '~/services';

export const getMaTinhTHPT = async (nameTinhTHPT) => {
    const listCity = await getCityListOfSchoolService();
    for (let i = 0; i < listCity.length; i++) {
        if (listCity[i].tenTinhTP.toLowerCase().includes(nameTinhTHPT.toLowerCase())) {
            return listCity[i].maTinh;
        }
    }
    return -1;
}