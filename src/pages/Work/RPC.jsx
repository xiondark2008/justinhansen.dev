import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import LandingSpace from '@/portfolio/components/layouts/LandingSpace';
import FeatureSpace from '@/portfolio/components/layouts/FeatureSpace';
import Footer from '@/portfolio/components/Footer';
import InteractiveRPC from '@/portfolio/components/InteractiveRPC';
import { addClassNames } from '@/common/utils/Utilities';

import style from '@/portfolio/styles/Work.module.scss';
import dice from 'public/images/dice.jpg';
import mobile_first from 'public/images/icons/mobile first.svg';
import speed from 'public/images/icons/speed.svg';
import education from 'public/images/icons/education.svg';
import in_use from 'public/images/Roll-Prob.jpg';

export default function Work() {
    const gotoLink = (
            <Link href='/RPC'>
                <a className='btn btn-primary btn-lg shadow-lg font-bk fs-6 my-md-4'
                    target='_blank'
                >GO TO APP</a>
            </Link>)

    return (<>
    <Head>
        <title>Justin Hansen - Roll Probability Calculator</title>
        <meta name="description" content="Justin Hansen's portfolio project: Roll Propability Calculator" />
        <link rel="icon" href="/JH.svg"/>
    </Head>
    <LandingSpace theme='light'
        navbarProps={ {currentPage: 'RPC'} }
    >
        <div className="container-fluid min-h-inherit">
            <div className="row justify-content-center align-items-center min-h-inherit">
                <section className={ 'col-12 col-md-6 my-5 px-5' }>
                    <h1 className='font-bk'>Roll Probability Calculator</h1>
                    <p>Used to calculate probability when rolling multiple multi-sided dice, this 
                    app focuses on responsive design and fast calculations. Targeted for use on a
                    smartphone, this web app is intended to be used to aid in making decisions 
                    regarding which combination of multi-sided dice to roll while playing a board
                    game.</p>
                    <p>This single page web app is fully independent after the initial load. There
                    is no additional ajax calls or server side calculations. This makes the app
                    a perfect solution for use over paid data connection.</p>
                    <h3 className='text-primary'><b>TECH STACK</b></h3>
                    <ul className='row row-cols-2 list-unstyled'>
                        <li className='col'><b>React.js</b></li>
                        <li className='col'><b>Bootstrap</b></li>
                        <li className='col'><b>HTML5 Canvas</b></li>
                    </ul>
                    { gotoLink }
                </section>
                <div className={ 'col-12 col-md-6 max-vh-85' }>
                    <InteractiveRPC
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
                <h2 className="font-bk">What to Roll?</h2>
                <p>While playing a board game with friends, I found myself in a win/lose situation where I 
                had the choice to roll 4 six-sided dice, or 2 eight-sided and 2 four-sided dice 
                to get a sum of 18 or higher. Both sets of dice use 4 dice and would have a sum 
                range of 4 to 24 so I didn't know how to estimate which would give me the best
                odds of winning. I decided to make a web app to help me with this type of 
                situation in the future.</p>
            </section>
            <section className="col-12 col-sm-6 align-self-stretch">
                <Image src={ dice }
                    alt="phone screen shot"
                />
            </section>
        </div>
        <div className='row justify-content-evenly my-5'>
            <section className="col-12 col-sm-6 text-center">
                <h6 className="code-comment">// The Needs</h6>
                <h2 className="font-bk">Aid Gameplay, Not Hinder It</h2>
                <p>For my web app to be useful, it would need to be used while playing the board
                game. This meant that the app would need to be accessible from a smartphone, not
                interupt the flow on the game, and help the user learn how probability changes
                as different dice are added.</p>
            </section>
        </div>
        <div className='row justify-content-evenly align-items-stretch my-5'>
            <section className="col-12 col-sm-4 position-relative">
                <div className={ addClassNames(style.icon, style['icon-mobile-first'], false) }>
                    <Image src={ mobile_first }
                        alt="Mobile First Icon"
                        layout='responsive'
                    />
                </div>
                <h3 className="font-bk">Mobile First</h3>
                <p>The UX/UI needs to be optimized for use on the most readily available platform
                while gathered around a board game: a smartphone.</p>
            </section>
            <section className="col-12 col-sm-4 position-relative">
                <div className={ addClassNames(style.icon, style['icon-speed'], false) }>
                    <Image src={ speed }
                        alt="Speed Icon"
                        layout='responsive'
                    />
                </div>
                <h3 className="font-bk">Speed</h3>
                <p>No one wants to be "that person" that holds up gameplay every round, so this
                web app would need to be quick. Both UX/UI to calculating the results need to be
                fast and easy to use.</p>
            </section>
            <section className="col-12 col-sm-4 position-relative">
                <div className={ addClassNames(style.icon, style['icon-education'], false) }>
                    <Image src={ education }
                        alt="Education Icon"
                        layout='responsive'
                    />
                </div>
                <h3 className="font-bk">Educational</h3>
                <p>The best solution should help user learn how the probability changes based on
                choice of dice.</p>
            </section>
        </div>
        <div className='row justify-content-evenly align-items-center my-5'>
            <section className="col-12 col-sm-6">
                <h6 className="code-comment">// The Solution</h6>
                <h2 className="font-bk">Fast Fingers</h2>
                <p>Through the use of thoughtful design, a cleaver equation, and informative graph,
                a web app was born. This web app only uses HTML, CSS, and JavaScript as a tech
                stack with no server side reliance. In fact before hosting on this site, I would
                run it off of a jsfiddle.</p>
                <h6 className='code-comment'>// Highlights</h6>
                <ol>
                    <li><b className='text-primary'>Design</b> - Large buttons and minimal use of form fields lead to an
                    interface that is quick and easy to use with fingers on a smartphone.</li>
                    <li><b className='text-primary'>Calculation</b> - This what I am most pround of with this app. Through
                    the use of an algorithm I came up with, calculating the probability of getting
                    a specified result for any combination of dice is fast, even on a smartphone.</li>
                    <li><b className='text-primary'>Graph</b> - By displaying a graph of the probability curve, the user is
                    able to learn how the probability changes as dice combination changes.</li>
                </ol>
            </section>
            <section className="col-12 col-sm-6 d-flex flex-column justify-content-center">
                <Image className="img-fluid"
                    src={ in_use }
                    alt="phone screen shot"
                />
            </section>
        </div>
        <div className='row justify-content-evenly my-5'>
            <section className="col-12 col-sm-6 text-center">
                <h6 className="code-comment">// Hurdles</h6>
                <h2 className="font-bk">Design & Calculation</h2>
                <p>While developing this app I faced two major hurdles. The first was 
                designing a UI that was both intuitive and condence enough for mobile.</p>
                <p>The second hurdle was calculating the result quickly on a cellphone.
                Each time a die is added, the number of possible combinations increase 
                exopentially, quickly surpassing the ability of a smartphone to run through
                every combination. So I had to find another way to calculate.</p>
            </section>
        </div>
    </FeatureSpace>
    <FeatureSpace theme='light'>
        <div className='row justify-content-evenly my-5'>
            <section className="col-12 col-sm-6 text-center">
                <h6 className="code-comment">// Let's Roll</h6>
                <h2 className="font-bk">Test it out</h2>
                <p></p>
                { gotoLink }
            </section>
        </div>
    </FeatureSpace>
    <Footer/>
    </>)
}
