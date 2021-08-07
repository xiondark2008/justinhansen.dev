import UIEntity from "@/modules/starmap_db/types/entities/UIEntity"
import CelestialObjectDetails from "@/starmap_db/components/entities/celestial_object/CelestialObjectDetails"
import { originalOrParseInt, originalOrParseFloat, propertyToLabel, ListEditor } from "@/utils/Utilities"

export default class CelestialObject extends UIEntity {
    static label = "Celestial Objects"
    static dataUrl = "/api/StarMapDB/celestial-objects"
    static detailsView = CelestialObjectDetails

    constructor(data){
        super(data)
        try{
            this.ssid = data.ssid
            this.coid = data.coid
            this.code = data.code
            this.ss_name = data.ss_name
            this.name = data.name
            this.designation = data.designation
            this.type = data.type
            this.subtype = data.subtype
            this.description = data.description
            this.parent_coid = data.parent_coid
            this.parent_name = data.parent_name
            this.children_coid = data.children_coid
            this.sensor_population = data.sensor_population
            this.sensor_economy = data.sensor_economy
            this.sensor_danger = data.sensor_danger
            this.habitable = data.habitable
            this.population = data.population
            this.aid = data.aid
            this.affiliation_name = data.affiliation_name
            this.fair_chance_act = data.fair_chance_act
            this.size = data.size
            this.distance = data.distance
            this.latitude = data.latitude
            this.longitude = data.longitude
            this.axial_tilt = data.axial_tilt
            this.orbit_period = data.orbit_period
            this.age = data.age
            this.texture_data = data.texture_data
            this.shader_data = data.shader_data
            this.thumbnail_info = data.thumbnail_info
            this.rsi_last_modified = data.rsi_last_modified
            this.info_url = data.info_url
            this.last_updated = data.last_updated
        } catch(e){
            console.error("ERROR - in CelestialObject.constructor",e,
                "\n\targuements: ", data,"\n")
        }
    }

    get designation_name(){ //console.debug("DEBUG - in CelestialObject.designation_name")
        return CelestialObject.formatDesignationName(this.name, this.designation)
    }

    static getDesignationNameFromDoc(doc){ //console.debug("DEBUG - in CelestialObject.getDesignationNameFromDoc")
        return this.formatDesignationName(doc.name, doc.designation)
    }
    static formatDesignationName(name, designation){ //console.debug("DEBUG - in CelestialObject.formatDesignationName")
        return ( name ?
            name+' ('+designation+')'
            : designation )
    }

    static get views(){
        return [
            this.getViewObj("Overview", ['ss_name', 'name', 'type', 'sensor_population',
                'sensor_economy', 'sensor_danger']),
            this.getViewObj("Affiliation", ['name', 'affiliation', 'fair_chance_act', 'habitable',
                'species']),
            this.getViewObj("Stats", ['name', 'parent_name', 'age', 'size', 'children_coid',
                'distance', 'axial_tilt', 'orbit_period']),
            this.getViewObj("Meta", ['name', 'rsi_last_modified', 'last_updated'])
        ]
    }

    /* All Columns:
        ['coid', 'ss_name', 'name', 'type', 'subtype', 'affiliation', 'fair_chance_act',
         'sensor_population', 'sensor_economy', 'sensor_danger', 'habitable', 'species',
         'parent_name', 'age', 'size', 'children_coid', 'distance', 'axial_tilt', 'orbit_period',
         'rsi_last_modified', 'last_updated']
    */
    static getColumns(includeList = []){
        const baseIncludeList = [
                'coid',             //0
                // 'ss_name',
                // 'name',
                'type',             //1
                'subtype',          //2
                // 'affiliation',
                // 'fair_chance_act',
                'sensor_population',//3
                'sensor_economy',   //4
                'sensor_danger',    //5
                'habitable',        //6
                // 'species',
                // 'parent_name',
                'age',              //7
                'size',             //8
                // 'children_coid',
                'distance',         //9
                'axial_tilt',       //10
                'orbit_period',     //11
                'rsi_last_modified',//12
                'last_updated'      //13
            ],
            columnsEditor = new ListEditor( super.getColumns( baseIncludeList ) )

        columnsEditor.insertAt(1, {
            title: propertyToLabel("star system"),
            name: "ss_name",
            data: "ss_name"
        })
        columnsEditor.insertAt(1, {
            title: propertyToLabel("Name"),
            name: "name",
            data: "name",
            render: (field, type, doc, meta)=>{
                return ( field ?
                    field+' ('+doc.designation+')'
                    : doc.designation )
            }
        })
        columnsEditor.insertAt(3, {
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
        columnsEditor.insertAt(3, {
            title: propertyToLabel("fair_chance_act"),
            name: "fair_chance_act",
            data: "fair_chance_act",
            render: (field, type, doc, meta)=>{
                return field=='1' ? 'Protected' : '-'
            }
        })
        columnsEditor.insertAt(7, {
            title: propertyToLabel("species"),
            name: "species",
            data: "population",
            render: (field, type, doc, meta)=>{
                return field.length
            }
        })
        columnsEditor.insertAt(7, {
            title: propertyToLabel("Orbits"),
            name: "parent_name",
            data: "parent_name"
        })
        columnsEditor.insertAt(9, {
            title: propertyToLabel("satellites"),
            name: "children_coid",
            data: "children_coid",
            render: (field, type, doc, meta)=>{
                return field.length
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

    //NOTE: Use from StarCitizenDataSource.getCelestialObjectDetails response
    static parse(data, ssStub={}, parentCOName, debugChain){
        try{
            // if(parentCOName === null && data.parent_id !== null){
            //     console.warn("WARN - Missing parent CO name. Found parent_coid but not parent name. Parent Chain: ",debugChain)
            // }
            return {
                ssid: ssStub.ssid,
                coid: data.id,
                code: data.code,
                ss_name: ssStub.name,
                name: data.name,
                designation: data.designation,
                type: data.type ? data.type.replace(/_/g,' ') : '',
                subtype: (data.subtype ? data.subtype.name : null),
                description: data.description,
                parent_coid: data.parent_id,
                parent_name: parentCOName,
                children_coid: [],
                sensor_population: originalOrParseInt(data.sensor_population),
                sensor_economy: originalOrParseInt(data.sensor_economy),
                sensor_danger: originalOrParseInt(data.sensor_danger),
                habitable: !!data.habitable,
                population: data.population,
                aid: (data.affiliation[0] ? data.affiliation[0].id : null),
                affiliation_name: (data.affiliation[0] ? data.affiliation[0].name : null),
                fair_chance_act: !!parseInt(data.fairchanceact),
                size: originalOrParseFloat(data.size),
                distance: originalOrParseFloat(data.distance),
                latitude: originalOrParseFloat(data.latitude),
                longitude: originalOrParseFloat(data.longitude),
                axial_tilt: originalOrParseFloat(data.axial_tilt),
                orbit_period: originalOrParseFloat(data.orbit_period),
                age: (data.age ? originalOrParseFloat(data.age) : null),
                texture_data: data.texture,
                shader_data: data.shader_data,
                thumbnail_info: data.thumbnail,
                rsi_last_modified: new Date(data.time_modified),
                info_url: data.info_url,
                last_updated: new Date()
            }
        } catch(e) {
            console.error("ERROR - in CelestialObject.parse",e,
                "\n\targuements: ", data, ssStub, parentCOName, debugChain,
                "\n")
        }
    }
}