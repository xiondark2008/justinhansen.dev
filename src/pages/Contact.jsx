import Head from 'next/head'
import Link from 'next/link'
import LandingSpace from '@/portfolio/components/layouts/LandingSpace'

export default function Home() {
    return (<>
    <Head>
        <title>Justin Hansen</title>
        <meta name="description" content="Justin Hansen's portfolio" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <LandingSpace theme='dark'
        navbarProps={ {currentPage: 'Contact'} }
    >
        <p>Contact Info</p>
    </LandingSpace>
    </>)
}
