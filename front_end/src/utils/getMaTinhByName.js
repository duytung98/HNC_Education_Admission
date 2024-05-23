import { getCityListService } from '~/services';

export const getMaTinhByName = async (name) => {
    const listCity = await getCityListService();
    for (let i = 0; i < listCity.length; i++) {
        if (listCity[i].tenDonVi.toLowerCase().includes(name.toLowerCase())) {
            return listCity[i].ma;
        }
    }
    return -1;
}