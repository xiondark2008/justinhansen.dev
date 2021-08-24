import Head from 'next/head'
import { useRouter } from 'next/router'
import Footer from '@/portfolio/components/Footer'

import "@/styles/global.scss"

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  
  return(<>
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script type="text/javascript" src="/jquery/jquery-3.6.0.js"></script>
    <script type="text/javascript" src="/bootstrap/js/bootstrap.bundle.js"></script>
  </Head>

  <Component footer={ Footer } {...pageProps}/>
  { router.pathname != '/Lets-Roll' && <Footer/> }
  </>)
}

export default MyApp