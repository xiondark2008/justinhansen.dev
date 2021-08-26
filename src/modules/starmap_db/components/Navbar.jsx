import { Component } from "react";
import Link from "next/dist/client/link";
import BootstrapNavbar from "@/common/components/BootstrapNavbar";
import { UI_ENTITY_STUBS } from "@/starmap_db/utils/Utilities";
import { toHTMLName, addClassNames } from '@/utils/Utilities.js'

import style from '@/portfolio/styles/Navbar.module.scss';

export default class Navbar extends Component {
    constructor(props) { //console.debug("in NavBar.constructor", arguements)
        super(props)
    }

    render(){ //console.debug("in NavBar.render", arguements)
        //TODO: implement common BootstrapNavbar
        const containerId = "main_navbar",
            currentEntityStub = this.props.currentEntityStub,
            setEntityStub = this.props.setEntityStub,
            tabList = Object.entries(UI_ENTITY_STUBS).map( entry => {
                const entryName = entry[0],
                    entityStub = entry[1],
                    htmlName = toHTMLName(entityStub.label),
                    isActive = ( entityStub.label === currentEntityStub.label )

                return(
                <li className="nav-item"
                    key={ entryName }
                    onClick={ event => {
                        event.preventDefault()
                        setEntityStub( entityStub ) 
                    } }
                >
                    <a className={ "nav-link" + (isActive ? " active": "") }
                        id={ "entity_tab_"+htmlName } 
                        href={ "#"+htmlName }
                    ><b>{ entityStub.label }</b></a>
                </li>)
            })

        return(<>
        <BootstrapNavbar
            id="main_navbar"
            brandElement={  
                            <span className={ addClassNames(style.brand, 'text-primary') }>StarMapDB</span> 
                        }
            navAttr={ {className: 'navbar-expand-md navbar-'+this.props.theme} }
            collapseAttr={ {className:''} }
        >
            <ul className="navbar-nav">
                { tabList }
            </ul>
        </BootstrapNavbar>
        </>);
    }
}