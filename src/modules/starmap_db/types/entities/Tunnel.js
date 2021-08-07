import UIEntity from "@/modules/starmap_db/types/entities/UIEntity"
import { propertyToLabel, ListEditor } from "@/utils/Utilities"
import TunnelDetails from "@/starmap_db/components/entities/tunnel/TunnelDetails"

export default class Tunnel extends UIEntity {
    static label = "Tunnels"
    static dataUrl = "/api/StarMapDB/tunnels"
    static detailsView = TunnelDetails

    constructor(data){
        super(data)
        try{
            this.tid = data.tid
            this.name = data.name
            this.size = data.size
            this.entry_coid = data.entry_coid
            this.entry_ssid = data.entry_ssid
            this.entry_ss_name = data.entry_ss_name
            this.entry_ss_affiliation_name = data.entry_ss_affiliation_name
            this.exit_coid = data.exit_coid
            this.exit_ssid = data.exit_ssid
            this.exit_ss_name = data.exit_ss_name
            this.exit_ss_affiliation_name = data.exit_ss_affiliation_name
        } catch(e){
            console.error("ERROR - in Tunnel.constructor",e,
                "\n\targuements: ", data,"\n")
        }
    }

    static get views(){
        return [
            this.getViewObj("Overview", ['size', 'entry_ss_name', 'entry_ss_affiliation_name',
                'exit_ss_name', 'exit_ss_affiliation_name'])
        ]
    }

    /* All Columns:
        ['tid', 'size', 'entry_ss_name', 'entry_ss_affiliation_name', 'exit_ss_name',
         'exit_ss_affiliation_name']
    */
    static getColumns(includeList = []){
        const baseIncludeList = [
                'tid',  //0
                'size', //1
                // 'entry_ss_name',
                // 'entry_ss_affiliation_name',
                // 'exit_ss_name',
                // 'exit_ss_affiliation_name'
            ],
            columnsEditor = new ListEditor( super.getColumns( baseIncludeList ) )

        columnsEditor.insertAt(1, {
            title: propertyToLabel("origin star system"),
            name: "entry_ss_name",
            data: "entry_ss_name"
        })
        columnsEditor.insertAt(1, {
            title: propertyToLabel("Origin affiliation"),
            name: "entry_ss_affiliation_name",
            data: "entry_ss_affiliation_name",
            render: (field, type, doc, meta)=>{
                if(type === 'display'){
                    return '<span className="affiliation" data-affiliation="'+field+'">'+field+'</span>'
                }
                return field
            }
        })
        columnsEditor.insertAt(1, {
            title: propertyToLabel("Destination star system"),
            name: "exit_ss_name",
            data: "exit_ss_name"
        })
        columnsEditor.insertAt(1, {
            title: propertyToLabel("Destination affiliation"),
            name: "exit_ss_affiliation_name",
            data: "exit_ss_affiliation_name",
            render: (field, type, doc, meta)=>{
                if(type === 'display'){
                    return '<span className="affiliation" data-affiliation="'+field+'">'+field+'</span>'
                }
                return field
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
    static parse(data, entrySSStub, exitSSStub){
        try{
            const records = [],
                builder = (data, isReverse) => {
                    return {
                        tid: !isReverse ? data.id : data.id+'R',
                        name: data.name,
                        size: data.size,
                        entry_coid: !isReverse ? data.entry.id : data.exit.id,
                        entry_ssid: !isReverse ? data.entry.star_system_id : data.exit.star_system_id,
                        entry_ss_name: !isReverse ? entrySSStub.name : exitSSStub.name,
                        entry_ss_affiliation_name: !isReverse ? entrySSStub.affiliation_name : exitSSStub.affiliation_name,
                        exit_coid: !isReverse ? data.exit.id : data.entry.id,
                        exit_ssid: !isReverse ? data.exit.star_system_id : data.entry.star_system_id,
                        exit_ss_name: !isReverse ? exitSSStub.name : entrySSStub.name,
                        exit_ss_affiliation_name: !isReverse ? exitSSStub.affiliation_name : entrySSStub.affiliation_name
                    }
                },
                oneway = builder(data, false)
            
            records.push( oneway )

            if( data.direction == 'B' ){
                const otherway = builder(data, true)
                records.push( otherway )
            } else {
                console.warn("WARNING - Found a tunnel with unhandled direction. value: ", data.direction)
            }
            
            return records
        } catch(e){
            console.error("ERROR - in Tunnel.constructor",e,
                "\n\targuements: ", data,"\n")
        }
    }
}