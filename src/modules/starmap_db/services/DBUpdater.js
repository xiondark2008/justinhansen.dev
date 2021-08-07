import StarSystem from "@/starmap_db/types/entities/StarSystem";
import CelestialObject from "@/starmap_db/types/entities/CelestialObject";
import Tunnel from "@/starmap_db/types/entities/Tunnel";
import Affiliation from "@/starmap_db/types/entities/Affiliation";
import Species from "@/starmap_db/types/entities/Species";
import UpdateError from "@/starmap_db/types/entities/UpdateError";

import StarSystemCollection from "@/modules/starmap_db/types/services/StarSystemCollection";
import CelestialObjectCollection from "@/modules/starmap_db/types/services/CelestialObjectCollection";
import TunnelCollection from "@/modules/starmap_db/types/services/TunnelCollection";
import AffiliationCollection from "@/modules/starmap_db/types/services/AffiliationCollection";
import SpeciesCollection from "@/modules/starmap_db/types/services/SpeciesCollection";
import UpdateErrorsCollection from "@/modules/starmap_db/types/services/UpdateErrorsCollection";

import DBManager from "@/starmap_db/services/DBManager";
import StarCitizenDataSource from "@/starmap_db/services/StarCitizenDataSource";


import { hasElapsedSince } from "@/utils/Utilities.js";

export default class DBUpdater {
    static #_LAST_DB_UPDATE = new Date( ( now => now.setDate(now.getDate() - 1) )( new Date() ) );
    static #_IS_UPDATE_RUNNING = false
    static UPDATE_INTERVAL = 86400000 //1 day

    static get lastDBUpdate(){ //console.debug("in DBUpdater.lastDBUpdate")
        /**/
        return this.#_LAST_DB_UPDATE
        /*/
        //TODO: check db table for value
        //*/
    }
    static set lastDBUpdate(val){ //console.debug("in DBUpdater.lastDBUpdate")
        /**/
        this.#_LAST_DB_UPDATE = val
        /*/
        //TODO: update db table for value
        //*/
    }

    static update(startStage, stopStage, skipStages, ssCodes){ //console.debug("in DBUpdater.update")
        if( this.#_IS_UPDATE_RUNNING ){
            return true
        } else if( hasElapsedSince( this.UPDATE_INTERVAL, this.lastDBUpdate ) ){

            StarCitizenDataSource.clearCache()
            this.#_runUpdates(startStage, stopStage, skipStages, ssCodes)
            
            return true
        }

        return false
    }
    static updateCelestialObjects(coCodes){ //console.debug("in DBUpdater.updateCelestialObjects")
        if( this.#_IS_UPDATE_RUNNING ){
            return true
        } else if( hasElapsedSince( this.UPDATE_INTERVAL, this.lastDBUpdate ) ){

            StarCitizenDataSource.clearCache()
            ( async ()=>{
                this.#_IS_UPDATE_RUNNING = true
                try{
                    const promiseGroup = [],
                        startStage = 3
                    
                    for(let coCode of coCodes){
                        promiseGroup.push(
                            this.#_updateCOFromDetails(coCode)
                        )
                    }
                    await Promise.all( promiseGroup )
                    await this.#_runUpdates(startStage)
                }catch(err){
                    console.error("ERROR - in DBUpdater.updateCelestialObjects",e)
                } finally {
                    this.#_IS_UPDATE_RUNNING = false
                }
            } )()
            
            return true
        }

        return false
    }

