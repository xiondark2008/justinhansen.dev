import { Component } from "react";
import { addClassNames,
        cleanAttributesObject, 
        cleanAttributesObjectArray } from "@/common/utils/Utilities";

//TODO: document props
export default class BootstrapProgressBar extends Component {
    constructor(props) { //console.debug("in StarMapDB.constructor", arguements)
        super(props)
    }

    render(){ //console.debug("in StarMapDB.render", arguements)
        const wrapperAttr = cleanAttributesObject( this.props.wrapperAttr ),
            barsAttr = cleanAttributesObjectArray( this.props.barsAttr ),
            bars = barsAttr.map( (barAttr, idx) => { //console.debug("DEBUG - in BootstrapProgressBar.render barsAttr.map. barAttr&idx",barAttr,idx)
                const text = barAttr.text
                delete barAttr.text

                barAttr.className = addClassNames('progress-bar', barAttr.className)
                if( !(barAttr.style instanceof Object) ){
                    barAttr.style = {}
                }
                if( !barAttr.style.hasOwnProperty('width') ){
                    barAttr.style.width = 0+'%'
                }

                return <div key={ idx } {...barAttr}>{ text }</div>
            })

        wrapperAttr.className = addClassNames('progress mt-1', wrapperAttr.className)
        
        return(<>
        <div {...wrapperAttr}>
            { bars }
        </div>
        </>);
    }
}