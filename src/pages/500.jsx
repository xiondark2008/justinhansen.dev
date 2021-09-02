import { Component } from "react";
import Head from "next/head";
import Image from 'next/image';
import LandingSpace from '@/portfolio/components/layouts/LandingSpace';
import Footer from '@/portfolio/components/Footer';

import fail from 'public/images/ShipExplosion.gif';

export default class Custom404 extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(<>
        <Head>
            <title>Error - 500</title>
            <meta name="description" content="Server error." />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <LandingSpace theme='dark'>
            <div className='container'>
                <div className='row justify-content-center align-items-center mt-md-5'>
                    <main className='col-12 col-md-6'>
                        <h1 className='display-1'>Uh Oh!</h1>
                        <h2>An error occured on the server.</h2>
                        <p className='text-muted'>Well, that wasn't supposed to happen...</p>
                    </main>
                    <aside className='col col-md-6'>
                        <Image className="img-fluid"
                            src={ fail }
                            alt="Ship Exploding" />
                    </aside>
                </div>
            </div>
        </LandingSpace>
        <Footer/>
        </>)
    }
}