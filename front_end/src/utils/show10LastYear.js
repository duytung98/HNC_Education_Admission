export const show10LastYear = (valueActive, currentYear) => {
    const years = [currentYear];
    for (let i = 1; i <= 9; i++) {
        years.push(currentYear - i);
    }
    const yearsHttml = years.map(year => {
        return (
            <option value={year} selected={valueActive === year}
                key={year}
            >
                {year}
            </option>
        )
    })
    return yearsHttml;
}
