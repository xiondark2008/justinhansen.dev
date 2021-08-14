import { Component } from "react";
import { cleanAttributesObject, addClassNames, getUniqueId, mergeObjects} from "@/common/utils/Utilities";

//TODO: document props
export default class BootstrapNavbar extends Component {
    static INSTANCE_ID_LIST = []
    constructor(props) { //console.debug("in NavBar.constructor", arguements)
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
        this.id = this.collapseAttr.id
        BootstrapNavbar.INSTANCE_ID_LIST.push( this.id )
        delete this.collapseAttr.id

        this.navAttr.className = addClassNames('navbar', this.navAttr.className)
        this.containerAttr.className = addClassNames('container-fluid', this.containerAttr.className)
        this.buttonAttr = mergeObjects({
                type: "button",
                'data-bs-toggle': "collapse",
                'data-bs-target': "#"+this.id ,
                'aria-controls': this.id,
                'aria-expanded': "false",
                'aria-label': "Toggle navigation"
            }, this.buttonAttr)
        this.buttonAttr.className = addClassNames('navbar-toggler', this.buttonAttr.className)
        this.buttonIconAttr.className = addClassNames('navbar-toggler-icon', this.buttonIconAttr.className)
        this.collapseAttr = mergeObjects({ 'aria-expanded':"false" }, this.collapseAttr)
        this.collapseAttr.className = addClassNames('collapse navbar-collapse', this.collapseAttr.className)
    }

    render(){ //console.debug("in NavBar.render", arguements)
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