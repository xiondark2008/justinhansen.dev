import { Component } from "react";
import { cleanAttributesObject,
         addClassNames } from "@/common/utils/Utilities";

export default class DetailsHeader extends Component {
    constructor(props) { //console.debug("in DetailsHeader.constructor", arguements)
        super(props)
    }

    render(){ //console.debug("in DetailsHeader.render", this.props)
        const title = this.props.title,
            subtitle = this.props.subtitle,
            sectionAttr = cleanAttributesObject(this.props.sectionAttr),
            wrapperAttr = cleanAttributesObject(this.props.wrapperAttr),
            h1Attr = cleanAttributesObject(this.props.h1Attr),
            smallAttr = cleanAttributesObject(this.props.smallAttr)
        
        sectionAttr.className = addClassNames('detials-header col-12', sectionAttr.className)
        wrapperAttr.className = addClassNames('bg-white bg-opacity-75 ps-2', wrapperAttr.className)
        smallAttr.className = addClassNames('text-muted', smallAttr.className)
        
        return(<>
        <section {...sectionAttr}>
            <div {...wrapperAttr}>
                <h1 {...h1Attr}>{ title } { subtitle && <small {...smallAttr}>{ subtitle }</small> }</h1>
            </div>
        </section>
        </>);
    }
}