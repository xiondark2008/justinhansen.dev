import { Component } from "react";
import Head from "next/head";
import Image from 'next/image';
import LandingSpace from '@/portfolio/components/layouts/LandingSpace';
import Footer from '@/portfolio/components/Footer';

import comic from 'public/images/cant-find-comic.jpg';

export default class Custom404 extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(<>
        <Head>
            <title>404 - Not Found</title>
            <meta name="description" content="Could not find request page." />
            <link rel="icon" href="/JH.svg"/>
        </Head>
        <LandingSpace theme='dark'>
            <div className='container'>
                <div className='row justify-content-center align-items-center mt-md-5'>
                    <main className='col-12 col-md-6'>
                        <h1 className='display-1'>404 ...Oops</h1>
                        <h2>The page that you requested could not be found.</h2>
                        <p className='text-muted'>An entire extra dimensional bag (server) and
                        I <i>still</i> can't find the page I'm looking for.</p>
                    </main>
                    <aside className='col col-md-6'>
                        <Image className="img-fluid"
                            src={ comic }
                            alt="Can't find item in bag of holding" />
                    </aside>
                </div>
            </div>
        </LandingSpace>
        <Footer/>
        </>)
    }
}