import Head from 'next/head'
import Link from 'next/link'
import App from "@/starmap_db/components/StarMapDB.jsx";

//import "@/starmap_db/styles/StarMapDB.module.scss"

export default function Home() {
    const title = "StarMapDB"
    
    return (<>
    <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" type="text/css"
            href="/datatables/datatables.min.css"/>
        <script type="text/javascript"
            src="/datatables/datatables.min.js"></script>
    </Head>
    <App/>
    </>)
}
