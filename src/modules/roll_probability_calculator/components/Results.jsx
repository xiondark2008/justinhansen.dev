import React from "react";
import Chart from '@/roll_probability/components/Chart.jsx';

import style from '@/roll_probability/styles/Results.module.scss';

export default class Results extends React.Component {
    constructor(props){ //console.debug("in Results.constructor",arguments);
        super(props)

        this.containerRef = React.createRef()
        this.titleRef = React.createRef()
        this.key = 0

        this.state = {
            showCanvas: true,
            graphWidth: 100,
            graphHeight: 100
        }

        this.adjustDimensions = this.adjustDimensions.bind(this)
        this.setDimensions = this.setDimensions.bind(this)

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount(){ //console.debug("DEBUG - in Results.componentDidMount()");
        $(window).on('resize', this.adjustDimensions)
        this.adjustDimensions()
    }

    // componentDidUpdate(prevProps, prevState){ console.debug("DEBUG - in Results.componentDidUpdate()");

    // }

    adjustDimensions() { //console.debug("DEBUG - in Results.adjustDimensions()");
        const $container = $(this.containerRef.current),
            $title = $( this.titleRef.current ),
            width = Math.floor( $title.width() -5 ),
            height = Math.floor( $container.height() - $title.height() - 10 )

        this.setDimensions( width, height )
    }

    setDimensions(width, height){ //console.debug("DEBUG - in Results.setDimensions()");
        const newState = {
                showCanvas: false,
                graphWidth: width,
                graphHeight: height
            },
            callback = (() => { //console.debug("DEBUG - in Results.setDimensions() > callback", arguments);
                setTimeout( () => {
                    this.setState({ showCanvas: true })
                }, 100)
            }).bind(this)

        this.setState(newState, callback)
    }

    render(){ //console.debug("DEBUG - in Results.render()");
        const probability = this.props.roll.oddsOfGetting(this.props.target)

        return(
        <div className='col-12 col-md-8 d-flex'
            id={ style.results }
        >
            <main className={ style.card+' flex-fill d-flex flex-column' }
                ref={ this.containerRef }
            >
                <h1 className='flex-shrink-0 m-0'
                    ref={ this.titleRef }
                >Probability: <b>{ probability }</b></h1>
                <div className='flex-fill'>
                    { this.state.showCanvas && 
                        <Chart key={ this.key++ }
                            roll={ this.props.roll }
                            target={ this.props.target }
                            width={ this.state.graphWidth }
                            height={ this.state.graphHeight }
                        />
                    }
                </div>
            </main>
        </div>
        );
    }
}