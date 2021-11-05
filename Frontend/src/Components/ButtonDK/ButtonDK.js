import Button from "@mui/material/Button";

const ButtonDK = ({
  variant,
  buttonText,
  color,
  textColor,
  hoverColor,
  icon,
  onClick,
}) => {
  return (
    <Button
      variant={variant}
      startIcon={icon}
      onClick={onClick}
      sx={{
        bgcolor: color,
        color: textColor,
        ":hover": {
          bgcolor: hoverColor,
        },
      }}
    >
      {buttonText}
    </Button>
  );
};

export default ButtonDK;
