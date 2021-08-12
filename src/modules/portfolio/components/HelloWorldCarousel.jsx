import { Component } from "react";
import Head from 'next/head'
import { prettyPrint } from 'code-prettify-google/src/node_prettify'
import style from '@/portfolio/styles/HelloWorldCarousel.module.css'
import { tryFor } from "@/common/utils/Utilities";

export default class HelloWorldCarousel extends Component{
    constructor(props){
        super(props)

        this.codeBlocks = [
            {
                name: 'JavaScript',
                code: 'console.log("Hello, World!")'
            },
            {
                name: 'HTML',
                code: '<!DOCTYPE>\n<html>\n\t<head></head>\n\t<body>\n\t\t<p>Hello, World!</p>\n\t</body>\n</html>'
            },
            {
                name: 'Java',
                code: 'class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello, World!\");\n\t}\n}'
            },
            {
                name: 'SQL',
                css: 'lang-sql',
                code: 'SELECT "Hello, World!" AS message;'
            }
        ]
    }
    componentDidMount(){
        prettyPrint()
    }

    render(){
        const slides = this.codeBlocks.map( (language, idx) => {
            return(
            <div key={ idx } className={ 'carousel-item' + (idx==3 ? ' active' : '') }>
                <pre className="m-3"><code className={ "prettyprint linenums" + (language.css ? ' '+language.css : '') }>{ language.code }</code></pre>
            </div>)
        })
        return(<>
        <Head>
            <link key="prettify"
                rel="stylesheet" type="text/css"
                href="/prettify/skins/portfolio.css"/>
            {/* <script key="prettify2"
                type="text/javascript"
                src="/prettify/prettify.min.js"></script> */}
        </Head>
        <div className={ ([style['hello-world'], style.shadow, 'carousel', 'slide']).join(' ') }
            data-bs-ride="carousel"
        >
            <div className="carousel-inner">
                { slides }
            </div>
        </div>
        </>)
    }
}