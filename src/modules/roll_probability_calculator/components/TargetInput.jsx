import React from "react";
import Checkbox from '@/roll_probability/components/elements/Checkbox.jsx'

export default class TargetInput extends React.Component {
    static IDs = {
        input: "target",
        eq: "equal-to",
        lt: "less-than",
        gt: "greater-than"
    }

    constructor(props) { //console.debug("in TargetInput.constructor",arguments);
        super(props)

        this.inputRef = React.createRef()

        this.onChange = this.onChange.bind(this)
        this.increaseNum = this.increaseNum.bind(this)
        this.decreaseNum = this.decreaseNum.bind(this)
    }

    onChange(event) { //console.debug("in TargetInput.onChange()", arguments)
        const el = event.target

        if( el.id == TargetInput.IDs.input ){
            this.props.update(parseInt(el.value), undefined, undefined, undefined)
        } else if( el.id == TargetInput.IDs.eq ){
            this.props.update(undefined, el.checked, undefined, undefined)
        } else if( el.id == TargetInput.IDs.lt ){
            this.props.update(undefined, undefined, el.checked, undefined)
        } else if( el.id == TargetInput.IDs.gt ){
            this.props.update(undefined, undefined, undefined, el.checked)
        } else {
            console.warn("Found unhandled id: ", el.id)
        }
    }

    increaseNum() { //console.debug("in TargetInput.increaseNum()", arguments)
        const input = this.inputRef.current

        this.props.update(parseInt(input.value) + 1)
    }

    decreaseNum() { //console.debug("in TargetInput.decreaseNum()", arguments)
        const input = this.inputRef.current

        this.props.update(parseInt(input.value) - 1)
    }

    render() { //console.debug("in TargetInput.render()", arguments);
        return(
        <div>
            <h4>Chance of rolling</h4>
            <div>
                <button onClick={ this.decreaseNum }
                    disabled={ this.props.target.value <= 0 }>-</button>
                <input
                    ref = { this.inputRef }
                    id={ TargetInput.IDs.input }
                    value={ this.props.target.value }
                    onChange={ this.onChange }
                />
                <label htmlFor={ TargetInput.IDs.input }>Target</label>
                <button onClick={ this.increaseNum }>+</button>
            </div>
            <div>
                <Checkbox
                    id={ TargetInput.IDs.lt }
                    value={ this.props.target.lesser }
                    onChange={ this.onChange }>&lt;</Checkbox>
                <Checkbox
                    id={ TargetInput.IDs.eq }
                    value={ this.props.target.equal }
                    onChange={ this.onChange }>=</Checkbox>
                <Checkbox
                    id={ TargetInput.IDs.gt }
                    value={ this.props.target.greater }
                    onChange={ this.onChange }>&gt;</Checkbox>
            </div>
        </div>
        );
    }
}