import Head from 'next/head';
import Image from 'next/image';
import LandingSpace from '@/portfolio/components/layouts/LandingSpace';
import Footer from '@/portfolio/components/Footer';
import { addClassNames } from '@/common/utils/Utilities';

import style from '@/portfolio/styles/About.module.scss';
import img_headshot from 'public/images/Justin.jpg';

export default function About() {
    const breakpoint = 'lg',
        headshotSmallClassName = ([style.headshot, style['headshot-small'], 'd-'+breakpoint+'-none']).join(' '),
        headshotBigClassName = ([style.headshot, 'd-none d-'+breakpoint+'-block col col-'+breakpoint+'-4']).join(' '),
        headshot = ( className ) => {
            return(
            <figure className={ className }>
                <Image src={ img_headshot }
                    alt="headshot"
                />
            </figure>
            )
        }

    return (<>
    <Head>
        <title>Justin Hansen's Portfolio - About</title>
        <meta name="description" content="About Justin Hansen" />
        <link rel="icon" href="/JH.svg"/>
    </Head>
    <LandingSpace theme='dark'
        navbarProps={ {currentPage: 'About'} }
    >
        <div className={ "container-fluid py-3 pt-"+breakpoint+"-5" }>
            <div className="row justify-content-evenly">
                <section className={ "col-12 col-"+breakpoint+"-6" }>
                    <h5 className="code-comment">//HELLO</h5>
                    <h1 className="display-4 font-bk">ABOUT ME</h1>
                    { headshot( headshotSmallClassName ) }
                    <p>I am a Full-stack Developer with 10+ years of experience developing web
                    applications and java programs. I enjoy working on projects that require
                    out-of-the-box thinking and are user facing. I have a talent for interacting
                    with business and users because of my ability to communicate technical
                    details with non-technical people.</p>
                    <p>My road to development started like every great creator of our time - in
                    my college dorm room. Freshman year, I helped my friend do a clean build on
                    the PC he built himself. Being a lifelong tinkerer and genuinely curious, I
                    kept asking “What does this part do?” as we stripped out and dusted all the
                    parts.</p>
                    <p>From that moment on, I was hooked. I went on to build my own PC, which I
                    have updated and maintained ever since. I declared my major as being
                    Management Information Systems. Intro to Java was my first experience with
                    coding. Despite having an incredibly dull professor, I loved coding right
                    away.</p>
                    <p>I have enjoyed devising the optimal solution for every coding challenge
                    I have face in my career. And I look forward to what new problems I will
                    have the opportunity to solve in the future.</p>
                    
                    <h3 className="mt-4 text-primary font-bk">TECHNICAL SKILLS</h3>
                    <ul className={ addClassNames(style['skill-list'], "row row-cols-2 row-cols-md-4 list-unstyled") }>
                        <li className='col'>React.js</li>
                        <li className='col'>Node.js</li>
                        <li className='col'>Next.js</li>
                        <li className='col'>JavaScript</li>
                        <li className='col'>ECMAScript</li>
                        <li className='col'>CSS3</li>
                        <li className='col'>SASS</li>
                        <li className='col'>Java</li>
                        <li className='col'>Java EE</li>
                        <li className='col'>SQL</li>
                        <li className='col'>MongoDB</li>
                        <li className='col'>HTML5</li>
                        <li className='col'>JSON</li>
                        <li className='col'>XML</li>
                        <li className='col'>jQuery</li>
                        <li className='col'>Bootstrap</li>
                    </ul>
                    <h3 className="mt-4 text-primary font-bk">CONCEPTS</h3>
                    <ul className={ addClassNames(style['skill-list'], "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-2 list-unstyled") }>
                        <li className='col'>Agile Methodologies</li>
                        <li className='col'>Test Driven Development</li>
                        <li className='col'>Responsive Web Design</li>
                        <li className='col'>RESTful WebServices</li>
                        <li className='col'>Object-Oriented Programming (OOP)</li>
                        <li className='col'>Model-View-Controller (MVC)</li>
                        <li className='col'>Data Architecture</li>
                        <li className='col'>Version Control</li>
                    </ul>
                    <div className={ 'd-grid gap-2 d-md-block' }>
                        <a className='btn btn-primary btn-lg'
                            href='https://drive.google.com/file/d/1-IjV6nx7PqfKgfTmyw5vMfaH9GTRcXoe/view?usp=sharing'
                            target='_blank'>My Resume</a>
                    </div>
                </section>
                { headshot( headshotBigClassName ) }
            </div>
        </div>
    </LandingSpace>
    <Footer/>
    </>)
}
