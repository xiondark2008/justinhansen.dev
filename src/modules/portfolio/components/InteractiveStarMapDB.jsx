import { Component } from "react";
import LaptopFrame from "@/common/components/layouts/LaptopFrame";
import { mergeObjects } from "@/common/utils/Utilities";

export default class InteractiveStarMapDB extends Component {
    constructor(props){ //console.group('DEBUG - in InteractiveStarMapDB.constructor')
        super(props)
        //console.log('props: ',this.props)

        this.state = {
            margin: this.parseMargin(this.props.margin),
            args: mergeObjects({
                containerAttr: {}
            }, this.props.args, true, true)
        }
        this.state.args.containerAttr.id = 'interactiveStarMapDB'
        //console.groupEnd()

        this.componentDidMount = this.componentDidMount.bind(this)
        this.componentDidUpdate = this.componentDidUpdate.bind(this)
        this.parseMargin = this.parseMargin.bind(this)
    }

    componentDidMount(){
        this.setState({
            $figure: $('#'+this.state.args.containerAttr.id)
        })

        $(window).on('resize', ((event)=>{
            this.forceUpdate()
        }).bind(this))
    }

    componentDidUpdate(prevProps, prevState){ //console.group("DEBUG - in InteractiveStarMapDB.componentDidUpdate()")
        const $parent = this.state.$figure.parent()
        let newState = mergeObjects({}, this.state),
            hasChanged = false

        //console.log( 'parent: ', $parent.width(), $parent.height() )
        //console.log("prevState.args: ", prevState.args)

        if( prevProps.margin !== this.props.margin ){
            hasChanged = true
            newState = mergeObjects(newState, {
                margin: this.parseMargin(this.props.margin)
            }, true)
        }
        
        if( prevState.args.availableWidth !== $parent.width() 
            || prevState.args.availableHeight !== $parent.height() 
        ){
            const newArgs = mergeObjects(prevState.args, {
                width: $parent.width() - newState.margin.x,
                height: $parent.height() - newState.margin.y, 
                availableWidth: $parent.width(),
                availableHeight: $parent.height()
            }, true, true)

            hasChanged = true
            newState = mergeObjects( newState, {
                args: newArgs
            }, true)
        }

        if( hasChanged ){
            this.setState( newState )
        }
        //console.groupEnd()
    }

    // componentWillUnmount(){}

    parseMargin(str){
        const vals = str.split(' ').map( it=>parseInt(it) ),
            rtn = {}
    
        rtn.top = vals[0]
        rtn.right = vals[1] || rtn.top
        rtn.bottom = vals[2] || rtn.top
        rtn.left = vals[3] || rtn.right

        Object.defineProperties(rtn, {
            'x': {
                get: (function(){
                    return this.left + this.right
                }).bind(rtn)
            },
            'y': {
                get: (function(){
                    return this.top + this.bottom
                }).bind(rtn)
            }
        })
            
        return rtn
    }

    render(){
        return(
        <LaptopFrame {...this.state.args}>
            <iframe src='/StarMapDB'
                className="scrollbar-hide"
            ></iframe>
        </LaptopFrame>
        )
    }
}