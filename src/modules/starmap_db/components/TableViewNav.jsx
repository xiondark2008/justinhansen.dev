import { Component } from "react";

export default class TableViewNav extends Component {
    constructor(props) { //console.debug("in TableViewNav.constructor", arguements)
        super(props)
    }

    render(){ //console.debug("in TableViewNav.render", arguements)
        const viewList = this.props.views.map( (view, idx) => {
            const isActive = view == this.props.currentView

            return(
            <li className="nav-item"
                key={idx}
                role="presentation"
                onClick={ event => {
                    event.preventDefault()
                    this.props.setView(view)
                } }
            >
                <a className={ "nav-link" + (isActive ? " active" : "") }
                    href={"#"}
                >{ view.name }</a>
            </li>
            );
        })

        return(<>
        <h4>Views</h4>
        <ul className="nav nav-pills flex-column nav-sm">
            { viewList }
        </ul>
        </>);
    }
}