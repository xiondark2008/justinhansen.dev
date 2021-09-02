export function toHTMLName(val='') {
    return (val+'').toLowerCase().replace(/\s/g, '_')
}
export function hasElapsedSince(interval, start, end=new Date(), isInclusive=true ){
    const diff = end - start
    return isInclusive ? diff>=interval : diff>interval
}
export function originalOrParseInt(val){
    return !isNaN(val) && val !== null ? parseInt(val) : val 
}
export function originalOrParseFloat(val){
    return !isNaN(val) && val !== null ? parseFloat(val) : val
}
export function toUTF16Codes(val){
    return Array.prototype.map.call( val, (c) => {
        return c.charCodeAt().toString(16)
    } )
}
export function toUnicodeCodes(val){
    return Array.prototype.map.call( val, (c) => {
        return c.charCodeAt().toString()
    } )
}
export function propertyToLabel(prop){
    let label = '',
        isFirstLetter = true
    
    for( let char of prop.split('') ){
        if( char === '_' ){
            label += ' '
            isFirstLetter = true
        } else if( isFirstLetter ){
            label += char.toUpperCase()
            isFirstLetter = false
        } else if( char.search(/[A-Z]/) > -1 ){
            label += ' '+char.toUpperCase()
        } else {
            if( char.search(/\W/) > -1 ){
                isFirstLetter = true
            }
            label += char
        }
    }

    return label
}
export function concatStringList(additionStrList, currentStrList='', deliminator=',', prepend=false){
    const additionList = Array.from( new Set( (additionStrList).trim().split(deliminator) ) ),
        currentList = currentStrList.split(deliminator),
        start = prepend ? additionList.length-1 : 0,
        continueCheck = prepend ? (i) => i>-1 : (i) => i<additionList.length,
        step = prepend ? (i) => i-1 : (i) => i+1
    

    for( let i=start; continueCheck(i); i=step(i) ){
        if( !currentList.includes(additionList[i]) ){
            currentStrList = additionList[i] + deliminator + currentStrList
        }
    }
    return currentStrList
}
export function addClassNames(toAddStr, classNames='', prepend=true){
    if( toAddStr instanceof Array ){
        toAddStr = toAddStr.join(' ')
    }
    
    return concatStringList(toAddStr, classNames, ' ', prepend)
}
export function mergeObjects(a, b, overwrite=false, deepMerge=false, maxDepth=10, surpressWarning=false){
    // console.log('DEBUG - in Utilities.mergeObjects',arguments)
    const aCopy = Object.assign({}, a),
        bCopy = Object.assign({}, b),
        isPrimative = val=>!(val instanceof Object),
        aAllPrimativeVals = Object.values(aCopy).every( isPrimative ),
        bAllPrimativeVals = Object.values(bCopy).every( isPrimative )

    if( !deepMerge || (aAllPrimativeVals && bAllPrimativeVals) ){
        if( overwrite ){
            return Object.assign(aCopy, bCopy)
        } else {
            return Object.assign(bCopy, aCopy)
        }
    } else {
        const bEntries = Object.entries(bCopy)
        
        for(let i=0; i<bEntries.length; i++){
            const name = bEntries[i][0],
                val = bEntries[i][1]
            
            if( maxDepth > 0 && aCopy[name] instanceof Object && val instanceof Object){
                aCopy[name] = mergeObjects(aCopy[name], val, overwrite, deepMerge)
            } else if( overwrite || !aCopy.hasOwnProperty(name) ){
                if( maxDepth <= 0 && !surpressWarning ){
                    console.warn("WARN - Max object comparison depth reached. Assuming equal.")
                }
                aCopy[name] = val
            }
        }

        return aCopy
    }
    
}
export function addStyle(toAddObj, styleObj){
    return mergeObjects(toAddObj, styleObj, true)
}
export function cleanAttributesObject(attr, warn=(val)=>{
    console.warn("WARN - Attributes need to be an Object. Ignoring value and using "
                +"an empty object instead. Found type: "+(typeof val), val )
}){ //console.debug("DEBUG - in Utilities > cleanAttributesObject. attr: ",attr)
    if( !(attr instanceof Object) ){
        if( attr ){
            warn( attr )
        }
        return {}
    }

    return Object.assign({}, attr)
}
export function cleanAttributesObjectArray(attrs, warn=(val)=>{
    console.warn("WARN - Attributes need to be an Object or Array of Objects. Ignoring value and using "
                +"an array with empty object instead. Found type: "+(typeof val), val )
}){
    if( !(attrs instanceof Array) && attrs instanceof Object ){
        return [Object.assign(attrs)]
    } else if( !attrs
            || !(attrs instanceof Array)
            || !attrs.every( it => it instanceof Object ) ){
        if( attrs ){
            warn( attrs )
        }
        return [{}]
    }

    return Object.assign([], attrs)
}
export const ListEditor = (()=>{
    const PRIVATE = Symbol("Private")
    
    class ListEditor {
        static ACTION_TYPE = {
            INSERT: (val) => { return ++val },
            REMOVE: (val) => { return --val }
        }
    
        constructor(list){
            this[PRIVATE] = {
                list: list
            }
            this.actions = []
        }
    
        get list(){
            let list = this[PRIVATE].list,
                shiftList = []
            for(let i=0; i<=list.length; i++){  //NOTE: the '<=' this allows items to be added to the end of the list
                shiftList.push(0)
            }
    
            for(let action of this.actions){
                const index = action.index + shiftList[action.index]
    
                if(action.type === ListEditor.ACTION_TYPE.INSERT){
                    list.splice(index, 0, action.item)
                } else if(action.type === ListEditor.ACTION_TYPE.REMOVE){
                    list.splice(index, 1)
                } else {
                    throw new Error("Unhandled action type found: ", action.type)
                }
                
                for(let idx=action.index; idx<shiftList.length; idx++){
                    shiftList[idx] = action.type( shiftList[idx] )
                }
            }
    
            return list
        }
    
        insertAt(index, item){
            this.actions.push(
                ListEditor[PRIVATE].createActionLog(ListEditor.ACTION_TYPE.INSERT, index, item)
            )
        }
    
        removeAt(index){
            this.actions.push(
                ListEditor[PRIVATE].createActionLog(ListEditor.ACTION_TYPE.REMOVE, index, null)
            )
        }
    }
    ListEditor[PRIVATE] = {
        createActionLog: (type, index, item) => {
            return {
                type: type,
                index: index,
                item: item
            }
        }
    }
    
    return ListEditor
})()
export function isEmpty(val){
    if( typeof val === 'string' || val instanceof Array ){
        return val.length < 1
    } else if( val instanceof Set || val instanceof Map ){
        return val.size < 1
    } else if( val instanceof Object ){
        return Object.entries(val).length < 1
    } else if( val === undefined ){
        return true
    }

    return false
}
export function getUniqueId(instanceIdList, base=getRandomString(4), warning=(instanceIdList)=>{
    console.warn("WARN - was not able to generate unique id for instance id list: ",instanceIdList)
}){
    let count = -1

    do{
        const id = base + (count < 0 ? '' : '_'+count),
            isUniqueId = instanceIdList.every( it => it !== id )
        
        if( isUniqueId ){
            return id
        }
    }while(count++ <= instanceIdList.length)

    warning( instanceIdList )
}
export const InstanceTracker = (()=>{
    const PRIVATE = Symbol("Private"),
        DEFAULT_WARNING = (key, baseId, instanceIdList)=>{
            console.warn("WARN - was not able to generate unique id for key("+key
            +") with baseId \""+baseId+"\" in list: ",instanceIdList)
        }

    class InstanceTracker {
        constructor(base='instance_'+getRandomString(4), warning=DEFAULT_WARNING){
            this[PRIVATE] = {
                instances: new Map()
            }
            this.base = base
            this.warning = warning
        }
    
        get(key){
            return this[PRIVATE].instances.get( key )
        }
    
        getKeyOf( id ){
            for(const [key, value] of this[PRIVATE].instances){
                if(value === id){
                    return key
                }
            }
    
            return undefined
        }
    
        hasId( id ){
            return this.getKeyOf( id ) !== undefined
        }
    
        getUniqueId(key=this[PRIVATE].instances.size, requestedId=this.base){
            if( this[PRIVATE].instances.has(key) ){
                return this.get( key )
            }
            for(var mod=null; mod<=this[PRIVATE].instances.size; mod++){
                const id = toHTMLName( mod === null ? requestedId : requestedId+'_'+mod )
    
                if( !this.hasId(id) ){
                    this[PRIVATE].instances.set(key, id)
    
                    return id
                }
            }

            this.warning( key, requestedId, this[PRIVATE].instances )
            return null
        }
    
        remove(key){
            return this[PRIVATE].instances.delete( key )
        }
    }

    return InstanceTracker;
})() 
export function getRandomString(length){
    let str = ''
    
    for(let c=0; c<length; c++){
        const rand = Math.floor( 52 * Math.random() )
        str += String.fromCharCode( 65 + (rand < 26 ? rand : rand + 6) )
    }

    return str
}
export function tryFor(func, timeout=500, limit=100){
    const recursive = (attempts=0) => {
        try{
            return func()
        } catch( err ){
            if(attempts < limit){
                setTimeout( ()=>{ recursive(attempts+1) }, timeout)
            } else {
                throw err
            }
        }
    }

    return recursive()
}

