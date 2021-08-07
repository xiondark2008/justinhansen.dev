import UIEntity from "@/modules/starmap_db/types/entities/UIEntity"
import SpeciesDetails from "@/starmap_db/components/entities/species/SpeciesDetails"

export default class Species extends UIEntity {
    static label = "Species"
    static dataUrl = "/api/StarMapDB/species"
    static detailsView = SpeciesDetails

    constructor(data){
        super(data)
        try{
            this.sid = data.sid
            this.name = data.name
            this.code = data.code
        } catch(e){
            console.error("ERROR - in Species.constructor",e,
                "\n\targuements: ", data,"\n")
        }
    }

    //NOTE: Use from StarCitizenDataSource.getBootup response
    static parse(data){
        try{
            return {
                sid: data.id,
                name: data.name,
                code: data.code
            }
        } catch(e){
            console.error("ERROR - in Species.constructor",e,
                "\n\targuements: ", data,"\n")
        }
    }
}