import { Box, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from '@mui/utils';


function DataTableHead(props) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler =
        (property) => (event) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>

                {props.headCell.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default DataTableHead