import Head from 'next/head'
import Link from 'next/link'
import Navbar from '@/portfolio/components/Navbar'
import LandingPage from '@/portfolio/components/LandingPage'
import FeaturedWorkLayout from '@/portfolio/components/FeaturedWorkLayout'

export default function Home() {
    return (<>
    <Head>
        <title>Justin Hansen</title>
        <meta name="description" content="Justin Hansen's portfolio" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <Navbar/>

    <LandingPage/>

    {/* feature project roll Probability */}
    <FeaturedWorkLayout>
        <section className="col-12 col-sm-6 col-md-5 col-lg-4">
            <h6>//My Work</h6>
            <h1>Roll Probability Calculator</h1>
            <p>stuff and things about the app</p>
            <Link href="/Lets-Roll">
                <a className="btn btn-primary btn-lg"
                    target="_blank">Roll Probability Calculator</a>
            </Link>
        </section>
        <section className="col col-sm-6 col-md-5 col-lg-4">
            <div>phone screen shot</div>
        </section>
    </FeaturedWorkLayout>

    {/* feature project starmap db */}
    <FeaturedWorkLayout>
        <section className="col col-sm-6">
            <div>browser screen shot</div>
        </section>
        <section className="col-12 col-sm-6 col-md-5 col-lg-4">
            <h6>//My Work</h6>
            <h1>StarMap DB</h1>
            <p>stuff and things about the app</p>
            <Link href="/StarMapDB">
                <a className="btn btn-primary btn-lg"
                    target="_blank">StarMap DB</a>
            </Link>
        </section>
    </FeaturedWorkLayout>
    </>)
}
