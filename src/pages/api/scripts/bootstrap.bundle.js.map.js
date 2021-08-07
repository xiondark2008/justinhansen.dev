import fs from 'fs'

const path = process.cwd() + "\\node_modules\\bootstrap\\dist\\js\\bootstrap.bundle.js.map",
    js = fs.readFileSync( path )

export default async function handler(req, res) { console.debug("in /api/scripts/bootstrap.bundle.js.map.js - query: ", req.query)
    try{
        res.status(200)
            .setHeader('Content-Type', 'application/javascript')
            .send(js)
    } catch(e){
        console.error("ERROR - in /api/scripts/bootstrap.bundle.js.map.js",e)
        res.status(500)
    }
}