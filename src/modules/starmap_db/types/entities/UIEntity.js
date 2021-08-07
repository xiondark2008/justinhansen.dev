import { propertyToLabel } from "@/utils/Utilities"

export default class UIEntity {
    static getUIEntityListEntry(){
        return {
            label: this.label,
            dataUrl: this.dataUrl,
            views: this.views,
            detailsView: this.detailsView
        }
    }

    static getPropertiesList(includeList=[]){
        return Object.keys( new this({}) )
            .filter( prop => {
                return !(this[prop] instanceof Function)
                    && ( includeList.length == 0 || includeList.includes(prop) )
            } )
    }

    static getColumns(includeList = []){
        const columns = this.getPropertiesList(includeList)
            .map( prop => {
                return {
                    title: propertyToLabel(prop),
                    name: prop,
                    data: prop
                }
            })
        
        return columns.map( col => {
            if( includeList.length == 0 || includeList.includes(col.name) ){
                col.visible = true
            } else {
                col.visible = false
            }

            return col
        })
    }

    static getViewObj(name, includeColumns=[]){
        return {
            name: name,
            columns: this.getColumns( includeColumns )
        }
    }

    static get views(){
        return [
            this.getViewObj( "Overview" )
        ]
    }
}