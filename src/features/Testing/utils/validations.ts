export interface ValidationError {
  sheetIdx: number;
  row: number;
  col: number;
  message: string;
}

export interface ValidationResults {
  hasEmptyFields: boolean;
  hasFractionInFinalValue: boolean;
  hasInvalidPurposeId: boolean;
  hasInvalidValuePremiseId: boolean;
  hasMissingRequiredHeaders: boolean;
  isReportValueValid: boolean;
  totalErrors: number;
}

export interface EmptyFieldInfo {
  sheetIndex: number;
  rowIndex: number;
  colIndex: number;
  columnName?: string;
}

// Constants
export const allowedPurposeIds = [1, 2, 5, 6, 8, 9, 10, 12, 14];
export const allowedValuePremiseIds = [1, 2, 3, 4, 5];

export const requiredHeaders = {
  0: [
    'title', 'purpose_id', 'value_premise_id', 'report_type', 'valued_at', 
    'submitted_at', 'inspection_date', 'assumptions', 'special_assumptions', 
    'value', 'client_name', 'owner_name', 'telephone', 'email', 'region', 'city'
  ],
  1: [
    'asset_name', 'asset_usage_id', 'final_value'
  ],
  2: [
    'asset_name', 'asset_usage_id', 'final_value'
  ]
};

// Helper functions
export function rowLength(row: any[]): number {
  if (!row) return 0;
  return row.length;
}

export function validateDate(dateVal: any): boolean {
  let day, month, year;
  if (dateVal instanceof Date) {
    day = dateVal.getDate();
    month = dateVal.getMonth() + 1;
    year = dateVal.getFullYear();
  } else if (typeof dateVal === 'string') {
    const parts = dateVal.split('/');
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    year = parseInt(parts[2], 10);
  } else if (typeof dateVal === 'number') {
    const date = new Date((dateVal - 25569) * 86400 * 1000);
    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
  } else {
    return false;
  }
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  return true;
}

export function formatCellValue(val: any, headerName: string): string {
  if (headerName === "valued_at" || headerName === "submitted_at" || headerName === "inspection_date") {
    if (val instanceof Date) {
      return val.toLocaleDateString('en-GB');
    } else if (typeof val === 'number') {
      const date = new Date((val - 25569) * 86400 * 1000);
      return date.toLocaleDateString('en-GB');
    } else if (typeof val === 'string') {
      return val;
    }
  }
  return String(val);
}

// Validation functions
export function hasMissingRequiredHeaders(sheet: any[][], sheetIdx: number): string[] {
  if (!sheet || sheet.length === 0) return requiredHeaders[sheetIdx as keyof typeof requiredHeaders] || [];
  
  const headers = sheet[0] || [];
  const headerNames = headers.map((h: any) => h?.toString().trim().toLowerCase());
  
  const missingHeaders: string[] = [];
  const requiredForSheet = requiredHeaders[sheetIdx as keyof typeof requiredHeaders] || [];
  
  requiredForSheet.forEach(requiredHeader => {
    if (!headerNames.includes(requiredHeader.toLowerCase())) {
      missingHeaders.push(requiredHeader);
    }
  });
  
  return missingHeaders;
}

export function hasEmptyFields(sheets: any[][][]): { hasEmpty: boolean; emptyFields: EmptyFieldInfo[] } {
  const emptyFields: EmptyFieldInfo[] = [];

  for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;

    if (sheetIdx === 0) {
      const headerLength = rowLength(sheet[0]);
      const row = sheet[1];
      if (!row) continue;
      const rowLen = rowLength(row);

      for (let j = 0; j < headerLength; j++) {
        const value = j < rowLen ? row[j] : undefined;

        if (value === undefined || value === "") {
          emptyFields.push({
            sheetIndex: sheetIdx + 1,
            rowIndex: 2,
            colIndex: j + 1,
            columnName: sheet[0][j] || `Column ${j + 1}`,
          });
        }
      }
    } else {
      const maxCols = Math.max(...sheet.map(row => rowLength(row)));

      for (let i = 1; i < sheet.length; i++) {
        const row = sheet[i];
        const rowLen = rowLength(row);

        for (let j = 0; j < maxCols; j++) {
          const value = j < rowLen ? row[j] : undefined;

          if (value === undefined || value === "") {
            emptyFields.push({
              sheetIndex: sheetIdx + 1,
              rowIndex: i + 1,
              colIndex: j + 1,
              columnName: sheet[0][j] || `Column ${j + 1}`,
            });
          }
        }
      }
    }
  }

  return {
    hasEmpty: emptyFields.length > 0,
    emptyFields,
  };
}

