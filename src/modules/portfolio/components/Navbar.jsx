import { Component } from "react";
import BootstrapNavbar from "@/common/components/BootstrapNavbar";
import Link from 'next/link'

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
            return(
            <li key={ idx } className="nav-item">
                <Link href={ link.href }>
                    <a className={ "nav-link" + (link.isActive(this.props.currentPage) ? ' active' : '') }>{ link.label }</a>
                </Link>
            </li>)
        })
        return(<>
        <BootstrapNavbar
            id="main_navbar"
            hasBrandElement={ true }
            navAttr={ {className: "navbar-expand-lg navbar-light"} }
        >
            <Link href="/">
                <a>Justin Hansen</a>
            </Link>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                { items }
            </ul>
        </BootstrapNavbar>
        </>)
    }
}