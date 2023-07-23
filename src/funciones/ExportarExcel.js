import * as XLSX from 'xlsx';

const ExcelExporter = ( {data} ) => {  

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    return XLSX.writeFile(workbook, 'data.xlsx');
  
};

export default ExcelExporter;
