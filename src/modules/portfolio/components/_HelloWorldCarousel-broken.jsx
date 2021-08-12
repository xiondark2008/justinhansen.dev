//WITH PrettifyCodeBlock
import { Component } from "react";
import PrettifyCodeBlock from "@/common/components/elements/PrettifyCodeBlock";
import { isEmpty } from "@/common/utils/Utilities";

import style from '@/portfolio/styles/HelloWorldCarousel.module.css'

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
                langCode: 'sql',
                code: 'SELECT "Hello, World!" AS message;'
            }
        ]
        
        const prettifyLangQuery = this.codeBlocks
            .filter( block => !!block.langCode )
            .map( block => 'lang='+block.langCode)
            .join('&')
        this.prettifyURL = "/prettify/run_prettify.js?skin=portfolio" + (!isEmpty( prettifyLangQuery ) ? '&'+prettifyLangQuery : '')
    }

    render(){
        const slides = this.codeBlocks.map( (language, idx) => {
            return(
            <div key={ idx } className={ 'carousel-item' + (idx==0 ? ' active' : '') }>
                <PrettifyCodeBlock
                    langCode={ language.langCode }
                    preAttr={ {className: "m-3"} }
                    codeAttr={ {className: "linenums"} }
                >{ language.code }</PrettifyCodeBlock>
            </div>
            )
        })

        return(<>
        <div className={ ([style['hello-world'], style.shadow]).join(' ') }
            // data-bs-ride="carousel"
        >
            <div className="carousel-inner">
                { slides }
            </div>
        </div>
        </>)
    }
}