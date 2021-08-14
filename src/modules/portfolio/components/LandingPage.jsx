import { Component } from "react";
import Link from 'next/link'
import HelloWorldCarousel from "@/portfolio/components/HelloWorldCarousel";

export default class LandingPage extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(<>
        <div className="container-fluid">
            <div className="row justify-content-center align-items-center min-vh-100">
                <section className="col-12 col-sm-9 col-md-8 col-lg-7 col-xl-6 col-xxl-5 text-center">
                    <HelloWorldCarousel/>
                    <Link href="/About">
                        <a className="btn btn-primary btn-lg shadow-lg font-bk fs-6 my-5">ABOUT ME</a>
                    </Link>
                </section>
            </div>
        </div>
        </>)
    }
}