import { Component } from 'react'
import Head from 'next/head'

import "@/styles/global.scss"

export default class MyApp extends Component {
  constructor(props) { //console.log('DEBUG - in _app.constructor args: ', arguments)
    super(props)
  }

  componentDidMount(){ //console.log('DEBUG - in _app.componentDidMount ')
    // require('node_modules/jquery/src/jquery')
  }
  
  render(){ //console.log('DEBUG - in _app.render args: ', arguments)
    const Component = this.props.Component

    if( process.browser ){
      require('node_modules/jquery/src/jquery')
    }

    return(<>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Opengraph Image */}
      <meta property="og:image" content="https://justinhansen.dev/Opengraph.jpg" />
      <meta property="og:image:secure_url" content="https://justinhansen.dev/Opengraph.jpg" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="628" />
      <meta property="og:image:alt" content="Justin Hansen; justinhansen.dev" />

      {/* Global site tag (gtag.js) - Google Analytics */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-8T4WR8CDBF"></script>
      <script dangerouslySetInnerHTML={ {
        __html: "window.dataLayer = window.dataLayer || [];\n"
              + "function gtag(){ dataLayer.push(arguments); }\n"
              + "gtag( 'js', new Date() );\n"
              + "gtag( 'config', 'G-8T4WR8CDBF' );"
      } }></script>
    </Head>

    <Component {...this.props}/>
    </>)
  }
}

// export default function MyApp({ Component, pageProps }) { //console.log('DEBUG - in _app args: ', arguments)
  
//   return(<>
//   <Head>
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     { require('node_modules/jquery/src/jquery') }
//     {/* <script type="text/javascript" src="/jquery/jquery-3.6.0.js"></script> */}
//     {/* <script type="text/javascript" src="/bootstrap/js/bootstrap.bundle.js"></script> */}

//   {/* Global site tag (gtag.js) - Google Analytics */}
//   <script async src="https://www.googletagmanager.com/gtag/js?id=G-8T4WR8CDBF"></script>
//   <script dangerouslySetInnerHTML={ {
//     __html: "window.dataLayer = window.dataLayer || [];\n"
//           + "function gtag(){ dataLayer.push(arguments); }\n"
//           + "gtag( 'js', new Date() );\n"
//           + "gtag( 'config', 'G-8T4WR8CDBF' );"
//   } }></script>
//   </Head>

//   <Component {...pageProps}/>
//   </>)
// }