import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Typography,
} from "@mui/material";

const DataTable = ({
  columns,
  data,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  title,
}) => {
  return (
    <Paper
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
      }}
    >
      {/* Optional Header */}
      {title && (
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid #eee",
            background: "linear-gradient(135deg, #f7f9ff, #eef1ff)",
          }}
        >
          <Typography variant="h6" fontWeight="600">
            {title}
          </Typography>
        </Box>
      )}

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: "#f5f7fb",
                    color: "text.secondary",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    backgroundColor:
                      index % 2 === 0 ? "transparent" : "#fafafa",
                    transition: "0.2s",
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align || "left"}
                      sx={{ py: 1.5 }}
                    >
                      {row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No records found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: "1px solid #eee",
          backgroundColor: "#fafafa",
        }}
      />
    </Paper>
  );
};

export default DataTable;
