import Head from 'next/head';
import Link from 'next/link';
import LandingSpace from '@/portfolio/components/layouts/LandingSpace';
import FeaturedWorkLayout from '@/portfolio/components/layouts/FeatureSpace';
import HelloWorldCarousel from "@/portfolio/components/HelloWorldCarousel";
import InteractiveRPC from '@/portfolio/components/InteractiveRPC';
import InteractiveStarMapDB from '@/portfolio/components/InteractiveStarMapDB';

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
                        <a className="btn btn-primary btn-lg shadow-lg font-bk fs-6 my-5"
                        >ABOUT ME</a>
                    </Link>
                </section>
            </div>
        </div>
    </LandingSpace>

    {/* feature project roll Probability */}
    <FeaturedWorkLayout theme='dark'>
        <div className='row flex-fill justify-content-evenly align-items-center min-vh-100'>
            <section className="col-12 col-sm-6 col-md-5 col-lg-4 mb-3">
                <h6 className="code-comment">// My Work</h6>
                <h1 className="font-bk">Roll Probability Calculator</h1>
                <p>Used to calculate probability when rolling multiple multi-sided dice, this
                app focuses on responsive design and fast calculations. <Link href='/Work/Lets-Roll'>
                        <a>Learn more.</a>
                    </Link>
                </p>
                <Link href="/Lets-Roll">
                    <a className="btn btn-primary btn-lg"
                        target="_blank">LET'S ROLL</a>
                </Link>
            </section>
            <section className="col-12 col-sm-6 col-md-5 col-lg-4">
                <InteractiveRPC
                    margin='10'
                    args={ {useMin: true} }/>
            </section>
        </div>
    </FeaturedWorkLayout>

    {/* feature project starmap db */}
    <FeaturedWorkLayout theme='dark'>
        <div className='row flex-fill justify-content-evenly align-items-center min-vh-100'>
            <section className="col-12 col-sm-8 order-sm-2 col-lg-4">
                <h6 className="code-comment">// My Work</h6>
                <h1 className="font-bk">StarMap DB</h1>
                <p>Data parsed from <a
                    href='https://robertsspaceindustries.com/starmap'
                    target='_blank'
                >Roberts Space Industry's StarMap</a>, displayed in a manor that is 
                easier to query and compare records. <Link href='/Work/StarMapDB'>
                        <a>Learn more.</a>
                    </Link>
                </p>
                <Link href="/StarMapDB">
                    <a className="btn btn-primary btn-lg"
                        target="_blank">EXPLORE THE 'VERSE</a>
                </Link>
            </section>
            <section className="col-12 col-lg-8">
                <InteractiveStarMapDB
                    margin='10'
                    args={ {useMin: true, preserveTop: true} }/>
            </section>
        </div>
    </FeaturedWorkLayout>
    </>)
}
