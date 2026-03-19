import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  IconButton,
  Alert,
  Snackbar,
  Chip,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClassIcon from "@mui/icons-material/Class";

import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import FilterSelect from "../../components/common/FilterSelect";
import ClassFormDialog from "../../components/common/ClassFormDialog";

const ManageClasses = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    className: "",
    section: "",
    classTeacher: "",
    roomNumber: "",
    academicYear: "2024-2025",
    maxStudents: 40,
  });

  const [classes, setClasses] = useState([
    { id: 1, className: "Class 1", section: "A", classTeacher: "John Doe", students: 30, roomNumber: "101", academicYear: "2024-2025" },
    { id: 2, className: "Class 2", section: "B", classTeacher: "Jane Smith", students: 28, roomNumber: "102", academicYear: "2024-2025" },
    { id: 3, className: "Class 3", section: "A", classTeacher: "Robert Johnson", students: 32, roomNumber: "103", academicYear: "2024-2025" },
  ]);

  const teachers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Robert Johnson" },
  ];

  const sections = [
    { value: "A", label: "Section A" },
    { value: "B", label: "Section B" },
    { value: "C", label: "Section C" },
  ];

  const academicYears = [
    { value: "2023-2024", label: "2023-2024" },
    { value: "2024-2025", label: "2024-2025" },
    { value: "2025-2026", label: "2025-2026" },
  ];

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.classTeacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSection =
      sectionFilter === "all" || cls.section === sectionFilter;

    return matchesSearch && matchesSection;
  });

  const columns = [
    { id: "id", label: "ID", align: "center" },
    { id: "className", label: "Class Name" },
    {
      id: "section",
      label: "Section",
      align: "center",
      format: (value) => <Chip label={value} size="small" color="primary" />,
    },
    { id: "classTeacher", label: "Class Teacher" },
    {
      id: "students",
      label: "Students",
      align: "center",
      format: (value) => <Typography fontWeight={600}>{value}</Typography>,
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      format: (_, row) => (
        <Box display="flex" justifyContent="center" gap={1}>
          <IconButton
            size="small"
            onClick={() => handleEdit(row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(row.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleEdit = (cls) => {
    setEditMode(true);
    setSelectedClass(cls);
    setFormData({ ...cls });
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setClasses(classes.filter((c) => c.id !== id));
    setSnackbar({
      open: true,
      message: "Class deleted successfully",
      severity: "success",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSnackbar({
      open: true,
      message: editMode ? "Class updated successfully" : "Class added successfully",
      severity: "success",
    });
    setOpenDialog(false);
  };

  return (
    <DashboardLayout role="admin" userName="Admin User">
      {/* PAGE HEADER */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg,#667eea,#764ba2)",
          color: "#fff",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <ClassIcon />
          <Typography variant="h4" fontWeight={700}>
            Manage Classes
          </Typography>
        </Box>
        <Typography sx={{ opacity: 0.9, mt: 1 }}>
          Create, edit, and manage school classes efficiently
        </Typography>
      </Paper>

      {/* CONTENT */}
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        {/* TOP BAR */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="h6" fontWeight={600}>
            Classes List
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add Class
          </Button>
        </Box>

        {/* FILTERS */}
        <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <SearchBar
                placeholder="Search class, teacher, room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FilterSelect
                label="Section"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                options={sections}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant="outlined">
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Showing {filteredClasses.length} of {classes.length} classes
        </Typography>

        <DataTable
          columns={columns}
          data={filteredClasses}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={(_, p) => setPage(p)}
          handleChangeRowsPerPage={(e) => setRowsPerPage(+e.target.value)}
        />
      </Paper>

      {/* FORM DIALOG */}
      <ClassFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleSubmit}
        editMode={editMode}
        formData={formData}
        onFormChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
        teachers={teachers}
        sections={sections}
        academicYears={academicYears}
        selectedClass={selectedClass}
      />

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default ManageClasses;
