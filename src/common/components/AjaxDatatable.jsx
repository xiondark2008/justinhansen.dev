import { Component } from "react";
import { toHTMLName,
         cleanAttributesObject,
         addClassName,
         addStyle } from "@/common/utils/Utilities";

//TODO: document props
export default class AjaxDatatable extends Component {
    static TABLE_STATES = new Map()
    static getGenericId(){
        const base = 'table_'
        let count = 0

        do{
            const id = base + count++,
                isUniqueId = Array.from(AjaxDatatable.TABLE_STATES, ([key, val]) => val)
                        .every( it => it.id !== id )
            
            if( isUniqueId ){
                return id
            }
        }while(count <= AjaxDatatable.TABLE_STATES.size)

        console.warn("WARN - was not able to generate AjaxDatatable id.",AjaxDatatable.TABLE_STATES)
    }
    constructor(props){ 
        super(props)
        this.tableAttr = cleanAttributesObject(this.props.tableAttr)

        this.stateKey = this.tableAttr.id || this.props.dataUrl
        if( !AjaxDatatable.TABLE_STATES.has( this.stateKey ) ){
            AjaxDatatable.TABLE_STATES.set(this.stateKey, {
                id: toHTMLName( this.tableAttr.id || AjaxDatatable.getGenericId() ),
                state: {} 
            })
        }
        this.tableId = AjaxDatatable.TABLE_STATES.get( this.stateKey ).id
        delete this.tableAttr.id

        this.state = {}

        this.componentDidMount = this.componentDidMount.bind(this)
        this.componentDidUpdate = this.componentDidUpdate.bind(this)
        this.componentWillUnmount = this.componentWillUnmount.bind(this)
        this.render = this.render.bind(this)
    }

    //Lifecycle
    componentDidMount(){ console.debug("DEBUG - in AjaxDatatable.componentDidMount")
        const self = this,
            opts = Object.assign( {}, this.props.opts ? this.props.opts : {} ),
            initializeDatatable = () => { console.debug("DEBUG - in AjaxDatatable.componentDidMount > initializeDatatable")
                const jqueryExists = !!jQuery,
                    datatableExists = !!$.fn.DataTable
                
                console.debug("DEBUG - in AjaxDatatable.componentDidMount > initializeDatatable > jquery("+jqueryExists+") and datatable("+datatableExists+")")
                if( jqueryExists && datatableExists ){ 
                    const $table = $('#'+self.tableId).DataTable(opts),
                        afterInit = self.props.afterInit

                    if(afterInit instanceof Function){
                        afterInit.bind(self)($table, self.props, self.state)
                    }
                } else { console.debug("DEBUG - in AjaxDatatable.componentDidMount > initializeDatatable > try again later")
                    setTimeout( initializeDatatable, 100)
                }
            }

        if( this.props.dataUrl ){
            opts.ajax = this.props.dataUrl
        }
        if( this.props.columns ){
            opts.columns = this.props.columns
        }

        initializeDatatable()
    }
    shouldComponentUpdate(nextProps, nextState){
        //console.log("is same columns: ", this.props.columns == nextProps.columns )
        if( this.props.columns == nextProps.columns ){
            return false
        }
        return true
    }
    componentDidUpdate(prevProps){
        const $table = $('#'+this.tableId).DataTable()

        for(let propsColumn of this.props.columns){
            const name = propsColumn.name + ':name',
                isVisible = propsColumn.visible

            $table.column( name ).visible( isVisible, false )
        }

        $table.draw()
    }
    componentWillUnmount(){ //console.debug("DEBUG - in AjaxDatatable.componentWillUnmount for "+this.tableId)
        $('#'+this.tableId).DataTable().destroy()
        AjaxDatatable.TABLE_STATES.delete( this.stateKey )
    }

    //Utility

    render(){ //console.debug("DEBUG - in AjaxDataTable.render for "+this.tableId, this.props.dataUrl)
        const tableId = this.tableId,
            tableAttr = this.tableAttr,
            theadAttr = this.props.theadAttr,
            tbodyAttr = this.props.tbodyAttr,
            tfootAttr = this.props.tfootAttr
        
        tableAttr.className = addClassName('table', tableAttr.className)
        tableAttr.style = addStyle({width:100+'%'}, tableAttr.style)
        
        return(<>
        <table id={ tableId } {...tableAttr}>
            { theadAttr && <thead {...theadAttr}></thead> }
            { tbodyAttr && <tbody {...tbodyAttr}></tbody> }
            { tfootAttr && <tfoot {...tfootAttr}></tfoot> } 
        </table>
        </>)
    }
}