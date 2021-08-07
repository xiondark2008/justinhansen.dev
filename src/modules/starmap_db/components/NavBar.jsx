import { Component } from "react";
import { UI_ENTITY_STUBS } from "@/starmap_db/utils/Utilities";
import { toHTMLName } from '@/utils/Utilities.js'

export default class NavBar extends Component {
    constructor(props) { //console.debug("in NavBar.constructor", arguements)
        super(props)
    }

    render(){ //console.debug("in NavBar.render", arguements)
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
                    >{ entityStub.label }</a>
                </li>)
            })

        return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-1">
            <div className="container-fluid">
                <a className="navbar-brand"
                    href="#"
                >StarMapDB</a>
                <button className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={ "#"+containerId }
                    aria-controls={ containerId }
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div id={ containerId }
                    className="collapse navbar-collapse"
                    aria-expanded="false"
                >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        { tabList }
                    </ul>
                </div>
            </div>
        </nav>
        );
    }
}