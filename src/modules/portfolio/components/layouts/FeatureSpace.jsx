import { Component } from "react";
import { addClassNames, cleanAttributesObject } from "@/common/utils/Utilities";

import style from '@/portfolio/styles/FeatureSpace.module.scss';

//TODO: add props doc
export default class FeatureSpace extends Component{
    constructor(props){
        super(props)

        this.containerAttr = cleanAttributesObject( this.props.containerAttr )

        //Container - add custom style classes
        if( !this.containerAttr.omitCustomClassName ){
            this.containerAttr.className = addClassNames( [
                style['feature-space'],
                this.props.theme ? style['feature-'+this.props.theme] : ''
            ], this.containerAttr.className)
        } 
        if( this.containerAttr.omitCustomClassName !== undefined) {
            delete this.containerAttr.omitCustomClassName
        }
        //Container - add helper style classes
        if( !this.containerAttr.omitDefaultClassName ){
            this.containerAttr.className = addClassNames('container-fluid', this.containerAttr.className, false)
        }
        if( this.containerAttr.omitDefaultClassName !== undefined ){
            delete this.containerAttr.omitDefaultClassName
        }
    }

    render(){
        return(<>
        <div {...this.containerAttr}>
                { this.props.children }
        </div>
        </>)
    }
}