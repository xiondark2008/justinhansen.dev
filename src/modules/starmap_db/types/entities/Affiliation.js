import UIEntity from "@/modules/starmap_db/types/entities/UIEntity"
import { propertyToLabel, ListEditor } from "@/utils/Utilities"
import AffiliationDetails from "@/starmap_db/components/entities/affiliation/AffiliationDetails"

export default class Affiliation extends UIEntity {
    static label = "Affiliations"
    static dataUrl = "/api/StarMapDB/affiliations"
    static detailsView = AffiliationDetails

    constructor(data){
        super(data)
        try{
            this.aid = data.aid
            this.code = data.code
            this.name = data.name
            this.ssids = data.ssids
            this.coids = data.coids
            this.color = data.color
        } catch(e){
            console.error("ERROR - in Affiliation.constructor",e,
                "\n\targuements: ", data,"\n")
        }
    }

    static get views(){
        return [
            this.getViewObj("Overview", ['name', 'ssids', 'coids'])
        ]
    }

    /* All Columns:
        ['aid', 'name', 'ssids', 'celestial_object_count']
    */
    static getColumns(includeList = []){
        const baseIncludeList = [
                'aid',  //0
                'name'  //1
                // 'star_system_count', 
                // 'celestial_object_count'
            ],
            columnsEditor = new ListEditor( super.getColumns( baseIncludeList ) )

        columnsEditor.insertAt(2, {
            title: propertyToLabel("star systems"),
            name: "ssids",
            data: "ssids",
            render: (field, type, doc, meta) => {
                return field ? field.length : 0
            }
        })
        columnsEditor.insertAt(2, {
            title: propertyToLabel("celestial objects"),
            name: "coids",
            data: "coids",
            render: (field, type, doc, meta) => {
                return field ? field.length : 0
            }
        })
        
        return columnsEditor.list.map( col => {
            if( includeList.length == 0 || includeList.includes(col.name) ){
                col.visible = true
            } else {
                col.visible = false
            }

            return col
        })
    }

    //NOTE: Use from StarCitizenDataSource.getBootup response
    static parse(data){
        try{
            return {
                aid: data.id,
                name: data.name,
                code: data.code,
                ssids: [],
                coids: [],
                color: data.color
            }
        } catch(e){
            console.error("ERROR - in Affiliation.constructor",e,
                "\n\targuements: ", data,"\n")
        }
    }
}