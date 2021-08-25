import Head from 'next/head'

import "@/styles/global.scss"

export default function MyApp({ Component, pageProps }) { //console.log('DEBUG - in _app args: ', arguments)
  
  return(<>
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script type="text/javascript" src="/jquery/jquery-3.6.0.js"></script>
    <script type="text/javascript" src="/bootstrap/js/bootstrap.bundle.js"></script>

  {/* Global site tag (gtag.js) - Google Analytics */}
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-8T4WR8CDBF"></script>
  <script dangerouslySetInnerHTML={ {
    __html: "window.dataLayer = window.dataLayer || [];\n"
          + "function gtag(){ dataLayer.push(arguments); }\n"
          + "gtag( 'js', new Date() );\n"
          + "gtag( 'config', 'G-8T4WR8CDBF' );"
  } }></script>
  </Head>

  <Component {...pageProps}/>
  </>)
}