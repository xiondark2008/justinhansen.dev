import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/portfolio/components/Navbar';
import LandingPage from '@/portfolio/components/LandingPage';
import FeaturedWorkLayout from '@/portfolio/components/FeaturedWorkLayout';

import style from "@/portfolio/styles/LandingPage.module.scss";

export default function Home() {
    return (<>
    <Head>
        <title>Justin Hansen</title>
        <meta name="description" content="Justin Hansen's portfolio" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={ style['landing-page'] }>
        <Navbar useLightTheme={ true }/>
        <LandingPage/>
    </div>

    {/* feature project roll Probability */}
    <FeaturedWorkLayout>
        <section className="col-12 col-sm-6 col-md-5 col-lg-4 mb-3">
            <h6 className="code-comment">//My Work</h6>
            <h1>Roll Probability Calculator</h1>
            <p>stuff and things about the app</p>
            <Link href="/Lets-Roll">
                <a className="btn btn-primary btn-lg"
                    target="_blank">Roll Probability Calculator</a>
            </Link>
        </section>
        <section className="col-12 col-sm-6 col-md-5 col-lg-4">
            <figure className={ style.smartphone }>
                <img className="img-fluid"
                    src="/images/gray-grid.png"
                    alt="phone screen shot"
                />
            </figure>
        </section>
    </FeaturedWorkLayout>

    {/* feature project starmap db */}
    <FeaturedWorkLayout>
        <section className="col-12 col-lg-4 order-sm-2">
            <h6 className="code-comment">//My Work</h6>
            <h1>StarMap DB</h1>
            <p>stuff and things about the app</p>
            <Link href="/StarMapDB">
                <a className="btn btn-primary btn-lg"
                    target="_blank">StarMap DB</a>
            </Link>
        </section>
        <section className="col-12 col-lg-6">
            <figure className={ style.laptop }>
                <img className="img-fluid"
                    src="/images/gray-grid.png"
                    alt="browser screen shot"
                />
            </figure>
        </section>
    </FeaturedWorkLayout>
    </>)
}
