import React,
        { Component } from "react";
import { addClassNames, 
        cleanAttributesObject,
        cleanAttributesObjectArray } from "@/common/utils/Utilities";

//TODO: document the props
export default class BootstrapNavTabs extends Component {
    constructor(props) { //console.debug("in StarSystemDetails.constructor", arguements)
        super(props)

        this.tabLabels = this.props.tabLabels instanceof Array ? this.props.tabLabels : [this.props.tabLabels],
        
        this.state = {
            selectedTabIndex: 0
        }

        this.setSelectedTabIndex = this.setSelectedTabIndex.bind(this)
    }

    componentDidUpdate(prevProps, prevState){
        const onChange = this.props.onChange,
            index = this.state.selectedTabIndex,
            label = this.tabLabels[index]

        if( onChange ){
            onChange( index, label )
        }
    }

    setSelectedTabIndex(index){
        this.setState( prevState => {
            return {
                selectedTabIndex: index
            }
        })
    }

    render(){ //console.debug("in StarSystemDetails.render", arguements)
        const tabLabels = this.tabLabels,
            ulAttr = cleanAttributesObject( this.props.ulAttr ),
            tabsAttr = cleanAttributesObjectArray( this.props.tabsAttr ),
            navLinksAttr = cleanAttributesObjectArray( this.props.navLinksAttr ),
            panelWrapperAttr = cleanAttributesObject( this.props.panelWrapperAttr ),
            panelsAttr = cleanAttributesObjectArray( this.props.panelsAttr ),
            //Tab Elements
            tabs = tabLabels.map( (label, idx) => { //console.debug("DEBUG - in BootstrapNavTabs.render tabLabels.map. label:", label, ",idx:", idx)
                const tabAttr = Object.assign({}, tabsAttr[ idx % tabsAttr.length ]),
                    navLinkAttr = Object.assign({}, navLinksAttr[ idx % navLinksAttr.length ])

                tabAttr.className = addClassNames('nav-item', tabAttr.className)
                tabAttr.onClick = event => { 
                    event.preventDefault()
                    this.setSelectedTabIndex(idx)
                }
                
                navLinkAttr.className = addClassNames('nav-link', navLinkAttr.className)
                if( idx === this.state.selectedTabIndex ){
                    navLinkAttr.className = addClassNames('active', navLinkAttr.className)
                }
                
                return <li key={ idx } {...tabAttr}>
                    <a {...navLinkAttr}>{ label }</a>
                </li>
            }),
            //Tab Panel Elements
            tabPanels = React.Children.map(this.props.children, (child, idx)=>{ //console.debug("DEBUG - in BootstrapNavTabs.render props.children.map. child:", child, ",idx:", idx)
                const panelAttr = Object.assign({}, panelsAttr[ idx % panelsAttr.length ])
                
                panelAttr.className = addClassNames('tab-pane', panelAttr.className)
                if( idx === this.state.selectedTabIndex ){
                    panelAttr.className = addClassNames('active', panelAttr.className)
                }

                return <div {...panelAttr}>
                    { React.cloneElement(child, panelAttr) }
                </div>
            })

        ulAttr.className = addClassNames('nav', ulAttr.className)
        panelWrapperAttr.className = addClassNames('tab-content', panelWrapperAttr.className)

        return(<>
        <ul {...ulAttr}>
            { tabs }
        </ul>
        <div {...panelWrapperAttr}>
            { tabPanels }
        </div>
        </>);
    }
}