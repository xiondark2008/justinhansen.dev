import { Component } from "react";
import { cleanAttributesObject, addClassNames, getUniqueId, mergeObjects} from "@/common/utils/Utilities";

//TODO: document props
export default class BootstrapNavbar extends Component {
    constructor(props) { //console.debug("in BootstrapNavbar.constructor", arguments)
        super(props)

        this.navAttr = cleanAttributesObject(this.props.navAttr)
        this.containerAttr = cleanAttributesObject(this.props.containerAttr)
        this.buttonAttr = cleanAttributesObject(this.props.buttonAttr)
        this.buttonIconAttr = cleanAttributesObject(this.props.buttonIconAttr)
        this.collapseAttr = cleanAttributesObject(this.props.collapseAttr)

        if( this.props.id ){
            this.collapseAttr.id = this.props.id
        } else if( !this.props.collapseAttr.id ){
            this.collapseAttr.id = getUniqueId(BootstrapNavbar.INSTANCE_ID_LIST, 'navbar')
        }

        this.navAttr.className = addClassNames('navbar', this.navAttr.className)
        this.containerAttr.className = addClassNames('container-fluid', this.containerAttr.className)
        this.buttonAttr = mergeObjects(this.buttonAttr, {
                type: "button",
                'data-bs-toggle': "collapse",
                'data-bs-target': "#"+this.collapseAttr.id ,
                'aria-controls': this.collapseAttr.id,
                'aria-expanded': "false",
                'aria-label': "Toggle navigation"
            })
        this.buttonAttr.className = addClassNames('navbar-toggler', this.buttonAttr.className)
        this.buttonIconAttr.className = addClassNames('navbar-toggler-icon', this.buttonIconAttr.className)
        this.collapseAttr = mergeObjects(this.collapseAttr, { 'aria-expanded':"false" })
        this.collapseAttr.className = addClassNames('collapse navbar-collapse', this.collapseAttr.className)
    }

    componentDidMount(){
        const idSelector = '#' + this.collapseAttr.id,
            Collapse = require('node_modules/bootstrap/js/dist/collapse')
        
        const $collapse = $(idSelector)
        this.collapse = Collapse.getOrCreateInstance( $collapse.get(0), {
            toggle: false
        } )
    }

    componentWillUnmount(){
        this.collapse.dispose()
    }

    render(){ //console.debug("in BootstapNavbar.render", arguments)
        return(
        <nav {...this.navAttr}>
            <div {...this.containerAttr}>
                { this.props.brandElement && this.props.brandElement }
                <button {...this.buttonAttr}>
                    <span {...this.buttonIconAttr}></span>
                </button>
                <div {...this.collapseAttr}>
                    { this.props.children }
                </div>
            </div>
        </nav>
        );
    }
}