export function hasFractionInFinalValue(sheets: any[][][]) {
  for (let sheetIdx = 1; sheetIdx <= 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const finalValueIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "final_value");
    if (finalValueIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i][finalValueIdx];
      if (val !== undefined && val !== "" && !Number.isInteger(Number(val))) {
        return true;
      }
    }
  }
  return false;
}

export function hasInvalidPurposeId(sheets: any[][][]) {
  for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const purposeIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "purpose_id");
    if (purposeIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i][purposeIdx];
      if (val !== undefined && val !== "" && !allowedPurposeIds.includes(Number(val))) {
        return true;
      }
    }
  }
  return false;
}

export function hasInvalidValuePremiseId(sheets: any[][][]) {
  for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const premiseIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "value_premise_id");
    if (premiseIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i][premiseIdx];
      if (val !== undefined && val !== "" && !allowedValuePremiseIds.includes(Number(val))) {
        return true;
      }
    }
  }
  return false;
}

export function getFinalValueSum(sheets: any[][][]) {
  let sum = 0;
  for (let sheetIdx = 1; sheetIdx <= 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;
    const finalValueIdx = sheet[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "final_value");
    if (finalValueIdx === -1) continue;
    for (let i = 1; i < sheet.length; i++) {
      const val = sheet[i][finalValueIdx];
      if (val !== undefined && val !== "" && !isNaN(Number(val))) {
        sum += Number(val);
      }
    }
  }
  console.log("sum", sum);
  return sum;
}

export function isReportValueEqualToAssetsSum(sheets: any[][][], assetsSum: number) {
  const sheet1 = sheets[0];
  if (!sheet1 || sheet1.length < 2) return true;
  const valueIdx = sheet1[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "value");
  if (valueIdx === -1) return true;
  const reportValue = sheet1[1]?.[valueIdx];
  if (reportValue === undefined || reportValue === "" || isNaN(Number(reportValue))) return true;
  return Number(reportValue) === assetsSum;
}

export function hasAllRequiredHeaders(sheets: any[][][]) {
  if (sheets.length < 3) return false;
  
  for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
    const missingHeaders = hasMissingRequiredHeaders(sheets[sheetIdx], sheetIdx);
    if (missingHeaders.length > 0) {
      return false;
    }
  }
  return true;
}

