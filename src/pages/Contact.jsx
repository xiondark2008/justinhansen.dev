import Head from 'next/head';
import Link from 'next/link';
import LandingSpace from '@/portfolio/components/layouts/LandingSpace';
import { addClassNames } from '@/common/utils/Utilities';
import Footer from '@/portfolio/components/Footer';

import style from '@/portfolio/styles/Contact.module.scss'

export default function Home() {
    const contacts = [
        {
            label: 'Email',
            value: <a href='mailto:me@justinhansen.dev'
                      target='_blank'
                    >me@justinhansen.dev</a>
        },{
            label: 'LinkedIn',
            value: <a href='https://www.linkedin.com/in/justin-hansen-dev'
                      target='_blank'
                    >Go To</a>
        },{
            label: 'Stack Overflow',
            value: <a href='https://stackoverflow.com/users/1824363/xion-dark'
                      target='_blank'
                    >Go To</a>
        },{
            label: 'JSFiddle',
            value: <a href='https://jsfiddle.net/user/xiondark2008/fiddles/'
                      target='_blank'
                    >Go To</a>
        },{
            label: 'GitHub',
            value: <a href='https://github.com/xiondark2008'
                      target='_blank'
                    >Go To</a>
        }
    ]

    return (<>
    <Head>
        <title>Justin Hansen's Portfolio - Contact</title>
        <meta name="description" content="Contact Justin Hansen" />
        <link rel="icon" href="/JH.svg"/>
    </Head>
    <LandingSpace theme='dark'
        navbarProps={ {currentPage: 'Contact'} }
    >
        <main className='container'>
            { contacts.map( contact =>
                <div className={ addClassNames( style.contactLine, 'row') }
                    key={ contact.label }
                >
                    <div className='col-auto'>
                        { contact.label }
                    </div>
                    <div className='col'></div>
                    <div className='col-auto'>
                        { contact.value }
                    </div>
                </div>
            ) }
        </main>
    </LandingSpace>
    <Footer/>
    </>)
}
