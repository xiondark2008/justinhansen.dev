import Head from 'next/head'
import RollProbabilityCalculator from "@/roll_probability/components/RollProbabilityCalculator.jsx";

export default function Home(props) { console.debug('DEBUG - in pages/Lets-Roll/index', props)
    const title = "Roll Probability Calculator"
    
    return (
    <div>
        <Head>
            <title>{title}</title>
            <meta name="description" content={title} />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <RollProbabilityCalculator { ...props } />

    </div>
    )
}
