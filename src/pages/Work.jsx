import BootstrapNavBar from '@/common/components/BootstrapNavBar'
import LandingPage from '@/portfolio/components/LandingPage'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '@/portfolio/components/Navbar'

export default function Work() {
    return (<>
    <Head>
        <title>Justin Hansen</title>
        <meta name="description" content="Justin Hansen's portfolio" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <Navbar currentPage={ 'Work' }/>
    <p>My Work</p>
    </>)
}
