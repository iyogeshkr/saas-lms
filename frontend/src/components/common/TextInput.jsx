import { TextField } from "@mui/material";

const TextInput = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  helperText,
  ...props
}) => {
  return (
    <TextField
      fullWidth
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      variant="outlined"
      margin="normal"
      {...props}
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
        "& .MuiFormHelperText-root": {
          marginLeft: 0,
        },
        "& .Mui-error": {
          boxShadow: "0 6px 18px rgba(244,67,54,0.2)",
        },
        ...props.sx,
      }}
    />
  );
};

export default TextInput;
