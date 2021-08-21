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
        const breakpoint = 'md',
            buildLinkItem = (link, idx) => {
                const liClassName = 'nav-item px-3 px-'+breakpoint+'-0',
                    aClassName = "nav-link " + (link.isActive(this.props.currentPage) ? ' active' : '')
                
                if( !link.children || isEmpty(link.children) ){
                    return(
                    <li key={ idx } className={ liClassName }>
                        <Link href={ link.href }>
                            <a className={ aClassName }><b>{ link.label }</b></a>
                        </Link>
                    </li>)
                } else {
                    const id = link.label+'NavbarDropdownMenuLink',
                        buildDropdownItem = (link, idx) => {
                            const aClassName = 'nav-link dropdown-item ' + (link.isActive(this.props.currentPage) ? ' active' : '')

                            return(
                            <li className='nav-item'>
                                <Link href={ link.href }>
                                    <a className={ aClassName }><b>{ link.label }</b></a>
                                </Link>
                            </li>)
                        }

                    return(
                    <li key={ idx } className={ liClassName + ' dropdown'}>
                        <a className={ addClassNames(aClassName, 'dropdown-toggle') }
                            id={ id }
                            role="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                        ><b>{ link.label }</b></a>
                        <ul className="dropdown-menu bg-transparent text-end"
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
            navAttr={ {className: 'navbar-expand-'+breakpoint+' navbar-'+this.props.theme} }
            collapseAttr={ {className:'text-end'} }
        >
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                { this.linkObjs.map( buildLinkItem ) }
            </ul>
        </BootstrapNavbar>
        </>)
    }
}