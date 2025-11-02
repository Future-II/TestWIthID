import React from 'react';
interface TableColumn {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => React.ReactNode;
}
interface TableProps {
  columns: TableColumn[];
  data: any[];
  selectable?: boolean;
  selectedRows?: number[];
  onRowSelect?: (rowId: number) => void;
  onSelectAll?: () => void;
}
const Table: React.FC<TableProps> = ({
  columns,
  data,
  selectable = false,
  selectedRows = [],
  onRowSelect,
  onSelectAll
}) => {
  return <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {selectable && <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" onChange={onSelectAll} />
              </th>}
            {columns.map((column, index) => <th key={index} scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.header}
              </th>)}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
              {selectable && <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" checked={selectedRows.includes(rowIndex)} onChange={() => onRowSelect && onRowSelect(rowIndex)} />
                </td>}
              {columns.map((column, colIndex) => <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {column.render ? column.render(row[column.accessor], row) : row[column.accessor]}
                </td>)}
            </tr>)}
        </tbody>
      </table>
    </div>;
};
export default Table;