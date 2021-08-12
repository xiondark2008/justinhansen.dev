import Head from 'next/head'
import Link from 'next/link'
import RollProbabilityCalculator from "@/roll_probability/components/RollProbabilityCalculator.jsx";

export default function Home() {
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
