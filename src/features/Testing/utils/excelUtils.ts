import * as XLSX from "xlsx-js-style";
import { ValidationError } from "./validations";

export function readExcelFile(file: File): Promise<any[][][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetsData: any[][][] = workbook.SheetNames.map((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          return XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: undefined });
        });
        resolve(sheetsData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsArrayBuffer(file);
  });
}

export function downloadCorrectedExcel(sheets: any[][][], errors: ValidationError[], filename: string = "corrected_file.xlsx") {
  if (!sheets.length) return;

  const workbook = XLSX.utils.book_new();
  
  sheets.forEach((sheet, sheetIdx) => {
    if (!sheet || sheet.length === 0) return;

    const newSheetData = sheet.map((r) => (Array.isArray(r) ? [...r] : r));
    const errorsForThisSheet = errors.filter((e) => e.sheetIdx === sheetIdx);

    errorsForThisSheet.forEach((err) => {
      const r = err.row;
      const c = err.col;
      if (!newSheetData[r]) newSheetData[r] = [];
      const oldVal = newSheetData[r][c] === undefined || newSheetData[r][c] === null ? "" : newSheetData[r][c];
      newSheetData[r][c] = `${oldVal} ⚠ ${err.message}`;
    });

    const ws = XLSX.utils.aoa_to_sheet(newSheetData);

    // Apply styling to error cells
    Object.keys(ws).forEach((cellRef) => {
      if (cellRef[0] === "!") return;
      const cell = ws[cellRef];
      const v = (cell && cell.v) ? cell.v.toString() : "";
      if (v.includes("⚠")) {
        cell.s = {
          fill: { fgColor: { rgb: "FFFF00" } },
          font: { color: { rgb: "FF0000" }, bold: true }
        };
      }
    });

    XLSX.utils.book_append_sheet(workbook, ws, `Sheet${sheetIdx + 1}`);
  });

  XLSX.writeFile(workbook, filename, { bookType: "xlsx" });
}