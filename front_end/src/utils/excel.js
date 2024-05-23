import ExcelJS from 'exceljs';

export const readDataFromFileExcel = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0];
        const columns = worksheet.getRow(1).values;
        const data = [];
        for (let i = 2; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i).values;
            if (row.length === 0)
                break;
            const rowData = {};
            columns.forEach((key, index) => {
                rowData[key] = row[index];
            });
            data.push(rowData);
        }
        return data;
    } catch (e) {
        throw e;
    }
};
export const exportDataToFileExcel = async (data, titleContent) => {
    try {
        const workbook = new ExcelJS.Workbook();

        workbook.creator = 'HPC';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();

        workbook.calcProperties.fullCalcOnLoad = true;
        const worksheet = workbook.addWorksheet('Sheet 1', {
            pageSetup: {
                fitToPage: true,
            }
        });
        worksheet.properties.defaultRowHeight = 30;
        const columns = [
            { header: 'STT', key: 'STT', width: 5 },
            { header: 'Mã Hồ Sơ', key: 'MaHoSo', width: 15 },
            { header: 'Họ Đệm', key: 'HoDem', width: 20 },
            { header: 'Tên', key: 'Ten', width: 20 },
            { header: 'Giới Tính', key: 'GioiTinh', width: 15 },
            { header: 'Ngày Sinh', key: 'NgaySinh', width: 20 },
            { header: 'Số CMND/CCCD', key: 'CCCD', width: 30 },
            { header: 'Số điện thoại', key: 'SDT', width: 20 },
            { header: 'Email', key: 'Email', width: 30 },
            { header: 'Hình thức xét tuyển', key: 'HinhThuc', width: 30 },
            { header: 'Ngành xét tuyển', key: 'Nganh', width: 30 },
            { header: 'Điểm TB lớp 10', key: 'DiemTB10', width: 20 },
            { header: 'Điểm TB lớp 11', key: 'DiemTB11', width: 20 },
            { header: 'Điểm TB HKI 12', key: 'DiemHKI12', width: 20 },
            { header: 'Ngày xét tuyển', key: 'NgayXetTuyen', width: 20 },
            { header: 'Link chi tiết', key: 'Link', width: 55 }
        ];

        worksheet.columns = columns;
        worksheet.columns.forEach((column) => {
            column.font = { size: 14, name: 'Times New Roman' };
            column.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        // xét kích thước tự động cho các cột nếu nội dung lớn hơn kích thước mặc định
        for (let i = 0; i < worksheet.columns.length; i += 1) {
            const column = worksheet.columns[i];
            let dataMax = column.width;
            for (let j = 1; j < column.values.length; j += 1) {
                const columnLength = column.values[j].length;
                if (columnLength > dataMax) {
                    dataMax = columnLength;
                }
            }
            column.width = dataMax;
        }

        // row 1 hiển thị tiêu đề nội dung export;
        const cell1 = worksheet.getCell('A1');
        cell1.value = titleContent;
        cell1.font = { size: 24, name: 'Times New Roman' };
        worksheet.mergeCells('A1:P1');


        // row 2 hiển thị tiêu đề các columns;
        worksheet.getRow(2).values = columns.map((column) => column.header);
        worksheet.getRow(2).eachCell((cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.font = { bold: true, size: 14, name: 'Times New Roman' };
        });

        data.forEach((record) => {
            worksheet.addRow(record);
        })

        // xuất file;
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer]);
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${titleContent}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        throw error;
    }
};

