import { Component } from "react";
import { addClassNames, 
         addStyle, 
         cleanAttributesObject, 
         cssTransformScaleToCenter, 
         mergeObjects } from "@/common/utils/Utilities";

import style from '@/common/styles/_LaptopFrame.module.scss';

//TODO: fix transformation origin
export default class LaptopFrame extends Component {
    static CONTENT_WIDTH = 1366
    static BORDER_WIDTH = 24 * 2
    static ADDITIONAL_MARGIN_X = 93 * 2
    static INITIAL_WIDTH = this.CONTENT_WIDTH + this.BORDER_WIDTH + this.ADDITIONAL_MARGIN_X
    static CONTENT_HEIGHT = 800
    static BORDER_HEIGHT = 24 + 80
    static ADDITIONAL_MARGIN_Y = 80
    static INITIAL_HEIGHT = this.CONTENT_HEIGHT + this.BORDER_HEIGHT
    constructor(props){ //console.group('DEBUG - in LaptopFrame.constructor')
        super(props)
        // console.log("props: ", this.props)

        const containerAttr = cleanAttributesObject( this.props.containerAttr ),
            transformProperties = this.getTransformProperties(),
            shouldPerserveCheck = ( (styleName, preserveName) => {
                if( containerAttr.style[styleName] !== undefined ){
                    this[preserveName] = true
                } else {
                    containerAttr.style = addStyle(containerAttr.style, {
                        [styleName]: transformProperties[styleName]
                    })
                }
            } ).bind(this)
        
        containerAttr.className = addClassNames( style.laptop, containerAttr.className )
        
        if( containerAttr.style !== undefined ){
            shouldPerserveCheck('transform', 'preserveTransfrom')
            shouldPerserveCheck('left', 'preserveLeft')
            shouldPerserveCheck('top', 'preserveTop')
        }
        
        this.state = {
            containerAttr: containerAttr
        }
        // console.log('containerAttr: ', this.state.containerAttr)
        

        this.componentDidUpdate = this.componentDidUpdate.bind(this)
        this.getTransformProperties = this.getTransformProperties.bind(this)
        // console.groupEnd()
    }

    componentDidUpdate(prevProps, prevState){ //console.group('DEBUG - in LaptopFrame.componentDidUpdate()')
        // console.log('start containerAttr: ', this.state.containerAttr)
        // console.log('prevProps: ', prevProps)
        // console.log('this.props: ', this.props)
        if( prevProps.width !== this.props.width
            || prevProps.height !== this.props.height
            || prevProps.availableWidth !== this.props.availableWidth
            || prevProps.availableHeight !== this.props.availableHeight
            || prevProps.useMin !== this.props.useMin
        ){
            console.log('Props have changed...')
            if(!this.preserveTransform || !this.preserveTransformOrigin){
                const style = {},
                    transformProperties = this.getTransformProperties()
                
                if( !this.preserveTransform ){
                    style.transform = transformProperties.transform
                }
                // if( !this.preserveTransformOrigin ){
                //     style.transformOrigin = transformProperties.transformOrigin
                // }
                if( !this.preserveLeft ){
                    style.left = transformProperties.left
                }
                if( !this.preserveTop ){
                    style.top = transformProperties.top
                }

                this.setState( mergeObjects(prevState, {
                    containerAttr: { style: style }
                }, true, true) )
            }
        }
        // console.log('end containerAttr: ', this.state.containerAttr)
        // console.groupEnd()
    }

    getTransformProperties(
        width = this.props.width,
        height = this.props.height,
        availableWidth = this.props.availableWidth,
        availableHeight = this.props.availableHeight,
        useMin = this.props.useMin
    ){ //console.group('DEBUG - in LaptopFrame.getTransformProperties()')
        const scaleVals = [],
            //originVals = ['50%','50%'],
            transformProperties = {}
        
        // console.log(width, height, availableWidth, availableHeight)
        
        if( width ){
            scaleVals.push( width / LaptopFrame.INITIAL_WIDTH )
        }
        if( availableWidth ){
            // originVals[0] = cssTransformScaleToCenter( width, availableWidth, LaptopFrame.INITIAL_WIDTH )
            transformProperties.left = availableWidth/2 - LaptopFrame.INITIAL_WIDTH/2
        }
        if( height ){
            scaleVals.push( height / LaptopFrame.INITIAL_HEIGHT )
        }
        if( availableWidth ){
            // originVals[0] = cssTransformScaleToCenter( width, availableWidth, LaptopFrame.INITIAL_WIDTH )
            transformProperties.top = availableHeight/2 - LaptopFrame.INITIAL_HEIGHT/2
        }
        
        if( scaleVals.length > 0 ){
            if( useMin && scaleVals.length > 1 ) {
                //smaller width
                if(scaleVals[0] < scaleVals[1]) {
                    
                    // if( availableHeight ){
                    //     //originVals[1] = cssTransformScaleToCenter( height * scaleVals[1], availableHeight, LaptopFrame.INITIAL_HEIGHT )
                    //     originVals.splice(0, 1)
                    // }
                    scaleVals.splice(1,1)
                }
                //smaller height
                else if(scaleVals[0] > scaleVals[1]) {
                    
                    // if( availableWidth ){
                    //     originVals[0] = cssTransformScaleToCenter( width * scaleVals[0], availableWidth, LaptopFrame.INITIAL_WIDTH )
                    //     //originVals.splice(1, 1)
                    // }
                    scaleVals.splice(0,1)
                }
                //equal, do nothing
            }
            // console.log(scaleVals, originVals)
            transformProperties.transform = 'scale( '+scaleVals.join(',')+' )'
            // transformProperties.transformOrigin = originVals.join(' ')
        }

        // console.groupEnd()
        return transformProperties
    }

    render(){
        return(
        <figure {...this.state.containerAttr}>
            { this.props.children }
        </figure>
        )
    }
}