import Navbar from '@/portfolio/components/Navbar'
import BootstrapNavBar from '@/common/components/BootstrapNavBar'
import LandingPage from '@/portfolio/components/LandingPage'
import Head from 'next/head'
import Link from 'next/link'

export default function About() {
    return (<>
    <Head>
        <title>Justin Hansen</title>
        <meta name="description" content="Justin Hansen's portfolio" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <Navbar currentPage={ 'About' }/>
    <div className="container-fluid">
        <div className="row justify-content-evenly">
            <section className="col col-md-6">
                <h6>//HELLO</h6>
                <h1>About Justin</h1>
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
                
                <h4>Technical Skills</h4>
                <ul id="tech-skills" className="d-flex flex-column flex-wrap list-unstyled"
                    style={ {height: '7rem', width: '15rem'} }
                >
                    <li>JavaScript</li>
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>Java</li>
                    <li>React.js</li>
                    <li>Sass</li>
                    <li>Node.js</li>
                    <li>SQL</li>
                </ul>
                <a className="btn btn-primary">My Resume</a>
            </section>
            <figure className="col col-md-4">
                <div>headshot</div>
            </figure>
        </div>
    </div>
    </>)
}
