import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DataTableHead from './DataTableHead';
import { TextField } from '@mui/material';
import { CSVLink } from "react-csv"

function descendingComparator(a, b, orderBy, type) {
    if (type === "date") {
        if (new Date(b[orderBy]) < new Date(a[orderBy])) {
            return -1;
        }
        if (new Date(b[orderBy]) > new Date(a[orderBy])) {
            return 1;
        }
    } else if (type === "number") {
        if (parseFloat(b[orderBy]) < parseFloat(a[orderBy])) {
            return -1;
        }
        if (parseFloat(b[orderBy]) > parseFloat(a[orderBy])) {
            return 1;
        }
    } else {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
    }

    return 0;
}

function getComparator(
    order,
    orderBy,
    type
) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy, type)
        : (a, b) => -descendingComparator(a, b, orderBy, type);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);

}
const colData = [
    { id: "BillingPeriodStartDate", label: "Billing Period StartDate" },
    { id: "ResourceGroup", label: "Resource Group" },
    { id: "Cost", label: "Cost" },

]

export default function EnhancedTable({ rowData, onRowSelect }) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('');
    const [selected, setSelected] = React.useState(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(8);
    const [searchKey, setSearchKey] = React.useState("")
    const rows = rowData && rowData.length > 0 ? rowData : []
    const sortType = orderBy === "BillingPeriodStartDate" ? "date" : orderBy === "Cost" ? "number" : "alpha"

    const handleRequestSort = (
        event,
        property,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleClick = (event, row) => {
        const { id } = row;
        setSelected(id);
        onRowSelect && typeof onRowSelect === "function" && onRowSelect(row);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const currencyConverter = (currencyString) => {
        const currency = parseFloat(currencyString);
        if (typeof currency === "number") {
            return "$ " + currency.toFixed(2)
        }
        return "$ " + currencyString
    }

    const searchKeyChange = (e) => {
        const { value } = e.target
        setSearchKey(value)
    }

    const csvHeader = [
        { label: "Billing Period Start Date", key: "BillingPeriodStartDate" },
        { label: "Resource Group", key: "ResourceGroup" },
        { label: "Cost", key: "Cost" },
        { label: "Age", key: "age" }
    ]

    const csvReport = {
        data: rowData,
        headers: csvHeader,
        filename: 'Report.csv'
    };

    const dataSearch = (data) => {
        const filterData = { ...data }
        delete filterData.id
        let flag = true
        const isFiltered = []
        if (searchKey) {
            for (const dataKey in filterData) {
                const dataValue = data[dataKey];

                if (!dataValue.toLowerCase().includes(searchKey.toLowerCase())) {
                    isFiltered.push(false)
                } else {
                    isFiltered.push(true)
                }
            }
            flag = isFiltered.includes(true)
        }
        return flag
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2, padding: "0 1rem" }}>
                <header style={{ padding: "2rem 0", display: "flex", alignItems: "center" }}  >
                    <TextField
                        id="search-field"
                        value={searchKey}
                        onChange={searchKeyChange}
                        placeholder="Search..."
                        label="Search"
                    />
                    <div style={{ padding: "0 1rem" }} >
                        <CSVLink style={{ textDecoration: "none", color: "black", padding: "0.5rem 2rem", border: "1px solid gray", borderRadius: "8px" }} {...csvReport} >Export to CSV</CSVLink>
                    </div>
                </header>
                <TableContainer style={{ maxHeight: 500 }} >
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        stickyHeader
                    >
                        <DataTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            headCell={colData}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy, sortType))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .filter(row => dataSearch(row))
                                .map((row, index) => {

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row)}
                                            key={index}
                                            selected={selected && selected === row.id}
                                        >
                                            <TableCell align='left'> {row.BillingPeriodStartDate}</TableCell>
                                            <TableCell align="left">{row.ResourceGroup}</TableCell>
                                            <TableCell align="left">{currencyConverter(row.Cost)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[8, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
