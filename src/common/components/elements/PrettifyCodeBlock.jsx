import { Component } from "react";
import Head from "next/head";
//import Script from 'next/script'
//import { prettyPrint } from 'code-prettify-google/src/node_prettify'
import { //addClassNames, 
        //  cleanAttributesObject,
        //  isEmpty,
         tryFor } from "@/common/utils/Utilities";
/**
 * NOT WORKING!! don't know why... >:-(
 */
export default class PrettifyCodeBlock extends Component {
    // static URL_BASE = '/prettify/run_prettify.js'
    // static PRETTIFY_SKIN = 'portfolio'
    // static LANG_CODE_LIST = new Set()
    
    constructor(props){
        super(props)

        // this.langCode = this.props.langCode
        // this.preAttr = cleanAttributesObject( this.props.preAttr )
        // this.codeAttr = cleanAttributesObject( this.props.codeAttr )

        // this.codeAttr.className = addClassNames( 'prettify', this.codeAttr.className)
        // if( this.langCode ){
        //     this.codeAttr.className = addClassNames( 'lang-'+this.langCode, this.codeAttr.className, false)
        //     PrettifyCodeBlock.LANG_CODE_LIST.add( this.langCode ) 
        // }

        //this.run = this.run.bind(this)
    }

    componentDidMount(){
        //console.log("in componentDidMount")
        tryFor( () => {
            PR.prettyPrint()
            console.log("ran PR",PR)
        })
        //console.log( $('.carousel-item') )
        //prettyPrint()
    }

    // run(){
    //     console.log("in run")
    //     //PR.prettyPrint()
    // }

    render(){
        return(<>
        <Head>
            <link key="prettify-css"
                rel="stylesheet" type="text/css"
                href="/prettify/skins/portfolio.css"/>
            <script key="prettify-js"
                type="text/javascript"
                src="/prettify/prettify.min.js"></script>
        </Head>
        {/* <Script id="prettify-core"
            src="/prettify/prettify.js"
            strategy="afterInteractive"
            onLoad={ this.run }
            /> */}
        <pre {...this.preAttr}><code {...this.codeAttr}>{ this.props.children }</code></pre>
        </>)
    }
}