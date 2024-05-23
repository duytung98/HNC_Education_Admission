export const formatDate = (objectDate) => {
    let dateFormat = new Date(objectDate);
    let day = dateFormat.getDate();
    let month = dateFormat.getMonth() + 1;
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    let newDate = `${day}/${month}/${dateFormat.getFullYear()}`;
    return newDate;
}
