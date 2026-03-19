import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Button,
  Chip,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const TeacherAttendance = () => {
  const [date, setDate] = useState(new Date());
  const [attendance, setAttendance] = useState({});

  const students = [
    { id: 1, name: "Alice Johnson", rollNo: "101" },
    { id: 2, name: "Bob Smith", rollNo: "102" },
    { id: 3, name: "Charlie Brown", rollNo: "103" },
    { id: 4, name: "Diana Prince", rollNo: "104" },
    { id: 5, name: "Edward Wilson", rollNo: "105" },
  ];

  const handleAttendanceChange = (studentId, value) => {
    setAttendance({
      ...attendance,
      [studentId]: value,
    });
  };

  const handleSubmit = () => {
    console.log("Attendance for", date.toDateString(), ":", attendance);
  };

  return (
    <DashboardLayout role="teacher" userName="John Doe">
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          color: "#fff",
          background: "linear-gradient(135deg, #43cea2, #185a9d)",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <EventAvailableIcon />
          <Typography variant="h4" fontWeight="bold">
            Mark Attendance
          </Typography>
        </Box>
        <Typography sx={{ opacity: 0.9, mt: 1 }}>
          Select date and mark student attendance
        </Typography>
      </Paper>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h6">Attendance Sheet</Typography>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              renderInput={(params) => (
                <TextField size="small" {...params} />
              )}
            />
          </LocalizationProvider>
        </Box>

        <TableContainer
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #eee",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f7fb" }}>
                <TableCell>Roll No</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell>Remarks</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {students.map((student) => (
                <TableRow
                  key={student.id}
                  hover
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "#fafafa",
                    },
                  }}
                >
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell fontWeight={500}>{student.name}</TableCell>

                  <TableCell align="center">
                    <Select
                      value={attendance[student.id] || ""}
                      onChange={(e) =>
                        handleAttendanceChange(
                          student.id,
                          e.target.value
                        )
                      }
                      size="small"
                      displayEmpty
                      sx={{
                        minWidth: 140,
                        borderRadius: 2,
                      }}
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      <MenuItem value="present">
                        <CheckCircleIcon
                          sx={{ color: "success.main", mr: 1 }}
                        />
                        Present
                      </MenuItem>
                      <MenuItem value="absent">
                        <CancelIcon
                          sx={{ color: "error.main", mr: 1 }}
                        />
                        Absent
                      </MenuItem>
                      <MenuItem value="late">Late</MenuItem>
                      <MenuItem value="excused">Excused</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell>
                    {attendance[student.id] === "absent" ? (
                      <Chip
                        label="Reason required"
                        size="small"
                        color="warning"
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 4,
              borderRadius: 2,
            }}
            onClick={handleSubmit}
          >
            Save Attendance
          </Button>
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

export default TeacherAttendance;
