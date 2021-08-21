import { Component } from "react";
import { addClassNames, 
         addStyle, 
         cleanAttributesObject, 
         cssTransformScaleToCenter, 
         mergeObjects } from "@/common/utils/Utilities";

import style from '@/common/styles/_SmartPhoneFrame.module.scss';

//TODO: fix transformation origin
export default class SmartPhoneFrame extends Component {
    static CONTENT_WIDTH = 360
    static BORDER_WIDTH = 32
    static INITIAL_WIDTH = this.CONTENT_WIDTH + this.BORDER_WIDTH
    static CONTENT_HEIGHT = 640
    static BORDER_HEIGHT = 120
    static INITIAL_HEIGHT = this.CONTENT_HEIGHT + this.BORDER_HEIGHT
    constructor(props){ //console.group('DEBUG - in SmartPhoneFrame.constructor')
        super(props)
        // console.log("props: ", this.props)

        const containerAttr = cleanAttributesObject( this.props.containerAttr ),
            transformProperties = this.getTransformProperties(
                this.props.width,
                this.props.height,
                this.props.availableWidth,
                this.props.availableHeight,
                this.props.useMin
            )
        
        containerAttr.className = addClassNames( style.smartphone, containerAttr.className )
        
        if( containerAttr.style !== undefined ){
            if( containerAttr.style.transform !== undefined ){
                this.preserveTransform = true
            } else {
                containerAttr.style = addStyle(containerAttr.style, {
                    transform: transformProperties.transform
                })
            }

            if( containerAttr.style.transformOrigin !== undefined ){
                this.preserveTransformOrigin = true
            } else {
                containerAttr.style = addStyle(containerAttr.style, {
                    transformOrigin: transformProperties.transformOrigin
                }, true)
            }
        }
        
        this.state = {
            containerAttr: containerAttr
        }
        // console.log('containerAttr: ', this.state.containerAttr)
        

        this.componentDidUpdate = this.componentDidUpdate.bind(this)
        this.getTransformProperties = this.getTransformProperties.bind(this)
        // console.groupEnd()
    }

    componentDidUpdate(prevProps, prevState){ //console.group('DEBUG - in SmartPhoneFrame.componentDidUpdate()')
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
                    transformProperties = this.getTransformProperties(
                        this.props.width,
                        this.props.height,
                        this.props.availableWidth,
                        this.props.availableHeight,
                        this.props.useMin
                    )
                
                if( !this.preserveTransform ){
                    style.transform = transformProperties.transform
                }
                if( !this.preserveTransformOrigin ){
                    style.transformOrigin = transformProperties.transformOrigin
                }

                this.setState( mergeObjects(prevState, {
                    containerAttr: { style: style }
                }, true, true) )
            }
        }
        // console.log('end containerAttr: ', this.state.containerAttr)
        // console.groupEnd()
    }

    getTransformProperties(width, height, availableWidth, availableHeight, useMin){ //console.group('DEBUG - in SmartPhoneFrame.getTransformProperties()')
        const scaleVals = [],
            originVals = ['50%','50%'],
            transformProperties = {}
        
        // console.log(width, height, availableWidth, availableHeight)
        
        if( width ){
            scaleVals.push( width / SmartPhoneFrame.INITIAL_WIDTH )

            if( availableWidth ){
                originVals[0] = cssTransformScaleToCenter( width, availableWidth, SmartPhoneFrame.INITIAL_WIDTH )
            }
        }
        if( height ){
            scaleVals.push( height / SmartPhoneFrame.INITIAL_HEIGHT )

            if( availableHeight ){
                originVals[1] = cssTransformScaleToCenter( height, availableHeight, SmartPhoneFrame.INITIAL_HEIGHT )
            }
        }
        
        if( scaleVals.length > 0 ){
            if( useMin && scaleVals.length > 1 ) {
                //smaller width
                if(scaleVals[0] < scaleVals[1]) {
                    
                    if( availableHeight ){
                        //originVals[0] = '50%'
                        originVals[1] = cssTransformScaleToCenter( height * scaleVals[1], availableHeight, SmartPhoneFrame.INITIAL_HEIGHT )
                    }
                    scaleVals.splice(1,1)
                }
                //smaller height
                else if(scaleVals[0] > scaleVals[1]) {
                    
                    if( availableWidth ){
                        originVals[0] = cssTransformScaleToCenter( width * scaleVals[0], availableWidth, SmartPhoneFrame.INITIAL_WIDTH )
                        //originVals[1] = '50%'
                    }
                    scaleVals.splice(0,1)
                }
                //equal, do nothing
            }
            // console.log(scaleVals, originVals)
            transformProperties.transform = 'scale( '+scaleVals.join(',')+' )'
            transformProperties.transformOrigin = originVals.join(' ')
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