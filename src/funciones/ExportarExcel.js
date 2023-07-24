
import * as  XLSX from 'xlsx';

const ExcelExporter = (equipo, columnsToShow ) => {
    const generateExcelData = () => {
        // Filtra los datos para incluir solo las propiedades seleccionadas en el orden de columnsToShow
        const filteredData = equipo.map(item => {
          const orderedItem = {};
          columnsToShow.forEach(column => {
            orderedItem[column] = item[column];
          });
          return orderedItem;
        });
    
        // Crea la hoja de cálculo con los datos filtrados
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
    
        // Crea el libro de trabajo y agrega la hoja de cálculo
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
        // Genera el archivo de Excel como un objeto Blob
        const excelBlob = new Blob([s2ab(XLSX.write(workbook, { type: 'binary' }))], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
    
        return excelBlob;
      };
    
      // Función auxiliar para convertir cadena a matriz de bytes (ArrayBuffer)
      const s2ab = s => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      };
    
      // Llamamos a la función para generar el contenido del archivo Excel
      const excelBlob = generateExcelData();
    
      // Devolvemos el objeto Blob
      return excelBlob;
    };
export default ExcelExporter;

