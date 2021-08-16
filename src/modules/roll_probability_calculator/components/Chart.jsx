import React from "react";

export default class Chart extends React.Component {
    static BASE_COLOR = '#2A2A2C'
    static SELECTED_COLOR = '#007933'

    constructor(props) { //console.debug("in Chart.constructor",arguments);
        super(props)

        this.canvasRef = React.createRef()

        this.width = this.props.width
        this.height = this.props.height

        this.draw = this.draw.bind(this)
        //this.clear = this.clear.bind(this)
        this.render = this.render.bind(this)
        //this.componentDidUpdate = this.componentDidUpdate.bind(this)
    }

    componentDidMount() { //console.debug("DEBUG - in Chart.componentDidMount()");
        this.draw();
    }

    draw() { //console.debug("DEBUG - in Chart.draw()");
        const canvas = this.canvasRef.current,
            ctx = canvas.getContext("2d"),
            roll = this.props.roll,
            odds = roll.rollSumOddsList,
            barWidth = (this.width - odds.length)/odds.length,
            maxValue = odds.reduce( (p,c) => c.percentage>p ? c.percentage : p, 0 )
        
        for(let i=0; i<odds.length; i++){
            const rollSumOdds = odds[i],
                barHeight = this.height * (rollSumOdds.percentage/maxValue);

            ctx.fillStyle = Chart.BASE_COLOR;
            if ( this.props.target.isMatch(rollSumOdds.rollSum) ) {
                ctx.fillStyle = Chart.SELECTED_COLOR;
            }
            
            ctx.fillRect((barWidth*i)+i, this.height, barWidth, -1*barHeight);
        }

    }

    // clear() { console.debug("DEBUG - in Chart.clear()");
    //     $( this.canvasRef.current ).remove()
    // }

    render() { //console.debug("DEBUG - in Chart.render()");
        return(
        <canvas ref={ this.canvasRef }
            width={ this.props.width }
            height={ this.props.height }/>
        );
    }
}