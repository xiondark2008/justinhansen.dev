import DBUpdater from "@/starmap_db/services/DBUpdater"

export default async function handler(req, res) { console.debug("in /api/StarMapDB/update/fixerrors.js - query: ", req.query)
    try{
        
        DBUpdater.fixMissingRecords()
        res.status(202)
            .json({ isUpdateRunning: true })
    } catch(e){
        console.error("ERROR - in /api/StarMapDB/update/fixerrors.js",e)
        res.status(500)
            .json({
                isUpdateRunning: false,
                message: "Encountered an unexpected server error."
            })
    }
}