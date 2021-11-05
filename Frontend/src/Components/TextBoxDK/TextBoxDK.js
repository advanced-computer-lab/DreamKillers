import TextField from "@mui/material/TextField";

const TextBoxDK = ({ text, onChange }) => {
  return (
    <TextField
      id="outlined-basic"
      label={text}
      variant="outlined"
      onChange={onChange}
    />
  );
};

export default TextBoxDK;
