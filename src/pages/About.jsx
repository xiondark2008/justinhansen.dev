import Head from 'next/head';
import LandingSpace from '@/portfolio/components/layouts/LandingSpace';
import Footer from '@/portfolio/components/Footer';

import style from '@/portfolio/styles/About.module.scss';

export default function About() {
    const breakpoint = 'lg',
        headshotSmallClassName = ([style.headshot, style['headshot-small'], 'd-'+breakpoint+'-none']).join(' '),
        headshotBigClassName = ([style.headshot, 'd-none d-'+breakpoint+'-block col col-'+breakpoint+'-4']).join(' '),
        headshot = ( className ) => {
            return(
            <figure className={ className }>
                <img className="img-fluid"
                    src="/images/gray-grid.png"
                    alt="headshot"
                />
            </figure>
            )
        }

    return (<>
    <Head>
        <title>Justin Hansen</title>
        <meta name="description" content="Justin Hansen's portfolio" />
        <link rel="icon" href="/favicon.ico" />
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
                    <p>I’m a Front-End Developer with over 8+ years of experience developing clean 
                    user experiences.</p>
                    <p>My road to development started like every great creator of our time - in my 
                    college dorm room. My freshman friend was really into computers so much so that 
                    he had built his own. One afternoon he decided to take it apart to rebuild it 
                    cleaner, more efficiently. Being a life long tinkerer and genuinely curious I was 
                    intrigued so I joined him.</p>
                    <p>Quickly I was hooked. I was fascinated with how the peaces fit together - worked 
                    together - to make something bigger. But that was just the start. Now that I could 
                    build a machine, could I tell it how to work?</p>
                    <p>So I taught myself to code.</p>
                    
                    <h3 className="mt-4 text-primary font-bk">TECHNICAL SKILLS</h3>
                    <ul id={ style['tech-skills'] }
                        className="row row-cols-4 list-unstyled"
                    >
                        <li className='col'>JavaScript</li>
                        <li className='col'>HTML</li>
                        <li className='col'>CSS</li>
                        <li className='col'>Java</li>
                        <li className='col'>React.js</li>
                        <li className='col'>Sass</li>
                        <li className='col'>Node.js</li>
                        <li className='col'>SQL</li>
                    </ul>
                    <div className={ 'd-grid gap-2 d-'+breakpoint+'-block' }>
                        <a className='btn btn-primary btn-lg'>My Resume</a>
                    </div>
                </section>
                { headshot( headshotBigClassName ) }
            </div>
        </div>
    </LandingSpace>
    <Footer/>
    </>)
}
