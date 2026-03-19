import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

const SelectInput = ({ label, value, onChange, options = [], ...props }) => {
  return (
    <FormControl
      fullWidth
      variant="outlined"
      margin="normal"
      sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: "0.2s",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
          },
          "&.Mui-focused": {
            boxShadow: "0 8px 20px rgba(102,126,234,0.25)",
          },
        },
      }}
    >
      <InputLabel>{label}</InputLabel>

      <Select
        label={label}
        value={value}
        onChange={onChange}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: 2,
              mt: 1,
            },
          },
        }}
        {...props}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              borderRadius: 1,
              mx: 1,
              my: 0.5,
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
