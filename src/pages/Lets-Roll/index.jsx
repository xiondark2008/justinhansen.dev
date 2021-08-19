import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import RollProbabilityCalculator from "@/roll_probability/components/RollProbabilityCalculator.jsx";

export default function Home() { //console.debug('DEBUG - in pages/Lets-Roll/index')
    const title = "Roll Probability Calculator"
    
    return (
    <div>
        <Head>
            <title>{title}</title>
            <meta name="description" content={title} />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <RollProbabilityCalculator/>

    </div>
    )
}
