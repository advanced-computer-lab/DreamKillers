import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function DropDownDK({ dropItems, helperText, value, onChange }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="outlined-select-currency"
          select
          label={helperText}
          value={value}
          onChange={handleChange}
        >
          {dropItems.map((dropItem) => (
            <MenuItem key={dropItem} value={dropItem}>
              {dropItem}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </Box>
  );
}
