import React from "react";

import style from '@/roll_probability/styles/DieTypeInput.module.scss';

//TODO: document props
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
        const inputId = "DieType"+this.props.dieType.die.toString(),
            disableDecrease = this.props.dieType.quantity <= 0;

        return(
        <div className={ (['',style['die-type-input'],style.card]).join(' ') }>
            <label className=""
                htmlFor={inputId}
            >{this.props.dieType.die.toString()}</label>
            <input className={ style.input }
                id={inputId}
                value={this.props.dieType.quantity}
                type='text'
                ref={this.inputRef}
                onChange={this.onChange}
                />
            <div className="d-flex justify-content-evenly">
                <button className={ "flex-grow-1 btn btn-primary"+( disableDecrease ? ' btn-disabled' : '') }
                    onClick={this.decreaseNum}
                    disabled={ disableDecrease }
                >-</button>
                <button className="flex-grow-1 btn btn-primary"
                    onClick={this.increaseNum}
                >+</button>
            </div>
        </div>
        );
    }
}