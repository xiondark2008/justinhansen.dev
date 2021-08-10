import { Component } from "react";
import { addClassNames, cleanAttributesObject } from "@/common/utils/Utilities";

//TODO: document props
export default class NumberCallout extends Component {
    constructor(props) { //console.debug("in NumberCallout.constructor", arguements)
        super(props)
    }

    render(){ //console.debug("in NumberCallout.render", arguements)
        let value = !([null, undefined]).includes(this.props.value) ? this.props.value : '',
            label = !([null, undefined]).includes(this.props.label) ? this.props.label : '',
            wrapperAttr = cleanAttributesObject(this.props.wrapperAttr),
            valueAttr = cleanAttributesObject(this.props.valueAttr),
            labelAttr = cleanAttributesObject(this.props.labelAttr)

            wrapperAttr.className = addClassNames("text-center", wrapperAttr.className)
        
        return(<>
        <div {...wrapperAttr}>
            <h2 {...valueAttr}>{ value }</h2>
            <h5 {...labelAttr}>{ label }</h5>
        </div>
        </>);
    }
}