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
        {/* <link rel="stylesheet" href="/api/css/datatables" /> */}
        {/* <script src="/api/scripts/datatables"></script> */}
        <link rel="stylesheet" type="text/css"
            href="https://cdn.datatables.net/v/bs5/dt-1.10.25/sl-1.3.3/datatables.css"/>
        <script type="text/javascript"
            src="https://cdn.datatables.net/v/bs5/dt-1.10.25/sl-1.3.3/datatables.js"></script>
    </Head>
    <App/>
    </>)
}
