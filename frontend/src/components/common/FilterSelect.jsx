import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

const FilterSelect = ({
  label,
  value,
  onChange,
  options = [],
  multiple = false,
  ...props
}) => {
  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 180,
        backgroundColor: "#fff",
        borderRadius: 2,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
        ...props.sx,
      }}
    >
      <InputLabel>
        <Box display="flex" alignItems="center" gap={0.5}>
          <FilterListIcon fontSize="small" />
          {label}
        </Box>
      </InputLabel>

      <Select
        label={label}
        value={value}
        onChange={onChange}
        multiple={multiple}
        renderValue={(selected) => {
          if (!multiple) return selected;
          return (
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {selected.map((val) => (
                <Chip
                  key={val}
                  label={options.find((o) => o.value === val)?.label || val}
                  size="small"
                />
              ))}
            </Box>
          );
        }}
        sx={{
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
          },
        }}
        {...props}
      >
        <MenuItem value="all">
          <em>All</em>
        </MenuItem>

        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;
