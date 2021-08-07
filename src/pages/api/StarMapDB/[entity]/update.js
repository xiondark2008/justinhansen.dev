import DBUpdater from "@/starmap_db/services/DBUpdater"

import { ENTITY_PATHS } from "@/starmap_db/utils/Utilities"

export default async function handler(req, res) { console.debug("in /api/StarMapDB/[entity]/update.js - query: ", req.query)
    let isUpdateRunning = false,
        statusCode = 500,
        message = "Encountered an unexpected server error."
    try{
        const entityName = req.query.entity
        let startStage,
            stopStage,
            skipStages,
            codes = req.query.codes ? req.query.codes.split(',') : null
        
        switch(entityName){
            case ENTITY_PATHS.celestialObject:
                if( !codes ) {
                    statusCode = 400
                    message = "You must specify the Celestial Object codes you wish to update in a comma seperated list under the parameter 'codes'."
                    throw new Error("Missing CO code/s.")
                }
                isUpdateRunning = DBUpdater.updateCelestialObjects(codes)
                break;
            case ENTITY_PATHS.starSystem:
                if( !codes ) {
                    statusCode = 400
                    message = "You must specify the Star System codes you wish to update in a comma seperated list under the parameter 'codes'."
                    throw new Error("Missing SS code/s.")
                }
                startStage = 2
                stopStage = undefined
                skipStages = undefined
                break;
            case ENTITY_PATHS.tunnel:
            case ENTITY_PATHS.affiliation:
                startStage = 1
                stopStage = undefined
                skipStages = [2]
                codes = undefined
                break;
            case ENTITY_PATHS.species:
                startStage = 1
                stopStage = 1
                skipStages = undefined
                codes = undefined
                break;
            default:
                message = "No such entity ["+entityName+"] exists."
                throw new Error( message )
        }

        if( startStage || stopStage || skipStages ){
            isUpdateRunning = DBUpdater.update(startStage, stopStage, skipStages, codes)
        }
        
        res.status(202)
            .json( {
                isUpdateRunning: isUpdateRunning
            } )
    } catch(e){
        console.error("ERROR - in /api/StarMapDB/[entity]/update.js",e)
        res.status( status )
            .json({
                isUpdateRunning: isUpdateRunning,
                message: message
            })
    }
}