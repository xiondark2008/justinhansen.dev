import { cleanAttributesObject } from "@/common/utils/Utilities";
import { Component } from "react";

//TODO: document props
export default class SetRecordLink extends Component{
    constructor(props){
        super(props)

        this.anchorAttr = cleanAttributesObject(this.props.anchorAttr)

        this.changeRecord = this.changeRecord.bind(this)
    }

    changeRecord(event){
        const dataUrl = this.props.dataUrl

        event.preventDefault()

        if( this.anchorAttr.onClick instanceof Function){
            this.anchorAttr.onClick(event)
        }

        fetch( dataUrl )
            .then( response => response.json() )
            .then( json => {
                if( json.data && json.data.length > 0){
                    const data = json.data[0]

                    this.props.setRecord(data, this.props.entity)
                }
            })
    }

    render(){
        const anchorAttr = Object.assign({}, this.anchorAttr)
        delete anchorAttr.onClick

        return(<>
        <a onClick={ this.changeRecord } {...anchorAttr}>{ this.props.children }</a>
        </>)
    }
}