import { Component } from "react";
import { addClassNames, tryFor } from "@/common/utils/Utilities";

import style from '@/portfolio/styles/HelloWorldCarousel.module.scss'

export default class HelloWorldCarousel extends Component{
    static PRETTIFY_BASE_URL = '/prettify/'
    static PRETTIFY_RUN_FILE = 'run_prettify.js'
    static PRETTIFY_CSS_REGEX = /\/prettify\/.+\.css/
    static PRETTIFY_JS_ID = 'prettify-js'

    static CODEBLOCKS = [
        {
            name: 'JavaScript',
            code: 'console.log("Hello, World!")'
        },{
            name: 'HTML',
            code: '<!DOCTYPE>\n' +
                  '<html>\n' +
                  '\t<head></head>\n' +
                  '\t<body>\n' +
                  '\t\t<p>Hello, World!</p>\n' +
                  '\t</body>\n' +
                  '</html>'
        },{
            name: 'Java',
            code: 'class HelloWorld {\n' +
                  '\tpublic static void main(String[] args) {\n' +
                  '\t\tSystem.out.println(\"Hello, World!\");\n' +
                  '\t}\n' +
                  '}'
        },{
            name: 'SQL',
            prettifyLang: 'sql',
            code: 'SELECT "Hello, World!" AS message;'
        }
    ]

    constructor(props){
        super(props)

        this.id = 'HelloWorldCarousel'
        this.interval = this.props.interval !== undefined ? this.props.interval : 6000

        this.state = {
            activeIndex: 0
        }

        this.runPrettify = this.runPrettify.bind(this)
        this.getPrettifyUrl = this.getPrettifyUrl.bind(this)
        this.getAdditionalPrettifyLanguages = this.getAdditionalPrettifyLanguages.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.componentDidUpdate = this.componentDidUpdate.bind(this)
        this.componentWillUnmount = this.componentWillUnmount.bind(this)
    }
    
    componentDidMount(){
        //check for and load Prettify if missing
        if(window && window.PR==undefined){
            $('<script></script>',{
                id: HelloWorldCarousel.PRETTIFY_JS_ID,
                type: "text/javascript",
                src: this.getPrettifyUrl()
            }).appendTo('head')
        }

        //Set up the bootstrap carousel
        const $carousel = $('#'+this.id),
            carousel = bootstrap.Carousel.getOrCreateInstance( $carousel.get(0), {
                interval: this.interval,
                ride: 'carousel'
            } )
        $carousel.on('slide.bs.carousel', event => {
            this.setState({
                activeIndex: event.to
            })
        })
        this.setState({
            carousel: carousel
        }, () => {
            carousel.cycle()
        })
    }

    componentDidUpdate(prevProps, prevState){}

    componentWillUnmount(){
        //remove Prettify CSS
        $('link').filter( (index, el)=>el.href.search(HelloWorldCarousel.PRETTIFY_CSS_REGEX)>-1 ).remove()
        //remove Prettify JS
        delete window.PR

        //remove carousel
        this.state.carousel.dispose()
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
        return HelloWorldCarousel.CODEBLOCKS
            .filter( ({prettifyLang}) => !!prettifyLang )
            .map( ({prettifyLang}) => prettifyLang )
    }

    render(){
        const label = HelloWorldCarousel.CODEBLOCKS[ this.state.activeIndex ].name,
            slides = HelloWorldCarousel.CODEBLOCKS.map( (language, idx) => {
                return(
                <div key={ idx } className={ 'carousel-item' + (idx==0 ? ' active' : '') }>
                    <pre className="m-3"
                    ><code className={ "prettyprint linenums" + (language.prettifyLang ? ' language-'+language.prettifyLang : '') }
                    >{ language.code }</code></pre>
                </div>)
            })
        
        return(<>
        <h3 className='w-100 text-start text-dark m-0'>"Hello, World!" <b
            className='float-end font-monospace text-primary'
        >{ label }</b></h3>
        <figure className='figure w-100'>
            <div className={ addClassNames(style['hello-world'], 'shadow-lg carousel slide') }
                id={ this.id }
            >
                <div className="carousel-inner">
                    { slides }
                </div>
            </div>
            <figcaption className='figure-caption float-end position-relative'
            ><a className='text-muted stretched-link'
                href='https://en.wikipedia.org/wiki/%22Hello%2C_World!%22_program'
            >Learn more</a> about "Hello, World!"</figcaption>
        </figure>
        </>)
    }
}

// ,{
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