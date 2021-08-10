import { Component } from "react";

export default class FeaturedWorkLayout extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(<>
        <div className="featured-work container-fluid bg-dark text-white min-vh-100">
            <div className="row justify-content-evenly">
                { this.props.children }
            </div>
        </div>
        </>)
    }
}