import Head from 'next/head';
import Link from 'next/link';
import LandingSpace from '@/portfolio/components/layouts/LandingSpace';
import InteractiveRPC from '@/portfolio/components/InteractiveRPC';
import FeatureSpace from '@/portfolio/components/layouts/FeatureSpace';

import style from '@/portfolio/styles/Work.module.scss';

export default function Work() {
    const breakpoint = 'md',
        gotoLink = (<Link href='/Lets-Roll'>
                        <a className='btn btn-primary btn-lg shadow-lg font-bk fs-6 my-md-4'
                            target='_blank'
                        >GO TO APP</a>
                    </Link>)

    return (<>
    <Head>
        <title>Justin Hansen</title>
        <meta name="description" content="Justin Hansen's portfolio" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <LandingSpace theme='light'
        navbarProps={ {currentPage: 'StarMapDB'} }
    >
        <div className="container-fluid min-h-inherit">
            <div className="row justify-content-center align-items-center min-h-inherit">
                <section className={ 'col-12 col-md-6 my-5 px-5' }>
                    <h1 className='font-bk'>StarMapDB</h1>
                    <p>High level stuff and things about the app.</p>
                    { gotoLink }
                </section>
                <div className={ 'col-12 col-md-6 max-vh-85' }>
                    
                </div>
            </div>
        </div>
    </LandingSpace>
    <FeatureSpace theme='dark'>
        <div className='row justify-content-evenly align-items-center py-5'>
            <section className="col-12 col-sm-6">
                <h6 className="code-comment">// The Problem</h6>
                <h2 className="font-bk">XXX</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </section>
            <section className="col-12 col-sm-6 align-self-stretch">
                <img className="img-fluid"
                    src="/images/gray-grid.png"
                    alt="phone screen shot"
                />
            </section>
        </div>
        <div className='row justify-content-evenly py-5'>
            <section className="col-12 col-sm-6 d-flex flex-column justify-content-center text-center">
                <h6 className="code-comment">// The Needs</h6>
                <h2 className="font-bk">XXX</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </section>
        </div>
        <div className='row justify-content-evenly align-items-stretch py-5'>
            <section className="col-12 col-sm-4">
                <img className=""
                    src="/images/gray-grid.png"
                    alt="phone screen shot"
                />
                <h3 className="font-bk">Mobile First</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </section>
            <section className="col-12 col-sm-4">
                <img className=""
                    src="/images/gray-grid.png"
                    alt="phone screen shot"
                />
                <h3 className="font-bk">XXX</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </section>
            <section className="col-12 col-sm-4">
                <img className=""
                    src="/images/gray-grid.png"
                    alt="phone screen shot"
                />
                <h3 className="font-bk">XXX</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </section>
        </div>
        <div className='row justify-content-evenly align-items-center py-5'>
            <section className="col-12 col-sm-6">
                <h6 className="code-comment">// The Solution</h6>
                <h2 className="font-bk">XXX</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <h6 className='code-comment'>// Highlights</h6>
                <ol>
                    <li></li>
                    <li></li>
                    <li></li>
                </ol>
            </section>
            <section className="col-12 col-sm-6 d-flex flex-column justify-content-center">
                <img className="img-fluid"
                    src="/images/gray-grid.png"
                    alt="phone screen shot"
                />
            </section>
        </div>
        <div className='row justify-content-evenly py-5'>
            <section className="col-12 col-sm-6 text-center">
                <h6 className="code-comment">// Hurdles</h6>
                <h2 className="font-bk">XXX</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </section>
        </div>
    </FeatureSpace>
    <FeatureSpace theme='light'>
        <div className='row justify-content-evenly py-5'>
            <section className="col-12 col-sm-6 text-center">
                <h6 className="code-comment">// Let's Roll</h6>
                <h2 className="font-bk">Test it out</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                { gotoLink }
            </section>
        </div>
    </FeatureSpace>
    </>)
}
