import { getCommunelistService } from '~/services';

export const getMaXaByName = async (name, MaHuyen) => {
    const listCommune = await getCommunelistService(MaHuyen);
    for (let i = 0; i < listCommune.length; i++) {
        if (listCommune[i].tenDonVi.toLowerCase().includes(name.toLowerCase())) {
            return listCommune[i].ma;
        }
    }
    return -1;
}