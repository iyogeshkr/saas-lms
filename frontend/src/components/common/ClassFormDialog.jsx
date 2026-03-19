import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Button,
  Box,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClassIcon from "@mui/icons-material/Class";

const ClassFormDialog = ({
  open,
  onClose,
  onSubmit,
  editMode,
  formData,
  onFormChange,
  teachers = [],
  sections = [],
  academicYears = [],
  selectedClass = null,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          px: 3,
          py: 2.5,
          background: "linear-gradient(135deg,#667eea,#764ba2)",
          color: "#fff",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <ClassIcon />
            <Typography variant="h6" fontWeight={700}>
              {editMode ? "Edit Class" : "Add New Class"}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={onSubmit}>
        {/* CONTENT */}
        <DialogContent sx={{ p: 3 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Fill in the class details below. All fields are required.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Class Name"
                name="className"
                value={formData.className}
                onChange={onFormChange}
                required
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Section</InputLabel>
                <Select
                  label="Section"
                  name="section"
                  value={formData.section}
                  onChange={onFormChange}
                  required
                >
                  <MenuItem value="">
                    <em>Select Section</em>
                  </MenuItem>
                  {sections.map((section) => (
                    <MenuItem key={section.value} value={section.value}>
                      {section.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Class Teacher</InputLabel>
                <Select
                  label="Class Teacher"
                  name="classTeacher"
                  value={formData.classTeacher}
                  onChange={onFormChange}
                  required
                >
                  <MenuItem value="">
                    <em>Select Teacher</em>
                  </MenuItem>
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.name}>
                      {teacher.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Room Number"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={onFormChange}
                required
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Academic Year</InputLabel>
                <Select
                  label="Academic Year"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={onFormChange}
                  required
                >
                  {academicYears.map((year) => (
                    <MenuItem key={year.value} value={year.value}>
                      {year.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Students"
                name="maxStudents"
                type="number"
                value={formData.maxStudents}
                onChange={onFormChange}
                required
                size="small"
                InputProps={{ inputProps: { min: 1, max: 100 } }}
              />
            </Grid>

            {/* EDIT MODE INFO */}
            {editMode && selectedClass && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "grey.50",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Current Class Information
                  </Typography>

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Class ID:</strong> {selectedClass.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Students:</strong> {selectedClass.students}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        {/* FOOTER */}
        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 2,
            bgcolor: "grey.50",
          }}
        >
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              px: 4,
              borderRadius: 2,
              background: "linear-gradient(135deg,#667eea,#764ba2)",
              "&:hover": {
                background: "linear-gradient(135deg,#5a67d8,#6b46c1)",
              },
            }}
          >
            {editMode ? "Update Class" : "Add Class"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ClassFormDialog;
