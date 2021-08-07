import UIEntity from "@/modules/starmap_db/types/entities/UIEntity"
import StarSystemDetails from "@/starmap_db/components/entities/star_system/StarSystemDetails"
import { originalOrParseFloat, propertyToLabel, ListEditor } from "@/utils/Utilities"

export default class StarSystem extends UIEntity {
    static label = "Star Systems"
    static dataUrl = "/api/StarMapDB/star-systems"
    static detailsView = StarSystemDetails

    constructor(data){ //console.debug("in StarSystem.constructor",data)
        super(data)
        try{
            this.ssid = data.ssid
            this.code = data.code
            this.name = data.name
            this.aid = data.aid
            this.affiliation_name = data.affiliation_name
            this.status = data.status
            this.type = data.type
            this.description = data.description
            this.size = data.size
            this.population = data.population
            this.economy = data.economy
            this.danger = data.danger
            this.children_coid = data.children_coid
            this.tid_departure_large = data.tid_departure_large
            this.tid_departure_medium = data.tid_departure_medium
            this.tid_departure_small = data.tid_departure_small
            this.tid_arrival_large = data.tid_arrival_large
            this.tid_arrival_medium = data.tid_arrival_medium
            this.tid_arrival_small = data.tid_arrival_small
            this.habitable_zone_inner = data.habitable_zone_inner
            this.habitable_zone_outer = data.habitable_zone_outer
            this.frost_line = data.frost_line
            this.position_x = data.position_x
            this.position_y = data.position_y
            this.position_z = data.position_z
            this.rsi_last_modified = data.rsi_last_modified
            this.thumbnail_info = data.thumbnail_info
            this.info_url = data.info_url
            this.last_updated = data.last_updated
        } catch(e){
            console.error("ERROR - in StarSystem.constructor",e,
                "\n\targuements: ", data,"\n")
        }
    }

    static get views(){
        return [
            this.getViewObj("Overview", ['name','affiliation','status','population','economy',
                'danger','celestial_objects']),
            this.getViewObj("Tunnels", ['name','arrival_tunnels','arrival_tunnels_large',
                'arrival_tunnels_medium','arrival_tunnels_small','departure_tunnels',
                'departure_tunnels_large','departure_tunnels_medium','departure_tunnels_small']),
            this.getViewObj("Metrics", ['name','type','size','habitable_zone_inner',
                'habitable_zone_outer','frost_line']),
            this.getViewObj("Meta", ['name','rsi_last_modified','last_updated'])
        ]
    }

