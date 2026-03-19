import { Button, CircularProgress } from "@mui/material";

const SubmitButton = ({ loading = false, children, ...props }) => {
  return (
    <Button
      type="submit"
      variant="contained"
      disabled={loading}
      {...props}
      sx={{
        mt: 2,
        px: 4,
        py: 1.2,
        borderRadius: 999,
        fontWeight: 600,
        textTransform: "none",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        boxShadow: "0 6px 18px rgba(102,126,234,0.35)",
        transition: "0.2s ease",
        "&:hover": {
          background: "linear-gradient(135deg, #5a6fdc, #6b3fa0)",
          boxShadow: "0 8px 24px rgba(102,126,234,0.45)",
        },
        "&:disabled": {
          background: "#e0e0e0",
          color: "#9e9e9e",
          boxShadow: "none",
        },
        ...props.sx,
      }}
    >
      {loading ? (
        <CircularProgress
          size={22}
          sx={{ color: "#fff" }}
        />
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
