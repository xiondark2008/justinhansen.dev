import Head from 'next/head'

import "@/styles/global.scss"

function MyApp({ Component, pageProps }) {
  return(<>
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script type="text/javascript" src="/jquery/jquery-3.6.0.js"></script>
    <script type="text/javascript" src="/bootstrap/js/bootstrap.bundle.js"></script>
  </Head>

  <Component {...pageProps}/>
  </>)
}

export default MyApp