    /* All Columns:
        ['ssid','name','affiliation','status','type','size','population','economy',
         'danger','celestial_objects','arrival_tunnels','arrival_tunnels_large',
         'arrival_tunnels_medium','arrival_tunnels_small','departure_tunnels',
         'departure_tunnels_large','departure_tunnels_medium','departure_tunnels_small',
         'habitable_zone_inner','habitable_zone_outer','frost_line','rsi_last_modified',
         'last_updated']
    */
    static getColumns(includeList = []){
        const baseIncludeList = [
                'ssid',                 //0
                'name',                 //1
                'type',                 //2
                'size',                 //3
                'population',           //4
                'economy',              //5
                'danger',               //6
                'habitable_zone_inner', //7
                'habitable_zone_outer', //8
                'frost_line',           //9
                'rsi_last_modified',    //10
                'last_updated'          //11
            ],
            columnsEditor = new ListEditor( super.getColumns( baseIncludeList ) )

        columnsEditor.insertAt(2, {
            title: propertyToLabel("affiliation"),
            name: "affiliation",
            data: "affiliation_name",
            render: (field, type, doc, meta)=>{
                if(type === 'display'){
                    return '<span className="affiliation" data-affiliation="'+field+'">'+field+'</span>'
                }
                return field
            }
        })
        columnsEditor.insertAt(2, {
            title: propertyToLabel("status"),
            name: "status",
            data: "status",
            render: (field, type, doc, meta)=>{
                switch(field){
                    case 'M': return "Classified";
                    case 'N': return "Incomplete";
                    case 'P':
                    default: return '-'
                }
            }
        })
        columnsEditor.insertAt(7, {
            title: propertyToLabel("Celestial Objects"),
            name: "celestial_objects",
            data: 'children_coid',
            render: (field, type, doc, meta)=>{
                return doc.children_coid.length
            }
        })
        columnsEditor.insertAt(7, {
            title: propertyToLabel("Arrival Tunnels"),
            name: "arrival_tunnels",
            data: null,
            render: (field, type, doc, meta)=>{
                return doc.tid_arrival_large.length
                    + doc.tid_arrival_medium.length
                    + doc.tid_arrival_small.length
            }
        })
        columnsEditor.insertAt(7, {
            title: propertyToLabel("Arrival, Large"),
            name: "arrival_tunnels_large",
            data: 'tid_arrival_large',
            render: (field, type, doc, meta)=>{
                return doc.tid_arrival_large.length
            }
        })
        columnsEditor.insertAt(7, {
            title: propertyToLabel("Arrival, Medium"),
            name: "arrival_tunnels_medium",
            data: 'tid_arrival_medium',
            render: (field, type, doc, meta)=>{
                return doc.tid_arrival_medium.length
            }
        })
        columnsEditor.insertAt(7, {
            title: propertyToLabel("Arrival, Small"),
            name: "arrival_tunnels_small",
            data: 'tid_arrival_small',
            render: (field, type, doc, meta)=>{
                return doc.tid_arrival_small.length
            }
        })
        columnsEditor.insertAt(7, {
            title: propertyToLabel("Departure Tunnels"),
            name: "departure_tunnels",
            data: null,
            render: (field, type, doc, meta)=>{
                return doc.tid_departure_large.length
                    + doc.tid_departure_medium.length
                    + doc.tid_departure_small.length
            }
        })
        columnsEditor.insertAt(7, {
            title: propertyToLabel("Departure, Large"),
            name: "departure_tunnels_large",
            data: 'tid_departure_large',
            render: (field, type, doc, meta)=>{
                return doc.tid_departure_large.length
            }
        })
        columnsEditor.insertAt(7, {
            title: propertyToLabel("Departure, Medium"),
            name: "departure_tunnels_medium",
            data: 'tid_departure_medium',
            render: (field, type, doc, meta)=>{
                return doc.tid_departure_medium.length
            }
        })
        columnsEditor.insertAt(7, {
            title: propertyToLabel("Departure, Small"),
            name: "departure_tunnels_small",
            data: 'tid_departure_small',
            render: (field, type, doc, meta)=>{
                return doc.tid_departure_small.length
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

    //NOTE: Use from StarCitizenDataSource.getStarSystemDetails response
    static parse(data){ //console.debug("in StarSystem.parse", data)
        try{
            if(data.affiliation.length > 1 ){
                console.warn("WARNING - Found StarSystem with multiple affiliations. code: ", data.code)
            }

            return {
                ssid: data.id,
                code: data.code,
                name: data.name,
                aid: data.affiliation[0] ? data.affiliation[0].id : null,
                affiliation_name: data.affiliation[0] ? data.affiliation[0].name : null,
                status: data.status, //Known Statuses: P=Normal, N=Probe Data Incomplete, M=UEE Military Classified
                type: (data.type ? data.type.replace(/_/g,' ') : ''),
                description: data.description,
                size: originalOrParseFloat(data.aggregated_size),
                population: originalOrParseFloat(data.aggregated_population),
                economy: originalOrParseFloat(data.aggregated_economy),
                danger: originalOrParseFloat(data.aggregated_danger),
                children_coid: [],
                tid_departure_large: [],
                tid_departure_medium: [],
                tid_departure_small: [],
                tid_arrival_large: [],
                tid_arrival_medium: [],
                tid_arrival_small: [],
                habitable_zone_inner: originalOrParseFloat( data.habitable_zone_inner ),
                habitable_zone_outer: originalOrParseFloat( data.habitable_zone_outer ),
                frost_line: originalOrParseFloat( data.frost_line ),
                position_x: originalOrParseFloat(data.position_x),
                position_y: originalOrParseFloat(data.position_y),
                position_z: originalOrParseFloat(data.position_z),
                rsi_last_modified: new Date(data.time_modified),
                thumbnail_info: data.thumbnail,
                info_url: data.info_url,
                last_updated: new Date()
            }
        } catch(e) {
            console.error("ERROR - in StarSystem.parse",e,
                "\n\targuements: ", data,
                "\n")
        }
    }
}