import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import LandingSpace from '@/portfolio/components/layouts/LandingSpace';
import FeatureSpace from '@/portfolio/components/layouts/FeatureSpace';
import Footer from '@/portfolio/components/Footer';
import InteractiveStarMapDB from '@/portfolio/components/InteractiveStarMapDB';
import { addClassNames } from '@/common/utils/Utilities';

import style from '@/portfolio/styles/Work.module.scss';
import img_starmap from 'public/images/StarCitizenStarmap2.jpg';
import icon_parse from 'public/images/icons/parse.svg';
import icon_store from 'public/images/icons/store.svg';
import icon_display from 'public/images/icons/display.svg';
import img_in_use from 'public/images/Star-Map.jpg';

export default function Work() {
    const gotoLink = (
            <Link href='/StarMapDB'>
                <a className='btn btn-primary btn-lg shadow-lg font-bk fs-6 my-md-4'
                    target='_blank'
                >GO TO APP</a>
            </Link>)

    return (<>
    <Head>
        <title>Justin Hansen's Portfolio - StarMapDB</title>
        <meta name="description" content="Justin Hansen's portfolio project: StarMapDB" />
        <link rel="icon" href="/JH.svg"/>
    </Head>
    <LandingSpace theme='light'
        navbarProps={ {currentPage: 'StarMapDB'} }
    >
        <div className="container-fluid min-h-inherit">
            <div className="row justify-content-center align-items-center min-h-inherit">
                <section className={ 'col-12 col-md-6 my-5 px-5' }>
                    <h1 className='font-bk'>StarMapDB</h1>
                    <p>For their video game Star Citizen, the company Cloud Imperium published
                    a web app they call <a
                        href='https://robertsspaceindustries.com/starmap'
                        target='_blank'
                    >StarMap</a>. It is an amazing bit of coding that allows the user to view
                    a map of all the different star systems and planets in the game.</p>
                    <p>This web app uses the backend data from the StarMap but displays it in
                    a data table format so that the user can easily sort and compare all the
                    records.</p>
                    <h3 className='text-primary'><b>TECH STACK</b></h3>
                    <ul className='row row-cols-2 list-unstyled'>
                        <li className='col'><b>Node.js</b></li>
                        <li className='col'><b>MongoDB</b></li>
                        <li className='col'><b>React.js</b></li>
                        <li className='col'><b>Bootstrap</b></li>
                        <li className='col'><b>DataTables</b></li>
                    </ul>
                    { gotoLink }
                </section>
                <div className={ 'col-12 col-md-6 max-vh-85' }>
                    <InteractiveStarMapDB
                        margin='10'
                        args={ {useMin: true} }/>
                </div>
            </div>
        </div>
    </LandingSpace>
    <FeatureSpace theme='dark'>
        <div className='row justify-content-evenly align-items-center my-5'>
            <section className="col-12 col-sm-6">
                <h6 className="code-comment">// The Problem</h6>
                <h2 className="font-bk">View the Data</h2>
                <p>While using Cloud Imperium's StarMap, I found myself wondering how many
                of the planets were marked as habitable. Unfortunately the StarMap was
                designed to be a map, not a database. This meant I would have to click into
                hundreds of planets to see their details to find out which are habitable.
                I decided to build the my own app and designe it to allow users to query and 
                view the raw data behind the StarMap instead.</p>
            </section>
            <section className="col-12 col-sm-6 align-self-stretch">
                <Image src={ img_starmap }
                    alt="Star Citizen Starmap Screenshot"
                />
            </section>
        </div>
        <div className='row justify-content-evenly my-5'>
            <section className="col-12 col-sm-6 text-center">
                <h6 className="code-comment">// The Needs</h6>
                <h2 className="font-bk">It's all about the Data</h2>
                <p>The first and most obvious need is that the app would need to reference the
                used by Cloud Imperium's StarMap. Then the data would need to be stored in a way
                that could be referenced by entity type. Finally, the data would need to be 
                displayed in an interactive table. A classic web app senario.</p>
            </section>
        </div>
        <div className='row justify-content-evenly align-items-stretch my-5'>
            <section className="col-12 col-sm-4">
                <div className={ addClassNames(style.icon, style['icon-parse'], false) }>
                    <Image src={ icon_parse }
                        alt="Parse Icon"
                    />
                </div>
                <h3 className="font-bk">Parse</h3>
                <p>The data used by Cloud Imperium's StarMap needs to be parsed. I was able to 
                find a series of backend web calls that were used to retrieve data.</p>
            </section>
            <section className="col-12 col-sm-4">
                <div className={ addClassNames(style.icon, style['icon-store'], false) }>
                    <Image src={ icon_store }
                        alt="Store Icon"
                    />
                </div>
                <h3 className="font-bk">Store</h3>
                <p>Since the data calls from the StarMap were structured to follow its own
                interaction paradime, it was not conducive to querying by entity. So the parsed
                data would need to be stored.</p>
            </section>
            <section className="col-12 col-sm-4">
                <div className={ addClassNames(style.icon, style['icon-display'], false) }>
                    <Image src={ icon_display }
                        alt="Display Icon"
                    />
                </div>
                <h3 className="font-bk">Display</h3>
                <p>The data would need to be displayed in an interactive table so that the
                data can be searched and sorted.</p>
            </section>
        </div>
        <div className='row justify-content-evenly align-items-center my-5'>
            <section className="col-12 col-sm-6">
                <h6 className="code-comment">// The Solution</h6>
                <h2 className="font-bk">Tech Stack</h2>
                <p>For this app I chose to use MongoDB for my backend due to it's growing
                popularity and this would be a great opportunity to get some experience with 
                it. I chose to use Node.js as a backend for similar reasons. It also has the
                added benefit of not making me switch be languages while developing.
                DataTables made a perfect front end solution for displaying the data.</p>
                <h6 className='code-comment'>// Highlights</h6>
                <ol>
                    <li></li>
                    <li></li>
                    <li></li>
                </ol>
            </section>
            <section className="col-12 col-sm-6 d-flex flex-column justify-content-center">
                <Image src={ img_in_use }
                    alt="phone screen shot"
                />
            </section>
        </div>
        <div className='row justify-content-evenly my-5'>
            <section className="col-12 col-sm-6 text-center">
                <h6 className="code-comment">// Hurdles</h6>
                <h2 className="font-bk">An Apostrophe</h2>
                <p>While setting up the code in Node.js to parse the StarMap data calls,
                I ran into an issue that left me perplexed. After turning to stackoverflow,
                I realized that it was do to a simple apostrophe.</p>
            </section>
        </div>
    </FeatureSpace>
    <FeatureSpace theme='light'>
        <div className='row justify-content-evenly my-5'>
            <section className="col-12 col-sm-6 text-center">
                <h6 className="code-comment">// Expore the 'verse</h6>
                <h2 className="font-bk">Test it out</h2>
                <p></p>
                { gotoLink }
            </section>
        </div>
    </FeatureSpace>
    <Footer/>
    </>)
}
