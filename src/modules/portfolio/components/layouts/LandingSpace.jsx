import { Component } from "react";
import Navbar from "@/portfolio/components/Navbar";
import { cleanAttributesObject, addClassNames, mergeObjects } from "@/common/utils/Utilities";

import style from "@/portfolio/styles/LandingSpace.module.scss";


export default class LandingSpace extends Component {
    constructor(props){
        super(props)

        const theme = this.props.theme ? this.props.theme : 'no-theme'
        this.containerAttr = cleanAttributesObject(this.props.containerAttr)
        this.navbarProps = cleanAttributesObject(this.props.navbarProps)
        
        this.containerAttr.className = addClassNames( [
            style['landing-space'],
            style['landing-'+theme]
        ], this.containerAttr.className)
        this.navbarProps = mergeObjects( this.navbarProps, {theme: theme} )
    }

    render(){
        return(
        <div {...this.containerAttr}>
            <Navbar {...this.navbarProps}/>
            { this.props.children }
        </div>
        )
    }
}