import React from "react";

export default class Checkbox extends React.Component {
    constructor(props) { //console.debug("in Checkbox.constructor",arguments);
        super(props)
    }

    render() { //console.debug("in Checkbox.render()",arguments);
        return(
        <label htmlFor={ this.props.id }>
            <input
                type="checkbox"
                id={ this.props.id }
                checked={ this.props.value }
                onChange={ this.props.onChange }
            />{ this.props.children }
        </label>
        );
    }
}