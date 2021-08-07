import React from "react";

export default class DieTypeInput extends React.Component {
    constructor(props) { //console.debug("in DieTypeInput.constructor",arguments);
        super(props)

        this.inputRef = React.createRef()

        this.onChange = this.onChange.bind(this)
        this.increaseNum = this.increaseNum.bind(this)
        this.decreaseNum = this.decreaseNum.bind(this)
    }

    onChange(event) { //console.debug("in DieTypeInput.onChange()",arguments);
        const val = parseInt(event.target.value)
        
        this.props.update(this.props.index, val)
    }

    increaseNum() { //console.debug("in DieTypeInput.increaseNum()",arguments);
        const input = this.inputRef.current

        this.props.update(this.props.index, parseInt(input.value) + 1)
    }

    decreaseNum() { //console.debug("in DieTypeInput.decreaseNum()",arguments);
        const input = this.inputRef.current
        
        this.props.update(this.props.index, parseInt(input.value) - 1)
    }

    render() { //console.debug("in DieTypeInput.render()",arguments);
        const inputId = "DieType"+this.props.dieType.die.toString()

        return(
        <div>
            <button onClick={this.increaseNum}>+</button>
            <input
                ref={this.inputRef}
                id={inputId}
                value={this.props.dieType.quantity}
                onChange={this.onChange}
                />
            <label htmlFor={inputId}>{this.props.dieType.die.toString()}</label>
            <button onClick={this.decreaseNum}
                disabled={ this.props.dieType.quantity <= 0 }>-</button>
        </div>
        );
    }
}