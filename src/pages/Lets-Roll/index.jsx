import Head from 'next/head'
import RollProbabilityCalculator from "@/roll_probability/components/RollProbabilityCalculator.jsx";
import Footer from '@/portfolio/components/Footer';

export default function Home(props) { //console.debug('DEBUG - in pages/Lets-Roll/index', props)
    const title = "Roll Probability Calculator"
    
    return (<>
    <Head>
        <title>{title}</title>
        <meta name="description" content={ title } />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <RollProbabilityCalculator footer={ Footer } { ...props } />
    </>)
}
