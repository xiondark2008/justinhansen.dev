import Head from 'next/head';
import Link from 'next/link';
import LandingSpace from '@/portfolio/components/layouts/LandingSpace';
import HelloWorldCarousel from "@/portfolio/components/HelloWorldCarousel";
import FeaturedWorkLayout from '@/portfolio/components/layouts/FeatureSpace';

import style from "@/portfolio/styles/LandingSpace.module.scss";

export default function Home() {
    return (<>
        <Head>
            <title>Justin Hansen</title>
            <meta name="description" content="Justin Hansen's portfolio" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <LandingSpace theme='light'>
            <div className="container-fluid min-h-inherit">
                <div className="row flex-fill justify-content-center align-items-center min-h-inherit">
                    <section className="col-12 col-sm-9 col-md-8 col-lg-7 col-xl-6 col-xxl-5 text-center">
                        <HelloWorldCarousel />
                        <Link href="/About">
                            <a className="btn btn-primary btn-lg shadow-lg font-bk fs-6 my-5">ABOUT ME</a>
                        </Link>
                    </section>
                </div>
            </div>
        </LandingSpace>

        {/* feature project roll Probability */}
        <FeaturedWorkLayout theme='dark'>
            <div className='row flex-fill justify-content-evenly min-vh-100'>
                <section className="col-12 col-sm-6 col-md-5 col-lg-4 mb-3 d-flex flex-column justify-content-center">
                    <h6 className="code-comment">// My Work</h6>
                    <h1 className="font-bk">Roll Probability Calculator</h1>
                    <p>Used to calculate probability when rolling multiple dice, this app focuses on responsive design and fast calculations.</p>
                    <Link href="/Lets-Roll">
                        <a className="btn btn-primary btn-lg"
                            target="_blank">LET'S ROLL</a>
                    </Link>
                </section>
                <section className="col-12 col-sm-6 col-md-5 col-lg-4 d-flex flex-column justify-content-center">
                    <figure className={style.smartphone}>
                        <img className="img-fluid"
                            src="/images/gray-grid.png"
                            alt="phone screen shot"
                        />
                    </figure>
                </section>
            </div>
        </FeaturedWorkLayout>

        {/* feature project starmap db */}
        <FeaturedWorkLayout theme='dark'>
            <div className='row flex-fill justify-content-evenly min-vh-100'>
                <section className="col-12 d-flex flex-column justify-content-center col-sm-8 order-sm-2 col-lg-4">
                    <h6 className="code-comment">// My Work</h6>
                    <h1 className="font-bk">StarMap DB</h1>
                    <p>stuff and things about the app</p>
                    <Link href="/StarMapDB">
                        <a className="btn btn-primary btn-lg"
                            target="_blank">EXPLORE THE 'VERSE</a>
                    </Link>
                </section>
                <section className="col-12 d-flex flex-column justify-content-center col-lg-6">
                    <figure className={style.laptop}>
                        <img className="img-fluid"
                            src="/images/gray-grid.png"
                            alt="browser screen shot"
                        />
                    </figure>
                </section>
            </div>
        </FeaturedWorkLayout>
    </>)
}
