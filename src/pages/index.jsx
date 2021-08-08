import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
    return (
    <div>
        <Head>
            <title>Justin Hansen</title>
            <meta name="description" content="Justin Hansen's portfolio" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1>Justin Hansen's Portfolio</h1>
        <p>Hello, welcome to my site. This is currently a work in progress to show a few applications that I have made.</p>
        <Link href="/Lets-Roll">
            <a>Roll Probability Calculator</a>
        </Link>
        <br/>
        <Link href="/StarMapDB">
            <a>Star Citizen Starmap DB</a>
        </Link>

    </div>
    )
}
