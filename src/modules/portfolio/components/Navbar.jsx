import { Component } from "react";
import BootstrapNavbar from "@/common/components/BootstrapNavbar";
import Link from 'next/link'

import style from '@/portfolio/styles/Navbar.module.css'

//TODO: document props
export default class Navbar extends Component {
    constructor(props){
        super(props)

        this.linkObjs = [{
            label: 'Work',
            href: '/Work',
            isActive: (val) => {
                return val == 'Work'
            }
        },{
            label: 'About',
            href: '/About',
            isActive: (val) => {
                return val == 'About'
            }
        },{
            label: 'Contact',
            href: '/Contact',
            isActive: (val) => {
                return val == 'Contact'
            }
        }]
    }

    render(){
        const items = this.linkObjs.map( (link, idx) => {
            const aClassName = "nav-link " + (link.isActive(this.props.currentPage) ? ' active' : '')
            return(
            <li key={ idx } className="nav-item">
                <Link href={ link.href }>
                    <a className={ aClassName }><b>{ link.label }</b></a>
                </Link>
            </li>)
        })
        return(<>
        <BootstrapNavbar
            id="main_navbar"
            brandElement={  <Link href="/">
                                <a className={ style.brand }><b>JUSTIN<br/>HANSEN</b></a>
                            </Link> }
            navAttr={ {className: "navbar-expand-lg"+(this.props.useLightTheme ? ' navbar-light' : ' navbar-dark')} }
        >
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                { items }
            </ul>
        </BootstrapNavbar>
        </>)
    }
}