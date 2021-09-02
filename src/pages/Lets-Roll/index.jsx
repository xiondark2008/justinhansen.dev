import Head from 'next/head'
import RollProbabilityCalculator from "@/roll_probability/components/RollProbabilityCalculator.jsx";
import Footer from '@/portfolio/components/Footer';

export default function Home(props) { //console.debug('DEBUG - in pages/Lets-Roll/index', props)
    return (<>
    <Head>
        <title>Roll Probability Calculator</title>
        <meta name="description" content="A utility to calculate the odds of rolling a target sum." />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <RollProbabilityCalculator footer={ Footer } { ...props } />
    </>)
}
