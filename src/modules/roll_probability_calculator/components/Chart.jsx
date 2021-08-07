import React from "react";

export default class Chart extends React.Component {
    constructor(props) { //console.debug("in Chart.constructor",arguments);
        super(props)
        const initialWidth = 300

        this.state = {
            width: initialWidth,
            height: this.heightFromWidth( initialWidth )
        }

        this.canvasRef = React.createRef()

        this.draw = this.draw.bind(this)
        this.clear = this.clear.bind(this)
        this.heightFromWidth = this.heightFromWidth.bind(this)
    }

    componentDidMount() {
        this.setState(prevState => {
            if(typeof document !== undefined){
                const width = document.body.clientWidth

                return {
                    width: width,
                    height: this.heightFromWidth(width)
                }
            }
            
        })
    }

    componentDidUpdate() { //console.debug("Chart.componentDidUpdate()");
        this.clear()
        this.draw();
    }

    draw() { //console.debug("in Chart.draw()",arguments);
        const canvas = this.canvasRef.current,
            ctx = canvas.getContext("2d"),
            roll = this.props.roll,
            odds = roll.rollSumOddsList

        const barWidth = (canvas.width - odds.length)/odds.length,
            maxValue = odds.reduce( (p,c) => { return (c.percentage>p ? c.percentage : p); },0)
        
        for(let i=0; i<odds.length; i++){
            const rollSumOdds = odds[i],
                barHeight = canvas.height * (rollSumOdds.percentage/maxValue);

            ctx.fillStyle="#357EBD";
            if ( this.props.target.isMatch(rollSumOdds.rollSum) ) {
                ctx.fillStyle="#ED9C28";
            }
            
            ctx.fillRect((barWidth*i)+i, canvas.height, barWidth, -1*barHeight);
        }

    }

    clear() { //console.debug("in Chart.clear()",arguments);
        const canvas = this.canvasRef.current,
            ctx = canvas.getContext("2d"),
            width = this.state.width,
            height = this.state.height
        
        ctx.clearRect(0, 0, width, height);
    }

    heightFromWidth(width = this.state.width) { //console.debug("in Chart.heightFromWidth()",arguments);
        return width * (9/16)
    }

    render() { //console.debug("in Chart.render()",arguments);
        const canvasId = "graph"

        return(
        <canvas
            ref={ this.canvasRef }
            id={ canvasId }
            width={ this.state.width }
            height={ this.state.height }></canvas>
        );
    }
}