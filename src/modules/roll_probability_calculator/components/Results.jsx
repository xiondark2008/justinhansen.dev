import React from "react";
import Chart from '@/roll_probability/components/Chart.jsx'

export default class Results extends React.Component {
    constructor(props){ //console.debug("in Results.constructor",arguments);
        super(props)
    }

    render(){ //console.debug("in Results.render()",arguments);
        //const canvasWidth = (typeof document == undefined ? document.body.clientWidth : 200)

        return(
        <div>
            <h3>{ this.props.roll.oddsOfGetting(this.props.target) }</h3>
            <Chart
                roll={ this.props.roll }
                target={ this.props.target }
            />
        </div>
        );
    }
}