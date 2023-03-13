import * as XLSX from 'xlsx';

export const createAnExcelSheetWithDummyData = () => {
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['A1', 'B1', 'C1'],
    ['A2', 'B2', 'C2'],
    ['A3', 'B3', 'C3']
  ]);
  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'demo.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
