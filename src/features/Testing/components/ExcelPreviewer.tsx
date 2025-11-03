import React, { useState } from "react";
import * as XLSX from "xlsx";

interface ExcelRow {
  [key: string]: string | number | boolean | null;
}

const ExcelPreviewer: React.FC = () => {
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [data, setData] = useState<ExcelRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Clean parsed data (remove empty rows and columns)
  const cleanData = (rows: ExcelRow[]): ExcelRow[] => {
    const filteredRows = rows.filter((row) =>
      Object.values(row).some(
        (val) => val !== "" && val !== null && val !== undefined
      )
    );

    const allKeys = new Set<string>();
    filteredRows.forEach((row) => {
      Object.keys(row).forEach((key) => {
        const val = row[key];
        if (typeof val === "string") row[key] = val.trim();
        if (row[key] !== "") allKeys.add(key);
      });
    });

    return filteredRows.map((row) => {
      const newRow: ExcelRow = {};
      allKeys.forEach((key) => (newRow[key] = row[key] ?? ""));
      return newRow;
    });
  };

  // 🔹 Load data for a selected sheet
  const loadSheetData = (sheetName: string, wb: XLSX.WorkBook) => {
    const worksheet = wb.Sheets[sheetName];
    const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
    });

    const cleaned = cleanData(jsonData);
    setColumns(cleaned.length > 0 ? Object.keys(cleaned[0]) : []);
    setData(cleaned);
    setSelectedSheet(sheetName);
  };

  // 🔹 Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target?.result;
      if (!binaryStr) return;

      const wb = XLSX.read(binaryStr, { type: "binary" });
      setWorkbook(wb);
      setSheets(wb.SheetNames);
      loadSheetData(wb.SheetNames[0], wb);
      setIsModalOpen(true);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Upload Excel File
      </h1>

      <div className="flex flex-col items-center gap-3">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="border border-gray-300 p-2 rounded-md"
        />
        {fileName && <p className="text-sm text-gray-500">Uploaded: {fileName}</p>}
      </div>

      {/* 🔹 Modal Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-6xl rounded-lg shadow-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-100">
              <h2 className="text-lg font-semibold">Excel Preview - {fileName}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            {/* Sheet Tabs */}
            <div className="flex border-b overflow-x-auto">
              {sheets.map((sheet) => (
                <button
                  key={sheet}
                  onClick={() => workbook && loadSheetData(sheet, workbook)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    sheet === selectedSheet
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {sheet}
                </button>
              ))}
            </div>

            {/* Data Table */}
            <div className="max-h-[70vh] overflow-auto p-4">
              {data.length > 0 ? (
                <table className="min-w-full text-sm border">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      {columns.map((col) => (
                        <th key={col} className="px-3 py-2 border-b font-medium text-left">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => (
                      <tr key={i} className="even:bg-gray-50">
                        {columns.map((col) => (
                          <td key={col} className="px-3 py-2 border-b">
                            {String(row[col] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center mt-4">
                  No data available for this sheet.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t text-center text-sm text-gray-500">
              {data.length} rows loaded
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelPreviewer;
