import { Component } from "react";
import BootstrapNavbar from "@/components/BootstrapNavbar";
import Link from 'next/link';

import style from '@/portfolio/styles/Navbar.module.scss';
import { addClassNames, isEmpty } from "@/common/utils/Utilities";

//TODO: document props
export default class Navbar extends Component {
    constructor(props){
        super(props)

        this.linkObjs = [{
            label: 'Work',
            href: '/Work',
            isActive(val) {
                return val == 'Work'
                    || this.children.some( child=>child.isActive(val) )
            },
            children:[{
                label: 'Roll Probability Calculator',
                href: '/Work/Lets-Roll',
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
            id="main_navbar"
            brandElement={  <Link href="/">
                                <a className={ style.brand }><b>JUSTIN<br/>HANSEN</b></a>
                            </Link> }
            navAttr={ {className: 'navbar-expand-md navbar-'+this.props.theme} }
            collapseAttr={ {className:''} }
        >
            <ul className="navbar-nav">
                { this.linkObjs.map( buildLinkItem ) }
            </ul>
        </BootstrapNavbar>
        </>)
    }
}