import Head from 'next/head'

import "@/styles/global.scss"

const DEV_MODE = !!process.env.DEV_MODE,
  JQUERY_DEPENDENCY_TAG = () => {
    if( DEV_MODE ){
      return <script type="text/javascript"
                src="/jquery/jquery-3.6.0.js"></script>
    } else {
      return <script type="text/javascript"
                src="/jquery/jquery-3.6.0.min.js"></script>
    }
  },
  BOOTSTRAP_JS_DEPENDENCY_TAG = () => {
    if( DEV_MODE ){
      return <script type="text/javascript"
                src="/bootstrap/js/bootstrap.bundle.js"></script>
    } else {
      return <script type="text/javascript"
                src="/bootstrap/js/bootstrap.bundle.min.js"></script>
    }
  }

function MyApp({ Component, pageProps }) {
  return <>
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <JQUERY_DEPENDENCY_TAG/>
  </Head>

  <Component {...pageProps}/>
  </>
}

export default MyApp