// Main validation function
export function validateExcelData(sheets: any[][][]): { errors: ValidationError[]; results: ValidationResults } {
  const errors: ValidationError[] = [];
  const finalValueSum = getFinalValueSum(sheets);
  const isReportValueValid = isReportValueEqualToAssetsSum(sheets, finalValueSum);

  // Check for missing required headers in all sheets
  for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length === 0) continue;
    
    const missingHeaders = hasMissingRequiredHeaders(sheet, sheetIdx);
    if (missingHeaders.length > 0) {
      errors.push({
        sheetIdx,
        row: 0,
        col: 0,
        message: `Missing required headers: ${missingHeaders.join(', ')}`
      });
    }
  }

  // Validate each sheet
  for (let sheetIdx = 0; sheetIdx < 3; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;

    if (sheetIdx === 0) {
      // For sheet 1, only check the second row
      const headerLength = rowLength(sheet[0]);
      const row = sheet[1];
      if (!row) continue;
      const rowLen = rowLength(row);

      for (let j = 0; j < headerLength; j++) {
        const cell = j < rowLen ? row[j] : undefined;
        const headerName = (sheet[0][j] ?? "").toString().trim().toLowerCase();

        // empty
        if (cell === undefined || cell === "") {
          errors.push({
            sheetIdx,
            row: 1,
            col: j,
            message: "Empty field - please fill this field"
          });
          continue;
        }

        // final_value integer
        if (headerName === "final_value") {
          if (!Number.isInteger(Number(cell))) {
            errors.push({
              sheetIdx,
              row: 1,
              col: j,
              message: "Final value must be an integer"
            });
          }
        }

        // purpose_id
        if (headerName === "purpose_id") {
          if (!allowedPurposeIds.includes(Number(cell))) {
            errors.push({
              sheetIdx,
              row: 1,
              col: j,
              message: `Invalid purpose ID - Allowed: ${allowedPurposeIds.join(", ")}`
            });
          }
        }

        // value_premise_id
        if (headerName === "value_premise_id") {
          if (!allowedValuePremiseIds.includes(Number(cell))) {
            errors.push({
              sheetIdx,
              row: 1,
              col: j,
              message: `Invalid value premise - Allowed: ${allowedValuePremiseIds.join(", ")}`
            });
          }
        }

        // date validations
        if (headerName === "valued_at" || headerName === "submitted_at" || headerName === "inspection_date") {
          if (!validateDate(cell)) {
            errors.push({
              sheetIdx,
              row: 1,
              col: j,
              message: `Invalid date in ${headerName} field - must be in DD/MM/YYYY format`
            });
          }
        }
      }
    } else {
      // For sheets 2 and 3, check all data rows
      const maxCols = Math.max(...sheet.map(row => rowLength(row)));

      for (let i = 1; i < sheet.length; i++) {
        const row = sheet[i];
        const rowLen = rowLength(row);

        for (let j = 0; j < maxCols; j++) {
          const cell = j < rowLen ? row[j] : undefined;
          const headerName = (sheet[0][j] ?? "").toString().trim().toLowerCase();

          // empty
          if (cell === undefined || cell === "") {
            errors.push({
              sheetIdx,
              row: i,
              col: j,
              message: "Empty field - please fill this field"
            });
            continue;
          }

          // final_value integer
          if (headerName === "final_value") {
            if (!Number.isInteger(Number(cell))) {
              errors.push({
                sheetIdx,
                row: i,
                col: j,
                message: "Final value must be an integer"
              });
            }
          }

          // purpose_id
          if (headerName === "purpose_id") {
            if (!allowedPurposeIds.includes(Number(cell))) {
              errors.push({
                sheetIdx,
                row: i,
                col: j,
                message: `Invalid purpose ID - Allowed: ${allowedPurposeIds.join(", ")}`
              });
            }
          }

          // value_premise_id
          if (headerName === "value_premise_id") {
            if (!allowedValuePremiseIds.includes(Number(cell))) {
              errors.push({
                sheetIdx,
                row: i,
                col: j,
                message: `Invalid value premise - Allowed: ${allowedValuePremiseIds.join(", ")}`
              });
            }
          }

          // date validations
          if (headerName === "valued_at" || headerName === "submitted_at" || headerName === "inspection_date") {
            if (!validateDate(cell)) {
              errors.push({
                sheetIdx,
                row: i,
                col: j,
                message: `Invalid date in ${headerName} field - must be in DD/MM/YYYY format`
              });
            }
          }
        }
      }
    }
  }

  // Add report value mismatch error if exists
  if (!isReportValueValid) {
    const sheet1 = sheets[0];
    if (sheet1 && sheet1.length >= 2) {
      const valueIdx = sheet1[0]?.findIndex((h: any) => h && h.toString().trim().toLowerCase() === "value");
      if (valueIdx !== -1) {
        errors.push({
          sheetIdx: 0,
          row: 1,
          col: valueIdx,
          message: "Report value does not equal sum of asset final values"
        });
      }
    }
  }



  const results: ValidationResults = {
    hasEmptyFields: hasEmptyFields(sheets).hasEmpty,
    hasFractionInFinalValue: hasFractionInFinalValue(sheets),
    hasInvalidPurposeId: hasInvalidPurposeId(sheets),
    hasInvalidValuePremiseId: hasInvalidValuePremiseId(sheets),
    hasMissingRequiredHeaders: !hasAllRequiredHeaders(sheets),
    isReportValueValid,
    totalErrors: errors.length
  };

  return { errors, results };
}

// Add this to your validations.ts file

