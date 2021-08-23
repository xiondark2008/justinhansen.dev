import { Component } from "react";
import { tryFor } from "@/common/utils/Utilities";

import style from '@/portfolio/styles/HelloWorldCarousel.module.scss'

export default class HelloWorldCarousel extends Component{
    static PRETTIFY_BASE_URL = '/prettify/'
    static PRETTIFY_RUN_FILE = 'run_prettify.js'
    static PRETTIFY_CSS_REGEX = /\/prettify\/.+\.css/
    static PRETTIFY_JS_ID = 'prettify-js'

    constructor(props){
        super(props)

        this.codeBlocks = [
            {
                name: 'JavaScript',
                code: 'console.log("Hello, World!")'
            },
            {
                name: 'HTML',
                code: '<!DOCTYPE>\n' +
                      '<html>\n' +
                      '\t<head></head>\n' +
                      '\t<body>\n' +
                      '\t\t<p>Hello, World!</p>\n' +
                      '\t</body>\n' +
                      '</html>'
            },
            {
                name: 'Java',
                code: 'class HelloWorld {\n' +
                      '\tpublic static void main(String[] args) {\n' +
                      '\t\tSystem.out.println(\"Hello, World!\");\n' +
                      '\t}\n' +
                      '}'
            },
            {
                name: 'SQL',
                prettifyLang: 'sql',
                code: 'SELECT "Hello, World!" AS message;'
            }//,
            // {
            //     name: 'test',
            //     code: '<!doctype html>\n' +
            //           '<html>\n' +
            //           '<head>\n' +
            //           '<title>HTML Test</title>\n' +
            //           '<script type="text/javascript">\n' +
            //           '// Say hello world until the user starts questioning\n' +
            //           '// the meaningfulness of their existence.\n' +
            //           'function helloWorld(world) {\n' +
            //           '\tfor (var i = 42; --i >= 0;) {\n' +
            //           '\t\talert(\'Hello \' + String(world));\n' +
            //           '\t}\n' +
            //           '}\n' +
            //           '</script>\n' +
            //           '<style type="text/css">\n' +
            //           'p { color: pink }\n' +
            //           'b { color: blue }\n' +
            //           'u { color: "umber" }\n' +
            //           '</style>\n' +
            //           '</head>\n' +
            //           '<body>\n' +
            //           '<h1>Hello world!</h1>\n' +
            //           '</body>\n' +
            //           '</html>'
            // }
        ]

        this.runPrettify = this.runPrettify.bind(this)
        this.getPrettifyUrl = this.getPrettifyUrl.bind(this)
        this.getAdditionalPrettifyLanguages = this.getAdditionalPrettifyLanguages.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }
    
    componentDidMount(){
        if(window && window.PR==undefined){
            $('<script></script>',{
                id: HelloWorldCarousel.PRETTIFY_JS_ID,
                type: "text/javascript",
                src: this.getPrettifyUrl()
            }).appendTo('head')
        }
        //this.runPrettify()
    }

    componentWillUnmount(){
        //remove Prettify CSS
        $('link').filter( (index, el)=>el.href.search(HelloWorldCarousel.PRETTIFY_CSS_REGEX)>-1 ).remove()
        //remove Prettify JS
        delete window.PR
    }

    runPrettify(){
        tryFor(() => {
            PR.prettyPrint()
        },100)
    }

    getPrettifyUrl(){
        const baseArgs = ['skin=portfolio'],//,'autorun=false'],
            langArgs = this.getAdditionalPrettifyLanguages().map( prettifyLang => 'lang='+prettifyLang ),
            urlArgs = baseArgs.concat( langArgs ).join('&')

        return HelloWorldCarousel.PRETTIFY_BASE_URL + 
            HelloWorldCarousel.PRETTIFY_RUN_FILE + 
            '?' + urlArgs
    }

    getAdditionalPrettifyLanguages(){
        return this.codeBlocks
            .filter( ({prettifyLang}) => !!prettifyLang )
            .map( ({prettifyLang}) => prettifyLang )
    }

    render(){
        const slides = this.codeBlocks.map( (language, idx) => {
                return(
                <div key={ idx } className={ 'carousel-item' + (idx==0 ? ' active' : '') }>
                    <pre className="m-3"><code className={ "prettyprint linenums" + (language.prettifyLang ? ' language-'+language.prettifyLang : '') }>{ language.code }</code></pre>
                </div>)
            })
        
        return(<>
        <div className={ ([style['hello-world'], 'shadow-lg', 'carousel', 'slide']).join(' ') }
            data-bs-ride="carousel"
        >
            <div className="carousel-inner">
                { slides }
            </div>
        </div>
        </>)
    }
}