    static async fixMissingRecords( db=DBManager.getDB() ){ console.debug("in DBUpdater.#_fixMissingRecords")
        db = await db
        try{
            const coPromiseGroup = [],
                requiredStages = new Set()
            let spcErrorDocs = UpdateErrorsCollection.findAll({
                    sid: {$ne: null}
                }, undefined, db),
                coErrorDocs = UpdateErrorsCollection.findAll({
                    coCode: {$ne: null}
                }, undefined, db),
                affErrorDocs = UpdateErrorsCollection.findAll({
                    aid: {$ne: null}
                }, undefined, db),
                tnlErrorDocs = UpdateErrorsCollection.findAll({
                    tid: {$ne: null}
                }, undefined, db),
                ssErrorDocs = UpdateErrorsCollection.findAll({
                    ssCode: {$ne: null}
                }, { projection: {ssCode: 1} }, db),
                ssCodeList = []
                
            StarCitizenDataSource.clearCache()
            
            spcErrorDocs = await spcErrorDocs
            if(spcErrorDocs.length > 0){ console.info("Will fix Species")
                requiredStages.add(1)
            }

            coErrorDocs = await coErrorDocs
            if(coErrorDocs.length > 0){ console.info("Will fix Celestial Objects")
                requiredStages.add(3)
                for(let coErrorDoc of coErrorDocs){
                    console.debug("Will fix Celestial Object: "+coErrorDoc.coCode)
                    coPromiseGroup.push(
                        this.#_updateCOFromDetails(coErrorDoc.coCode, coErrorDoc.otherArgs.ssStub,
                            coErrorDoc.otherArgs.parentCOName, undefined, db)
                    )
                }
            }

            affErrorDocs = await affErrorDocs
            if(affErrorDocs.length > 0){ console.info("Will fix Affiliations")
                requiredStages.add(1)
                requiredStages.add(3)
            }

            tnlErrorDocs = await tnlErrorDocs
            if(tnlErrorDocs.length > 0){ console.info("Will fix Tunnels")
                requiredStages.add(1)
                requiredStages.add(3)
            }

            ssErrorDocs = await ssErrorDocs
            if(ssErrorDocs.length > 0){ console.info("Will fix Star Systems")
                requiredStages.add(2)
                requiredStages.add(3)

                ssCodeList = ssErrorDocs.map( doc => {
                    console.debug("Will fix Star System: "+doc.ssCode)
                    return doc.ssCode
                } )
            }

            await Promise.all( coPromiseGroup )
            console.info("Finished fixing Celestial Objects")
            if(requiredStages.size > 0){ console.info("Preparing to trigger limited update run...")
                const list = Array.from( requiredStages ).sort(),
                    startStage = list[0],
                    stopStage = list[list.length - 1],
                    calcSkipStages = (b, e, l) => {
                        const rtn = []

                        for(let c=b; c<=e; c++){
                            if(l.indexOf(c) < 0){
                                rtn.push(c)
                            }
                        }

                        return rtn
                    },
                    skipStages = calcSkipStages(startStage, stopStage, list)
                
                console.group("Triggering limited update run.")
                    console.debug("startStage: ",startStage)
                    console.debug("stopStage: ",stopStage)
                    console.debug("skipStages: ",skipStages)
                    console.debug("ssCodeList: ",ssCodeList)
                console.groupEnd()
                await this.#_runUpdates(startStage, stopStage, skipStages, ssCodeList, db)
            }
            console.group("Finished fixing as many errors as possible.")
                const errorCount = await UpdateErrorsCollection.countDocuments()
                console.info("Remaining errors: ",errorCount)
            console.groupEnd()
        } catch(e) {
            console.error("ERROR - in DBUpdater.fixMissingRecords",e,"\n")
        }
    }

    static #_runUpdates = async ( startStage=1, stopStage=0, skipStages=[], ssCodes=[], db=DBManager.getDB() ) => { //console.debug("in DBUpdater.#_runUpdates. arguments: ",startStage,stopStage,skipStages,ssCodes)
        db = await db
        if( !this.#_IS_UPDATE_RUNNING ){
            this.#_IS_UPDATE_RUNNING = true
            try{
                let currentStage

                console.info("Starting StarMapDB update.")
                switch(startStage){
                    default:
                        console.warn("WARNING - in DBUpdater.#_runUpdates. Found invalid stage: "+stage)
                        break;
                    case 1:
                        currentStage = 1
                        if(skipStages.indexOf(currentStage) < 0){
                            const allSSCodes = await this.#_updateFromBootup( db )

                            ssCodes = ssCodes.length < 1 ? allSSCodes : ssCodes
                            console.debug("Got species", await SpeciesCollection.countDocuments(undefined, undefined, db) );
                            console.debug("Got affiliations", await AffiliationCollection.countDocuments(undefined, undefined, db) );
                            console.debug("Got tunnels", await TunnelCollection.countDocuments(undefined, undefined, db) );
                        }
                        if(stopStage == currentStage){ break; }
                    case 2:
                        currentStage = 2
                        if(skipStages.indexOf(currentStage) < 0){
                            await this.#_updateFromDetails( ssCodes, db )
                            console.debug("Got star systems", await StarSystemCollection.countDocuments(undefined, undefined, db) );
                            console.debug("Got celestial objects", await CelestialObjectCollection.countDocuments(undefined, undefined, db) );
                        }
                        if(stopStage == currentStage){ break; }
                    case 3:
                        currentStage = 3
                        if(skipStages.indexOf(currentStage) < 0){
                            await this.#_updateAllCalcFields( db )
                        }
                        if(stopStage == currentStage){ break; }
                    case 0:
                }

                this.lastDBUpdate = new Date()
                console.info("Finished StarMapDB update")
            } catch(e) {
                console.error("ERROR - in DBUpdater.#_runUpdates",e,"\n")
            } finally {
                this.#_IS_UPDATE_RUNNING = false
            }
        }
    }

    //Populate Species, Affiliations, & Tunnels, and get Star System code list
    static #_updateFromBootup = async ( db=DBManager.getDB() ) => { //console.debug("in DBUpdater.#_updateFromBootup")
        db = await db
        const promiseGroup = []
        try{
            const { data } = await StarCitizenDataSource.getBootup(),
                starSystemsRS = data.systems.resultset,
                ssCodeList = []
            
            //Species
            console.info("Parsing Species")
            for( let spc of data.species.resultset ){
                promiseGroup.push(
                    this.#_updateSpcFromBootup(spc, db)
                )
            }
            
            //Affiliations
            console.info("Parsing Affiliations")
            for( let aff of data.affiliations.resultset ){
                promiseGroup.push(
                    this.#_updateAffFromBootup(aff, db)
                )
            }

            //Tunnels
            console.info("Parsing Tunnels")
            for( let tnl of data.tunnels.resultset ){
                promiseGroup.push(
                    this.#_updateTnlFromBootup(tnl, starSystemsRS, db)
                )
            }

            //Star Systems code list
            for( let ss of starSystemsRS ){
                ssCodeList.push( ss.code )
            }

            return ssCodeList
        } catch(e) {
            console.error("ERROR - in DBUpdater.#_updateFromBootup",e,"\n")
            return []
        } finally {
            await Promise.all( promiseGroup )
        }
    }
    static #_updateSpcFromBootup = async ( raw, db=DBManager.getDB() ) => { //console.debug("in DBUpdater.#_updateSpcFromBootup")
        db = await db
        try{
            const doc = Species.parse( raw ),
                query = { sid: doc.sid },
                update = { $set: doc }
            
            await SpeciesCollection.updateOne( query, update, { upsert: true }, db )
            UpdateErrorsCollection.deleteMany({sid: raw.id}, undefined, db)
        } catch(e) {
            const query = {sid: raw.id},
                error = new UpdateError({
                    sid: raw.id,
                    errorMessage: e.message
                }),
                update = {$set: error}

            console.group("ERROR - in DBUpdater.#_updateSpcFromBootup")
                console.error( e )
            console.groupEnd()

            UpdateErrorsCollection.updateOne(query, update, {upsert:true}, db)
        }
    }
    static #_updateAffFromBootup = async ( raw, db=DBManager.getDB() ) => { //console.debug("in DBUpdater.#_updateAffFromBootup")
        db = await db
        try{
            const doc = Affiliation.parse( raw ),
                query = { aid: doc.aid },
                update = { $set: doc }
            
            await AffiliationCollection.updateOne( query, update, { upsert: true }, db )
            UpdateErrorsCollection.deleteMany({aid: raw.id}, undefined, db)
        } catch(e) {
            const query = {aid: raw.id},
                error = new UpdateError({
                    aid: raw.id,
                    errorMessage: e.message
                }),
                update = {$set: error}
            
            console.group("ERROR - in DBUpdater.#_updateAffFromBootup")
                console.error( e )
            console.groupEnd()

            UpdateErrorsCollection.updateOne(query, update, {upsert:true}, db)
        }
    }
    static #_updateTnlFromBootup = async ( raw, starSystemsRS, db=DBManager.getDB() ) => { //console.debug("in DBUpdater.#_updateTnlFromBootup")
        db = await db
        const promiseGroup = []
        try{
            const ssStubs = starSystemsRS.map( ss => {
                    return {
                        ssid: ss.id,
                        name: ss.name,
                        affiliation_name: ss.affiliation[0].name
                    }
                }),
                entrySSStub = ssStubs.find( ssStub => ssStub.ssid === raw.entry.star_system_id),
                exitSSStub = ssStubs.find( ssStub => ssStub.ssid === raw.exit.star_system_id),
                docArray = Tunnel.parse( raw, entrySSStub, exitSSStub )

            for(let doc of docArray){
                const query = { tid: doc.tid },
                    update = { $set: doc }
                
                promiseGroup.push(
                    TunnelCollection.updateOne( query, update, { upsert: true }, db )
                )
            }
            UpdateErrorsCollection.deleteMany({tid: raw.id}, undefined, db)
        } catch(e) {
            const query = {tid: raw.id},
                error = new UpdateError({
                    tid: raw.id,
                    errorMessage: e.message
                }),
                update = {$set: error}

            console.error("ERROR - in DBUpdater.#_updateTnlFromBootup", e, "\n")
            UpdateErrorsCollection.updateOne(query, update, {upsert:true}, db)
        } finally {
            await Promise.all( promiseGroup )
        }
    }

    //Populate Star Systems and Celestial Objects
    static #_updateFromDetails = async ( ssCodeList, db=DBManager.getDB() ) => { //console.debug("in DBUpdater.#_updateFromDetails. args: ",ssCodeList)
        db = await db
        const ssPromiseGroup = []
        try {
            //Star Systems
            console.info("Parsing Star Systems & Celestial Objects")
            for( let ssCode of ssCodeList ){
                ssPromiseGroup.push( (async () => {
                    const coPromiseGroup = []
                    try{
                        const ss = await this.#_updateSSFromDetails(ssCode, db)

                        //Celestial Objects
                        for( let coStub of (ss && ss.raw) ? ss.raw.celestial_objects : [] ){
                            try {
                                //if(coStub.parent_id == null){
                                    coPromiseGroup.push( this.#_updateCOFromDetails( coStub.code, {
                                        ssid: ss.doc.ssid,
                                        name: ss.doc.name
                                    }, undefined, undefined, db ) )
                                //}
                            } catch(e) {
                                console.group("ERROR - in DBUpdater.#_updateFromDetails, Celestial Objects")
                                    console.info("on coCode: ", coStub.code)
                                    console.error( e )
                                    console.debug("coStub: ", coStub)
                                console.groupEnd()
                            }
                        }
                    } catch(e) {
                        console.group("ERROR - in DBUpdater.#_updateFromDetails Star Systems promise")
                            console.info("on ssCode: ", ssCode)
                            console.error( e )
                        console.groupEnd()
                    } finally {
                        await Promise.all(coPromiseGroup)
                        console.info("Finished updating Star System: "+ssCode)
                    }
                })() )
            }
        } catch(e) {
            console.error("ERROR - in DBUpdater.#_updateFromDetails", e, "\n")
        } finally {
            await Promise.all( ssPromiseGroup )
        }
    }
    static #_updateSSFromDetails = async ( ssCode, db=DBManager.getDB() ) => { //console.debug("in DBUpdater.#_updateSSFromDetails. args: ",ssCode)
        db = await db
        try{
            const { data } = await StarCitizenDataSource.getStarSystemDetails( ssCode ),
                raw = data.resultset[0],
                doc = StarSystem.parse( raw ),
                query = { ssid: doc.ssid },
                update = { $set: doc }
        
            await StarSystemCollection.updateOne( query, update, { upsert: true }, db )
            UpdateErrorsCollection.deleteMany({ssCode: ssCode}, undefined, db)

            return {raw: raw, doc: doc}
        } catch(e) {
            const query = {ssCode: ssCode},
                error = new UpdateError({
                    ssCode: ssCode,
                    errorMessage: e.message
                }),
                update = {$set: error}

            console.group("ERROR - in DBUpdater.#_updateSSFromDetails")
                console.info("on ssCode: ", ssCode)
                console.error( e )
            console.groupEnd()
            
            UpdateErrorsCollection.updateOne(query, update, {upsert:true}, db)
        }
    }
    static runCoCodeList = []
    static #_updateCOFromDetails = async ( coCode, ssStub={}, parentCOName = null, debugChain=[], db=DBManager.getDB() ) => { //console.debug("in DBUpdater.#_updateCOFromDetails")
        db = await db
        const promiseGroup = []
        try{
            const { data } = await StarCitizenDataSource.getCelestialObjectDetails( coCode ),
                doc = CelestialObject.parse( data.resultset[0], ssStub, parentCOName, debugChain ),
                name = CelestialObject.getDesignationNameFromDoc( doc ),
                query = { coid: doc.coid },
                update = { $set: doc }
            
            //For targeted CO update, don't overwrite these values
            if( Object.keys(ssStub).length < 1 ){
                delete update.$set.ssid
                delete update.$set.star_system_id
                delete update.$set.parentCOName
            }

            
            if( !name ){
                console.warn("WARN - Missing name: ", name)
            }
            debugChain.push(name)
            promiseGroup.push(
                CelestialObjectCollection.updateOne( query, update, { upsert: true }, db )
            )
            UpdateErrorsCollection.deleteMany({coCode: coCode}, undefined, db)

            for( let coStub of data.resultset[0].children ){
                promiseGroup.push(
                    this.#_updateCOFromDetails( coStub.code, ssStub, name, debugChain, db )
                )
            }
        } catch(e) {
            const query = {coCode: coCode},
                error = new UpdateError({
                    coCode: coCode,
                    errorMessage: e.message,
                    otherArgs: {
                        ssStub: ssStub,
                        parentCOName: parentCOName
                    }
                }),
                update = {$set: error}

            console.group("ERROR - in DBUpdater.#_updateCOFromDetails")
                console.debug("coCode: ", coCode)
                console.debug("ssStub: ", ssStub)
                console.debug("parentCOName: ", parentCOName)
                console.error( e )
            console.groupEnd()
            
            UpdateErrorsCollection.updateOne(query, update, {upsert:true}, db)
        } finally {
            await Promise.all( promiseGroup )
        }
    }

    //Update calculated fields
    static #_updateAllCalcFields = async ( db=DBManager.getDB() ) => { //console.debug("in DBUpdater.#_updateCalculatedFields")
        db = await db
        const promiseGroup = []
        try{
            //Affiliations
            console.info("Updating Affiliations Calculated Fields")
            for( let aff of await AffiliationCollection.findAll(undefined, undefined, db) ){
                promiseGroup.push(
                    this.#_updateAffCalcFields(aff, db)
                )
            }

            //Star Systems
            console.info("Updating Star Systems Calculated Fields")
            for( let ss of await StarSystemCollection.findAll(undefined, undefined, db) ) {
                promiseGroup.push(
                    this.#_updateSSCalcFields(ss, db)
                )
            }

            //Celestial Objects
            console.info("Updating Celestial Objects Calculated Fields")
            for( let co of await CelestialObjectCollection.findAll(undefined, undefined, db) ){
                promiseGroup.push(
                    this.#_updateCOCalcFields(co, db)
                )
            }
        } catch(err){
            console.error("ERROR - in DBUpdater.#_updateAllCalcFields", e)
        } finally {
            await Promise.all( promiseGroup )
        }
    }
    static #_updateAffCalcFields = async ( aff, db=DBManager.getDB() ) => { //console.debug("in DBUpdater.#_updateAffCalcFields")
        db = await db
        try{
            const query = { aid: aff.aid },
            ssids = await StarSystemCollection.findAll( { aid: aff.aid }, undefined, db ),
            coids = await CelestialObjectCollection.findAll( { aid: aff.aid }, undefined, db ),
            update = { $set: {
                ssids: ssids.map( it=>it.ssid ),
                coids: coids.map( it=>it.coid )
            } }
            
            await AffiliationCollection.updateOne( query, update, { upsert: true }, db)
        } catch(e){
            console.error("ERROR - in DBUpdater.#_updateAffCalcFields", e,
                "\n\taff: ", aff,"\n")
        }
    }
    static #_updateSSCalcFields = async ( ss, db=DBManager.getDB() ) => { //console.debug("in DBUpdater.#_updateSSCalcFields")
        db = await db
        try{
            // const tProjection = { projection: { tid: true/*, size: true*/ } },
            //     departureTunnels = await TunnelsCollection
            //         .findAll( { entry_ssid: ss.ssid }, tProjection, db),
            //     arrivalTunnels = await TunnelsCollection
            //         .findAll( { exit_ssid: ss.ssid }, tProjection, db),
            //     // filterFor = (tList, sizes) => {
            //     //     return tList
            //     //         .filter( t => sizes.includes(t.size) )
            //     //         .map( t => t.tid )
            //     // },
            //     query = { ssid: ss.ssid },
            //     update = {
            //         $set: {
            //             children_coid: ( await CelestialObjectsCollection
            //                 .findAllRaw( { ssid: ss.ssid }, { projection: {coid: 1} }, db ) )
            //                 .map( (coStub)=>{ return coStub.coid } ),
            //             children_departure_tid: departureTunnels, //filterFor(departureTunnels, ['L','M','S']),
            //             // children_departure_tid_large: filterFor(departureTunnels, ['L']),
            //             // children_departure_tid_medium: filterFor(departureTunnels, ['M']),
            //             // children_departure_tid_small: filterFor(departureTunnels, ['S']),
            //             children_arrival_tid: arrivalTunnels //filterFor(arrivalTunnels, ['L','M','S']),
            //             // children_arrival_tid_large: filterFor(arrivalTunnels, ['L']),
            //             // children_arrival_tid_medium: filterFor(arrivalTunnels, ['M']),
            //             // children_arrival_tid_small: filterFor(arrivalTunnels, ['S'])
            //         }
            //     }
            
            const tProjection = { projection: { tid: true, size: true } },
                query = { ssid: ss.ssid },
                update = { $set: {} },
                s1PromiseGroup = [],
                s2PromiseGroup = [],
                filterFor = (tList, sizes=[]) => {
                    return tList
                        .filter( t => sizes.includes(t.size) )
                        .map( t => t.tid )
                }
            let departureTunnels,
                arrivalTunnels
            
            s1PromiseGroup.push( (async () => {
                departureTunnels = await TunnelCollection
                    .findAll( { entry_ssid: ss.ssid }, tProjection, db)
            })() )
            s1PromiseGroup.push( (async () => {
                arrivalTunnels = await TunnelCollection
                    .findAll( { exit_ssid: ss.ssid }, tProjection, db)
            })() )

            //children_coid
            s2PromiseGroup.push( (async () => {
                update.$set.children_coid = ( await CelestialObjectCollection
                    .findAllRaw( { ssid: ss.ssid }, { projection: {coid: 1} }, db ) )
                    .map( coStub => coStub.coid )
            })() )

            Promise.all( s1PromiseGroup )
                .then( () => {
                    //*_departure_tid
                    s2PromiseGroup.push( (async () => {
                        update.$set.tid_departure_large = filterFor( departureTunnels, ['L'] )
                    })() )
                    s2PromiseGroup.push( (async () => {
                        update.$set.tid_departure_medium = filterFor( departureTunnels, ['M'] )
                    })() )
                    s2PromiseGroup.push( (async () => {
                        update.$set.tid_departure_small = filterFor( departureTunnels, ['S'] )
                    })() )
                    //*_arrival_tid
                    s2PromiseGroup.push( (async () => {
                        update.$set.tid_arrival_large = filterFor( arrivalTunnels, ['L'] )
                    })() )
                    s2PromiseGroup.push( (async () => {
                        update.$set.tid_arrival_medium = filterFor( arrivalTunnels, ['M'] )
                    })() )
                    s2PromiseGroup.push( (async () => {
                        update.$set.tid_arrival_small = filterFor( arrivalTunnels, ['S'] )
                    })() )
                })
            
            await Promise.all( s2PromiseGroup )
            await StarSystemCollection.updateOne( query, update, { upsert: true }, db )
        }catch(e){
            console.error("ERROR - in DBUpdater.#_updateSSCalcFields", e,
                "\n\tss: ", ss,"\n")
        }
    }
    static #_updateCOCalcFields = async ( co, db=DBManager.getDB() ) => { //console.debug("in DBUpdater.#_updateCOCalcFields")
        db = await db
        try{
            const query = { coid: co.coid },
                update = { $set: { children_coid: await this.#_getCOChildrenList( co.coid, db ) } }

                if( co.parent_coid ){
                    const filter = {coid: co.parent_coid},
                        parentCO = await CelestialObjectCollection.findOne( filter, undefined, db)
                    // console.log("filter: ", JSON.stringify(filter) )
                    // console.log("parentCO: ", parentCO.designation_name)
                    update.$set.parent_name = parentCO.designation_name
                }
            
            await CelestialObjectCollection.updateOne( query, update, { upsert: true } )
        } catch(e){
            console.error("ERROR - in DBUpdater.#_updateCOCalcFields", e,
                "\n\tco: ", co, "\n")
        }
    }
    static #_getCOChildrenList = async ( coid, db=DBManager.getDB() ) => { //console.debug("in DBUpdater.#_getCOChildrenList")
        db = await db
        const promiseGroup = []
        try{
            const coChildren = await CelestialObjectCollection.findAll(
                    { parent_coid: coid },
                    { projection: {coid: 1} },
                    db
                )
            
            for(let childCO of coChildren){
                promiseGroup.push(
                    (async () => {
                        return ([childCO.coid]).concat( await this.#_getCOChildrenList( childCO.coid, db ) )
                    })()
                )
            }
        } catch(e) {
            console.error("ERROR - in DBUpdater.#_getCOChildrenList",e,
                "\n\targuements: ", coid,"\n")
        } finally {
            return ( await Promise.all(promiseGroup) )
                    .reduce( (list, subList) => {
                        return list.concat(subList)
                    }, [] )
        }
    }
}