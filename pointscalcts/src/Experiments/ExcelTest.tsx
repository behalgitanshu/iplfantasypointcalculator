import * as XLSX from 'xlsx';
import { data } from './data';

export const createAnExcelSheetWithDummyData = () => {
  const worksheet = XLSX.utils.json_to_sheet(data);
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
