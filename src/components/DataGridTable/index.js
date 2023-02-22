import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import "./index.css"

function Table({ rowData, colData, onRowSelect, isLoading }) {
  const [tableRowData, setTableRowData] = useState([])
  const [pageSize, setPageSize] = useState(5)

  const updateRowData = () => {
    setTableRowData(rowData.map((doc, index) => ({ ...doc, id: index + 1 })))
  }

  useEffect(() => {
    if (rowData && rowData.length > 0) {
      updateRowData()
    }
  }, [rowData])


  return (
    <div className='TableContainer' >
      <DataGrid
        onRowClick={onRowSelect}
        loading={isLoading}
        rowsPerPageOptions={[5, 10, 25]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        columns={colData}
        rows={tableRowData}
        pagination
        paginationMode='client'
        density='standard'
      />
    </div>
  )
}

export default Table