// ID-specific validation for 2 sheets only (identical to last 2 sheets in ExcelTest)
export function validateIDExcelData(sheets: any[][][]): { errors: ValidationError[]; results: ValidationResults } {
  const errors: ValidationError[] = [];
  
  // Validate that we have exactly 2 sheets
  if (sheets.length !== 2) {
    errors.push({
      sheetIdx: 0,
      row: 0,
      col: 0,
      message: "ID Excel test requires exactly 2 sheets"
    });
    
    return {
      errors,
      results: {
        hasEmptyFields: true,
        hasFractionInFinalValue: false,
        hasInvalidPurposeId: false,
        hasInvalidValuePremiseId: false,
        hasMissingRequiredHeaders: true,
        isReportValueValid: false,
        totalErrors: errors.length
      }
    };
  }

  // Check for missing required headers in both sheets (using sheet indices 1 and 2 from the original validation)
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const originalSheetIdx = sheetIdx + 1; // Map to sheets 1 and 2 from the 3-sheet system
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length === 0) continue;
    
    const missingHeaders = hasMissingRequiredHeaders(sheet, originalSheetIdx);
    if (missingHeaders.length > 0) {
      errors.push({
        sheetIdx,
        row: 0,
        col: 0,
        message: `Missing required headers: ${missingHeaders.join(', ')}`
      });
    }
  }

  // Validate both sheets as asset sheets (similar to sheets 1 and 2 in the 3-sheet system)
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const sheet = sheets[sheetIdx];
    if (!sheet || sheet.length < 2) continue;

    // For both asset sheets, check all data rows
    const maxCols = Math.max(...sheet.map(row => rowLength(row)));

    for (let i = 1; i < sheet.length; i++) {
      const row = sheet[i];
      const rowLen = rowLength(row);

      for (let j = 0; j < maxCols; j++) {
        const cell = j < rowLen ? row[j] : undefined;
        const headerName = (sheet[0][j] ?? "").toString().trim().toLowerCase();

        // empty
        if (cell === undefined || cell === "") {
          errors.push({
            sheetIdx,
            row: i,
            col: j,
            message: "Empty field - please fill this field"
          });
          continue;
        }

        // final_value integer
        if (headerName === "final_value") {
          if (!Number.isInteger(Number(cell))) {
            errors.push({
              sheetIdx,
              row: i,
              col: j,
              message: "Final value must be an integer"
            });
          }
        }

        // purpose_id
        if (headerName === "purpose_id") {
          if (!allowedPurposeIds.includes(Number(cell))) {
            errors.push({
              sheetIdx,
              row: i,
              col: j,
              message: `Invalid purpose ID - Allowed: ${allowedPurposeIds.join(", ")}`
            });
          }
        }

        // value_premise_id
        if (headerName === "value_premise_id") {
          if (!allowedValuePremiseIds.includes(Number(cell))) {
            errors.push({
              sheetIdx,
              row: i,
              col: j,
              message: `Invalid value premise - Allowed: ${allowedValuePremiseIds.join(", ")}`
            });
          }
        }

        // date validations
        if (headerName === "valued_at" || headerName === "submitted_at" || headerName === "inspection_date") {
          if (!validateDate(cell)) {
            errors.push({
              sheetIdx,
              row: i,
              col: j,
              message: `Invalid date in ${headerName} field - must be in DD/MM/YYYY format`
            });
          }
        }
      }
    }
  }

  const results: ValidationResults = {
    hasEmptyFields: hasEmptyFields(sheets).hasEmpty,
    hasFractionInFinalValue: hasFractionInFinalValue(sheets),
    hasInvalidPurposeId: hasInvalidPurposeId(sheets),
    hasInvalidValuePremiseId: hasInvalidValuePremiseId(sheets),
    hasMissingRequiredHeaders: !hasAllRequiredHeadersForID(sheets),
    isReportValueValid: true, // No report value validation for ID test
    totalErrors: errors.length
  };

  return { errors, results };
}

// Helper function to check if all required headers are present for ID test (2 sheets only)
export function hasAllRequiredHeadersForID(sheets: any[][][]) {
  if (sheets.length < 2) return false;
  
  for (let sheetIdx = 0; sheetIdx < 2; sheetIdx++) {
    const originalSheetIdx = sheetIdx + 1; // Map to sheets 1 and 2 from the 3-sheet system
    const missingHeaders = hasMissingRequiredHeaders(sheets[sheetIdx], originalSheetIdx);
    if (missingHeaders.length > 0) {
      return false;
    }
  }
  return true;
}