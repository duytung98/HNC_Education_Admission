export const capitalizeTheFirstLetter = (value) => {
    const splits = value.trim().split(/\s/);
    let result = '';
    splits.forEach((item) => {
        result += item[0].toUpperCase() + item.slice(1, item.length).toLowerCase();
        result += ' ';
    })
    return result;
}