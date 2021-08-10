import { Component } from "react";
import Link from 'next/link'
import HelloWorld from "@/portfolio/components/HelloWorld";

export default class LandingPage extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(<>
        <div className="landing-page container-fluid">
            <div className="row justify-content-center align-items-center min-vh-100">
                <section className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6 text-center">
                    <HelloWorld/>
                    <Link href="/About">
                        <a className="btn btn-primary btn-lg shadow-lg mt-5">About Me</a>
                    </Link>
                </section>
            </div>
        </div>
        </>)
    }
}