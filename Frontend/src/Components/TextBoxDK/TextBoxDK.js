import TextField from "@mui/material/TextField";

const TextBoxDK = ({ text, onChange, value, isPassword }) => {
  return (
    <TextField
      id="outlined-basic"
      label={text}
      variant="outlined"
      onChange={onChange}
      value={value}
    />
  );
};

export default TextBoxDK;
