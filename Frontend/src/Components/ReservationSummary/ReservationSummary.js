import Styles from "./ReservationSummary.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ReservationSummary = ({
  dfNumber,
  dfDateTime,
  dfPrice,
  rfNumber,
  rfDateTime,
  rfPrice,
  cabin,
  seats,
  totalPrice,
  accordionOpen,
}) => {
    const [accordExpanded]
  return (
    <div>
      <Accordion expanded={accordionOpen}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{`Reservation ${dfNumber != null ? dfNumber : ""}${
            rfNumber != null ? rfNumber : ""
          } Summary`}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ReservationSummary;
