import React from "react";

export default class Checkbox extends React.Component {
    constructor(props) { //console.debug("in Checkbox.constructor",arguments);
        super(props)
    }

    render() { //console.debug("in Checkbox.render()",arguments);
        return(
        <div className='form-check form-switch'>
            <input className='form-check-input rounded-pill'
                id={ this.props.id }
                type="checkbox"
                checked={ this.props.value }
                onChange={ this.props.onChange }
            />
            <label className='form-check-label'
                htmlFor={ this.props.id }
            >{ this.props.children }</label>
        </div>
        );
    }
}