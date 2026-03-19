import React from "react";
import {
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({
  placeholder = "Search...",
  value,
  onChange,
  ...props
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 320,
      }}
    >
      <TextField
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        size="small"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                fontSize="small"
                sx={{ color: "text.secondary" }}
              />
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: "#fff",
          borderRadius: 999,
          "& .MuiOutlinedInput-root": {
            borderRadius: 999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            transition: "0.2s",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
            },
            "&.Mui-focused": {
              boxShadow: "0 8px 20px rgba(102,126,234,0.3)",
            },
          },
          ...props.sx,
        }}
        {...props}
      />
    </Box>
  );
};

export default SearchBar;
