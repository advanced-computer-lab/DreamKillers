import Styles from "./ReservationSummary.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faUser, faBook } from "@fortawesome/free-solid-svg-icons";
import EmailIcon from "@mui/icons-material/Email";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import BadgeIcon from "@mui/icons-material/Badge";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const ReservationSummary = ({
  reservationID,
  dfNumber,
  dfDateTime,
  dfPrice,
  rfNumber,
  rfDateTime,
  rfPrice,
  cabin,
  dfSeats,
  rfSeats,
  accordionDefaultOpen,
}) => {
  return (
    <div>
      <Accordion expanded={accordionDefaultOpen}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{`Reservation #${
            reservationID != null ? reservationID : ""
          } Summary`}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={Styles.UserDisplay}>
            <div className={Styles.UserDetailsContainer}>
              <div className={Styles.DisplayComponent}>
                <div className={Styles.Icon}>
                  <FlightTakeoffIcon></FlightTakeoffIcon>
                </div>
                <p className={Styles.Text}>Departure Flight:</p>
                <p className={Styles.ParText}>{`#${dfNumber}`}</p>
              </div>

              <div className={Styles.DisplayComponent}>
                <div className={Styles.Icon}>
                  <DateRangeIcon></DateRangeIcon>
                </div>
                <p className={Styles.Text}> Departure Flight Date:</p>
                <p className={Styles.ParText}>{`${dfDateTime}`}</p>
              </div>

              <div className={Styles.DisplayComponent}>
                <div className={Styles.Icon}>
                  <LocalAtmIcon></LocalAtmIcon>
                </div>
                <p className={Styles.Text}> Departure Flight Price:</p>
                <p className={Styles.ParText}>{`$${dfPrice}`}</p>
              </div>

              <div className={Styles.DisplayComponent}>
                <div className={Styles.Icon}>
                  <AirlineSeatReclineNormalIcon></AirlineSeatReclineNormalIcon>
                </div>
                <p className={Styles.Text}> Departure Flight Seat(s):</p>
                <p className={Styles.ParText}>{`${dfSeats}`}</p>
              </div>

              <div className={Styles.DisplayComponent}>
                <div className={Styles.Icon}>
                  <AirlineSeatReclineExtraIcon></AirlineSeatReclineExtraIcon>
                </div>
                <p className={Styles.Text}> Flight Cabin:</p>
                <p className={Styles.ParText}>{`${cabin}`}</p>
              </div>
            </div>

            <div className={Styles.UserDetailsContainer}>
              <div className={Styles.DisplayComponent}>
                <div className={Styles.Icon}>
                  <FlightLandIcon></FlightLandIcon>
                </div>
                <p className={Styles.Text}> Return Flight:</p>
                <p className={Styles.ParText}>{`#${rfNumber}`}</p>
              </div>

              <div className={Styles.DisplayComponent}>
                <div className={Styles.Icon}>
                  <DateRangeIcon></DateRangeIcon>
                </div>
                <p className={Styles.Text}> Return Flight Date:</p>
                <p className={Styles.ParText}>{`${rfDateTime}`}</p>
              </div>

              <div className={Styles.DisplayComponent}>
                <div className={Styles.Icon}>
                  <LocalAtmIcon></LocalAtmIcon>
                </div>
                <p className={Styles.Text}> Return Flight Price:</p>
                <p className={Styles.ParText}>{`$${rfPrice}`}</p>
              </div>

              <div className={Styles.DisplayComponent}>
                <div className={Styles.Icon}>
                  <AirlineSeatReclineNormalIcon></AirlineSeatReclineNormalIcon>
                </div>
                <p className={Styles.Text}> Return Flight Seat(s):</p>
                <p className={Styles.ParText}>{`${rfSeats}`}</p>
              </div>

              <div className={Styles.DisplayComponent}>
                <div className={Styles.Icon}>
                  <MonetizationOnIcon></MonetizationOnIcon>
                </div>
                <p className={Styles.Text}> Total Price:</p>
                <p className={Styles.ParText}>{`${
                  parseInt(rfPrice) + parseInt(dfPrice)
                }`}</p>
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ReservationSummary;
