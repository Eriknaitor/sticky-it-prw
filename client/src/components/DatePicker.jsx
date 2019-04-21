import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subDays } from 'date-fns';


export default class CustomDatePicker extends React.Component {
    state = {
        setDate: null
    }

    handleChange(date) {
        this.props.onChange(date);
        this.setState({ setDate: date })
    }

    render() {
        return (
            <div className="date-picker">
                <DatePicker
                    name="rememberDate"
                    minDate={subDays(new Date(), -1)}
                    selected={this.state.setDate}
                    onChange={this.handleChange.bind(this)}
                    placeholderText="Fecha"
                    dateFormat={'MMMM d, yyyy'}
                />
            </div>
        )
    }
}