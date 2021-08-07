export function toHTMLName(val='') {
    return (val+'').toLowerCase().replaceAll(' ', '_')
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

export function addClassName(val, list=''){
    return list.split(' ').includes(val) ? list : val + ' ' + list
}
export function addStyle(keyValue, obj){
    if( !(obj instanceof Object) ){
        obj = {}
    } else {
        obj = Object.assign({}, obj)
    }
    return Object.assign(obj, keyValue)
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
    } else if( val instanceof Object ){
        return Object.entries(val).length < 1
    }

    return false
}