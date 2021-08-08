import Head from 'next/head'

import "@/styles/global.scss"

function MyApp({ Component, pageProps }) {
  return <>
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="/api/resources/jquery/jquery.js"></script>
    <script src="/api/resources/bootstrap-js/bootstrap.bundle.js"></script>
  </Head>

  <Component {...pageProps}/>
  </>
}

export default MyApp
