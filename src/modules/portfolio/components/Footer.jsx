import { Component } from "react";

export default class Footer extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
        <footer className='d-flex align-items-center'>
            <a className='text-primary font-bk lh-1 text-decoration-none p-3'
            href='/'
            ><b>JUSTIN<br/>HANSEN</b></a>
            <a className='ms-auto text-muted p-3'
            href='/Contact'
            >Contact</a>
        </footer>
        )
    }
}