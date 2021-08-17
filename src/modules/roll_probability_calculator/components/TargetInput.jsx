import React from "react";
import Checkbox from '@/roll_probability/components/elements/Checkbox.jsx';

import style from '@/roll_probability/styles/TargetInput.module.scss';

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
        const disableDecrease = this.props.target.value <= 0

        return(
        <div id={ style['target-input'] }
            className='col-12 col-md-4 d-flex flex-column flex-sm-row flex-md-column'
        >
            <div id={ style.target }
                className={ style.card }
            >
                <h2><label htmlFor={ TargetInput.IDs.input }>
                    Target
                </label></h2>
                <div className="d-flex">
                    <button className={ 'flex-fill btn btn-primary btn-lg'+( disableDecrease ? ' btn-disabled' : '') }
                        onClick={ this.decreaseNum }
                        disabled={ disableDecrease }
                    >-</button>
                    <input className={ 'flex-fill '+style.input }
                        id={ TargetInput.IDs.input }
                        type='text'
                        ref = { this.inputRef }
                        value={ this.props.target.value }
                        onChange={ this.onChange }
                    />
                    <button className='flex-fill btn btn-primary btn-lg'
                        onClick={ this.increaseNum }
                    >+</button>
                </div>
            </div>
            <div id={ style.comparison }
                className={ 'flex-fill '+style.card }
            >
                <h2>Comparison</h2>
                <Checkbox
                    id={ TargetInput.IDs.lt }
                    value={ this.props.target.lesser }
                    onChange={ this.onChange }>LESS THAN</Checkbox>
                <Checkbox
                    id={ TargetInput.IDs.eq }
                    value={ this.props.target.equal }
                    onChange={ this.onChange }>EQUAL TO</Checkbox>
                <Checkbox
                    id={ TargetInput.IDs.gt }
                    value={ this.props.target.greater }
                    onChange={ this.onChange }>GREATER THAN</Checkbox>
            </div>
        </div>
        );
    }
}