export function cssTransformScaleToCenter(targetSize, spaceAvailable, originalSize){
    return Math.min(50,((spaceAvailable - targetSize) / (2 * (originalSize - targetSize))) * 100)+'%'
}

export function urlQueryFromString(str){
    const parts = str.split('?'),
        query = {}

    if( parts[1] ){
        const keyValPairs = parts[1].split('&')

        for(let i=0; i<keyValPairs.length; i++){
            const keyVal = keyValPairs[i].split('=')

            query[ keyVal[0] ] = keyVal[1] !== undefined ? keyVal[1] : null
        }
    }

    return query
}

export function areObjectsEqual(a, b, maxDepth=10, surpressWarning=false){ //console.log("DEBUG - in Utilities.areObjectsEqual",a,b,maxDepth)
    const sorter = (a,b)=>a[0] < b[0] ? -1 : 1,
        aEntries = Object.entries(a).sort( sorter ),
        bEntries = Object.entries(b).sort( sorter )
    
    if(aEntries.length != bEntries.length){
        return false
    }

    for(let i=0; i<aEntries.length; i++){
        const aName = aEntries[i][0],
            bName = bEntries[i][0],
            aVal = aEntries[i][1],
            bVal = bEntries[i][1]
        
        if( aName !== bName ){
            return false
        } else if( aVal === bVal ){
            continue
        } else if( 
            typeof aVal !== typeof bVal
            || !(aVal instanceof Object)
        ){
            return false
        } else if( maxDepth <= 0){
            if( !surpressWarning ){
                console.warn("WARN - Max object comparison depth reached. Assuming equal.")
            }
            continue
        } else if( !areObjectsEqual(aVal,bVal,maxDepth-1) ){
            return false
        }
    }

    return true
}