import fs from 'fs'

//const path = process.cwd() + "\\node_modules\\bootstrap\\dist\\js\\bootstrap.bundle.js.map"

export default async function handler(req, res) { console.debug("in /api/resources/[package]/[file].js - query: ", req.query)
    let status = 500,
        message = "Encountered an unexpected error"
    try{
        const base = process.cwd() + process.env.NODE_MODULES_PATH, //"\\node_modules"
            jQuery = process.env.JQUERY_PATH,                       //"\\jquery\\dist\\"
            bootstrapJs = process.env.BOOTSTRAP_JS_PATH,            //"\\bootstrap\\dist\\js\\"
            bootstrapCss = process.env.BOOTSTRAP_CSS_PATH           //"\\bootstrap\\dist\\css\\"
        let path = base

        switch( req.query.package ){
            case 'jquery':
                path += jQuery + req.query.file; break;
            case 'bootstrap-js':
                path += bootstrapJs + req.query.file; break;
            case 'bootstrap-css':
                path += bootstrapCss + req.query.file; break;
            default:
                throw new Error("")
        }

        res.status(200)
            .setHeader('Content-Type', 'application/javascript')
            .send( fs.readFileSync( path ) )
    } catch(e){
        console.error("ERROR - in /api/resources/[package]/[file].js",e)
        res.status( status ).send( message )
    }
}