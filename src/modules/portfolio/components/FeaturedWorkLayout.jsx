import { Component } from "react";
import style from '@/portfolio/styles/FeaturedWorkLayout.module.css'

export default class FeaturedWorkLayout extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(<>
        <div className={ style['featured-work'] + ' container-fluid d-flex py-5' }> {/*"featured-work container-fluid bg-dark text-white min-vh-100">*/}
            <div className="row flex-fill justify-content-evenly">
                { this.props.children }
            </div>
        </div>
        </>)
    }
}