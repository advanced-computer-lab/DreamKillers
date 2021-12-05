import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { styles } from "@material-ui/lab/internal/pickers/PickersArrowSwitcher";

export default function DropDownDK({
  dropItems,
  helperText,
  value,
  onChange,
  isRequired,
  note,
}) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Box
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
    >
      <div className={styles.box}>
        <TextField
          id="outlined-select-currency"
          select
          label={helperText}
          value={value}
          helperText={note}
          required={isRequired || false}
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
