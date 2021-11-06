import * as React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DateTimePicker from "@material-ui/lab/DateTimePicker";
import ButtonDK from "../ButtonDK/ButtonDK";

export default function DateTimePickerDK({ label, onChange }) {
  const [value, setValue] = React.useState(null);

  const handleChange = (newValue) => {
    setValue(newValue);
    let date = new Date(
      new Date(newValue.setSeconds(0)).setHours(newValue.getHours() + 2)
    );
    onChange(date);
  };

  const resetFunc = () => {
    setValue(null);
    onChange(value);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label={label}
        value={value}
        onChange={handleChange}
      />
      <br></br>
      <ButtonDK buttonText="Reset" onClick={resetFunc} />
    </LocalizationProvider>
  );
}
