import Head from 'next/head'
import App from "@/starmap_db/components/StarMapDB.jsx";

//import "@/starmap_db/styles/StarMapDB.module.scss"

export default function Home() {
    const title = "StarMapDB",
        DEV_MODE = !!process.env.DEV_MODE,
        DATATABLES_CSS_PATH = DEV_MODE ? "/datatables/datatables.css" : "/datatables/datatables.min.css",
        DATATABLES_JS_PATH = DEV_MODE ? "/datatables/datatables.js" : "/datatables/datatables.min.js"
    
    console.log("DEV_MODE: ", DEV_MODE)
    return (<>
    <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <link rel="icon" href="/favicon.ico" />

        <link rel="stylesheet" type="text/css"
            href={ DATATABLES_CSS_PATH }/>
        <script type="text/javascript"
            src={ DATATABLES_JS_PATH }></script>
    </Head>
    <App/>
    </>)
}
