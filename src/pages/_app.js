import Head from 'next/head'

import "@/styles/global.scss"

function MyApp({ Component, pageProps }) {
  return <>
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="/api/scripts/jquery"></script>
    <script src="/api/scripts/bootstrap"></script>
  </Head>

  <Component {...pageProps}/>
  </>
}

export default MyApp
