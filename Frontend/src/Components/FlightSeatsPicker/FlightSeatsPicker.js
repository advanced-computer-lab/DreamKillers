import React, {Component} from 'react'
 
import SeatPicker from 'react-seat-picker'
 
export default class App extends Component {
  state = {
    loading: false
  }
 
  addSeatCallback = ({ row, number, id}, addCb) => {
    this.setState({
      loading: true
    }, async () => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      // console.log(`Added seat ${number}, row ${row}, id ${id}`)
      const newTooltip = `Reserved by You`
      addCb(row, number, id, newTooltip)
      this.setState({ loading: false })
    })
  }
 
  addSeatCallbackContinousCase = ({ row, number, id }, addCb, params, removeCb) => {
    this.setState({
      loading: true
    }, async () => {
      if (removeCb) {
        await new Promise(resolve => setTimeout(resolve, 750))
        // console.log(`Removed seat ${params.number}, row ${params.row}, id ${params.id}`)
        removeCb(params.row, params.number)
      }
      await new Promise(resolve => setTimeout(resolve, 750))
      // console.log(`Added seat ${number}, row ${row}, id ${id}`)
      const newTooltip = `Reserved by You`
      addCb(row, number, id, newTooltip)
      this.setState({ loading: false })
    })
  }
 
  removeSeatCallback = ({ row, number, id }, removeCb) => {
    this.setState({
      loading: true
    }, async () => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      // console.log(`Removed seat ${number}, row ${row}, id ${id}`)
      // A value of null will reset the tooltip to the original while '' will hide the tooltip
      const newTooltip = ['A', 'B', 'C'].includes(row) ? null : ''
      removeCb(row, number, newTooltip)
      this.setState({ loading: false })
    })
  }
 
  render() {
    const rows = [
      [{id: 1, number: 1, isSelected: true, tooltip: 'Business Class, cost: 20$'}, {id: 2, number: 2, tooltip: 'Business Class, cost: 20$'}, null, {id: 3, number: '3', isReserved: true, orientation: 'east', tooltip: 'Business Class: Reserved by Roger'}, {id: 4, number: '4', orientation: 'west', tooltip: 'Business Class, cost: 20$'}, null, {id: 5, number: 5, tooltip: 'Business Class, cost: 20$'}, {id: 6, number: 6, tooltip: 'Business Class, cost: 20$'}],
      [{id: 7, number: 1, isReserved: true, tooltip: 'Business Class: Reserved by Mark Antonio'}, {id: 8, number: 2, isReserved: true, tooltip: 'Business Class: Reserved by Mark Antonio'}, null, {id: 9, number: '3', isReserved: true, orientation: 'east', tooltip: 'Business Class: Reserved by Mark Antonio'}, {id: 10, number: '4', orientation: 'west', tooltip: 'Business Class, cost: 20$'}, null, {id: 11, number: 5, tooltip: 'Business Class, cost: 20$'}, {id: 12, number: 6, tooltip: 'Business Class, cost: 20$'}],
      [{id: 13, number: 1, tooltip: 'Economy Class, cost: 13$'}, {id: 14, number: 2, tooltip: 'Economy Class, cost: 13$'}, null, {id: 15, number: 3, isReserved: true, orientation: 'east', tooltip: 'Economy Class, Reserved by Pamela Watson'}, {id: 16, number: '4', orientation: 'west', tooltip: 'Economy Class, cost: 13$'}, null, {id: 17, number: 5, tooltip: 'Economy Class, cost: 13$'}, {id: 18, number: 6, tooltip: 'Economy Class, cost: 13$'}],
      [{id: 19, number: 1, tooltip: 'Economy Class, cost: 13$'}, {id: 20, number: 2, tooltip: 'Economy Class, cost: 13$'}, null, {id: 21, number: 3, orientation: 'east', tooltip: 'Economy Class, cost: 13$'}, {id: 22, number: '4', orientation: 'west', tooltip: 'Economy Class, cost: 13$'}, null, {id: 23, number: 5, tooltip: 'Economy Class, cost: 13$'}, {id: 24, number: 6, tooltip: 'Economy Class, cost: 13$'}],
      [{id: 25, number: 1, isReserved: true, tooltip: 'Economy Class, Reserved by Brenda Lamarr'}, {id: 26, number: 2, orientation: 'east', tooltip: 'Economy Class, cost: 13$'}, null, {id: 27, number: '3', isReserved: true, tooltip: 'Economy Class, Reserved by Brenda Lamarr'}, {id: 28, number: '4', orientation: 'west', tooltip: 'Economy Class, cost: 13$'}, null,{id: 29, number: 5, tooltip: 'Economy Class, cost: 13$'}, {id: 30, number: 6, isReserved: true, tooltip: 'Economy Class, Reserved by Kent Franklin'}]
    ]
    const {loading} = this.state
    return (
      <div>
        <h1>Seat Picker</h1>
        <div style={{marginTop: '100px'}}>
          <SeatPicker
            addSeatCallback={this.addSeatCallback}
            removeSeatCallback={this.removeSeatCallback}
            rows={rows}
            maxReservableSeats={this.props.seatNumber}
            alpha
            visible
            selectedByDefault
            loading={loading}
            tooltipProps={{multiline: true}}
          />
        </div>
        <h1>Seat Picker Continuous Case</h1>
        <div style={{ marginTop: '100px' }}>
          <SeatPicker
            addSeatCallback={this.addSeatCallbackContinousCase}
            removeSeatCallback={this.removeSeatCallback}
            rows={rows}
            maxReservableSeats={3}
            alpha
            visible
            selectedByDefault
            loading={loading}
            tooltipProps={{ multiline: true }}
            continuous
          />
        </div>
      </div>
    )
    }
}
