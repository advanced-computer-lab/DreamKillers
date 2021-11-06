import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function DropDownDK({ dropItems, helperText, value, onChange }) {
  const [item, setItem] = React.useState("");
  const [DropValue, setDropValue] = React.useState(value || "");

  const handleChange = (event) => {
    setItem(event.target.value);
    onChange(event.target.value);
  };

  React.useEffect(() => {
    setItem("");
  }, []);

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
          value={item}
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
