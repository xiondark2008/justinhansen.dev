import Head from 'next/head';
import LandingSpace from '@/portfolio/components/layouts/LandingSpace';

import style from '@/portfolio/styles/Work.module.scss';
import Link from 'next/link';

export default function Work() {
    const breakpoint = 'lg'

    return (<>
    <Head>
        <title>Justin Hansen</title>
        <meta name="description" content="Justin Hansen's portfolio" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <LandingSpace theme='light'
        navbarProps={ {currentPage: 'Work'} }
    >
        <p>My Work</p>
        <Link href="/Work/Lets-Roll">
            <a>Roll Probability Calculator</a>
        </Link>
    </LandingSpace>
    </>)
}
