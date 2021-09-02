import { Component } from "react";
import Link from 'next/link';
import BootstrapNavbar from "@/components/BootstrapNavbar";
import { addClassNames, isEmpty } from "@/common/utils/Utilities";

import style from '@/portfolio/styles/Navbar.module.scss';

//TODO: document props
export default class Navbar extends Component {
    constructor(props){
        super(props)

        this.id = 'main_navbar'
        this.linkObjs = [{
            label: 'Work',
            href: '/Work',
            isActive(val) {
                return val == 'Work'
                    || this.children.some( child=>child.isActive(val) )
            },
            children:[{
                label: 'Roll Probability Calculator',
                href: '/Work/RPC',
                isActive: (val) => val=='RPC'
            },{
                label: 'StarMapDB',
                href: '/Work/StarMapDB',
                isActive: (val) => val == 'StarMapDB'
            }]
        },{
            label: 'About',
            href: '/About',
            isActive: (val) => val == 'About'
        },{
            label: 'Contact',
            href: '/Contact',
            isActive: (val) => val == 'Contact'
        }]
    }

    componentDidMount(){
        const idSelector = '#' + this.id,
            Dropdown = require('node_modules/bootstrap/js/dist/dropdown')
        
        this.dropdowns = $('.dropdown-toggle', idSelector).get()
                .map( el => Dropdown.getOrCreateInstance( el ) )
    }

    componentWillUnmount(){
        for(let dropdown of this.dropdowns){
            dropdown.dispose()
        }
    }

    render(){
        const liBaseClassName = 'nav-item',
            aBaseClassName = "nav-link ",
            buildDropdownItem = (link, idx) => {
                const liClassName = liBaseClassName,
                    aClassName = addClassNames([
                        'dropdown-item',
                        (link.isActive(this.props.currentPage) ? ' active' : '')
                    ], aBaseClassName, false)

                return(
                <li key={ idx } className={ liClassName }>
                    <Link href={ link.href }>
                        <a className={ aClassName }><b>{ link.label }</b></a>
                    </Link>
                </li>)
            },
            buildLinkItem = (link, idx) => {
                const liClassName = liBaseClassName,
                    aClassName = addClassNames([
                        (link.isActive(this.props.currentPage) ? 'active' : '')
                    ], aBaseClassName, false)
                
                if( !link.children || isEmpty(link.children) ){
                    
                    return(
                    <li key={ idx } className={ liClassName }>
                        <Link href={ link.href }>
                            <a className={ aClassName }><b>{ link.label }</b></a>
                        </Link>
                    </li>)
                    
                } else {
                    const id = link.label+'NavbarDropdownMenuLink'
                    
                    return(
                    <li key={ idx } className={ liClassName + ' dropdown'}>
                        <a className={ addClassNames(aClassName, 'dropdown-toggle') }
                            id={ id }
                            role="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                        ><b>{ link.label }</b></a>
                        <ul className="dropdown-menu"
                            aria-labelledby={ id }
                        >
                            { link.children.map( buildDropdownItem ) }
                        </ul>
                    </li>)
                }
            } 
        
        return(<>
        <BootstrapNavbar
            id={ this.id }
            brandElement={  <Link href="/">
                                <a className={ style.brand }><b>JUSTIN<br/>HANSEN</b></a>
                            </Link> }
            navAttr={ {className: 'navbar-expand-md bg-transparent navbar-'+this.props.theme} }
        >
            <ul className="navbar-nav">
                { this.linkObjs.map( buildLinkItem ) }
            </ul>
        </BootstrapNavbar>
        </>)
    }
}