import { Component } from "react";

export default class HelloWorld extends Component{
    constructor(props){
        super(props)

        this.codeBlocks = [
            'console.log("Hello, World!")',
            '<!DOCTYPE>\n<html>\n\t<head></head>\n\t<body>\n\t\t<p>Hello, World!</p>\n\t</body>\n</html>',
            'class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello, World!\");\n\t}\n}'
        ]
    }

    render(){
        const slides = this.codeBlocks.map( (code, idx) => {
            return(
            <div key={ idx } className={ 'carousel-item' + (idx==0 ? ' active' : '') }>
                <pre className="m-3"><code>{ code }</code></pre>
            </div>)
        })
        return(<>
        <div className="hello-world carousel slide bg-dark text-light text-start shadow-lg" data-bs-ride="carousel">
            <div className="carousel-inner">
                { slides }
            </div>
        </div>
        </>)
    }
}