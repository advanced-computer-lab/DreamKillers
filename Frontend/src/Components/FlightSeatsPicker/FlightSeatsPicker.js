import React, { Component } from "react";

import SeatPicker from "react-seat-picker";

export default class App extends Component {
  state = {
    loading: false,
  };

  addSeatCallback = ({ row, number, id }, addCb) => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
        // console.log(`Added seat ${number}, row ${row}, id ${id}`)
        const newTooltip = `Reserved by You`;
        addCb(row, number, id, newTooltip);
        this.props.incrementSeats(row + number);
        this.setState({ loading: false });
      }
    );
  };

  removeSeatCallback = ({ row, number, id }, removeCb) => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
        // console.log(`Removed seat ${number}, row ${row}, id ${id}`)
        // A value of null will reset the tooltip to the original while '' will hide the tooltip
        const newTooltip = ["A", "B", "C"].includes(row) ? null : "";
        removeCb(row, number, newTooltip);
        this.props.decrementSeats(row + number);
        this.setState({ loading: false });
      }
    );
  };

  render() {
    const { loading } = this.state;
    return (
      <div>
        {/* <h1>Seat Picker</h1> */}
        <div style={{ marginTop: "0px" }}>
          <SeatPicker
            addSeatCallback={this.addSeatCallback}
            removeSeatCallback={this.removeSeatCallback}
            rows={this.props.rows}
            maxReservableSeats={this.props.seatNumber}
            alpha
            visible
            selectedByDefault
            loading={loading}
            tooltipProps={{ multiline: true }}
          />
        </div>
      </div>
    );
  }
}
