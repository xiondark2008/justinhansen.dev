import { Component } from "react";
import { cleanAttributesObject,
         addClassNames,
         addStyle, 
         mergeObjects,
         isEmpty,
         InstanceTracker} from "@/common/utils/Utilities";
import DataTable from "datatables.net-select-bs5/js/select.bootstrap5";

//TODO: document props
export default class AjaxDatatable extends Component {
    static INSTANCES = new InstanceTracker('DataTable')

    constructor(props){ 
        super(props)
        this.tableAttr = cleanAttributesObject( this.props.tableAttr )
        this.theadAttr = cleanAttributesObject( this.props.theadAttr )
        this.tbodyAttr = cleanAttributesObject( this.props.tbodyAttr )
        this.tfootAttr = cleanAttributesObject( this.props.tfootAttr )

        this.instanceKey = this.tableAttr.id || this.props.dataUrl
        this.tableId = AjaxDatatable.INSTANCES.getUniqueId( this.instanceKey )
        delete this.tableAttr.id

        this.componentDidMount = this.componentDidMount.bind(this)
        this.componentDidUpdate = this.componentDidUpdate.bind(this)
        this.componentWillUnmount = this.componentWillUnmount.bind(this)
        this.render = this.render.bind(this)
    }

    //Lifecycle
    componentDidMount(){ //console.debug("DEBUG - in AjaxDatatable.componentDidMount")
        if( !window.$.fn.dataTable ){
            window.$ = DataTable.$
        }

        const opts = mergeObjects({
                ajax: this.props.dataUrl,
                columns: this.props.columns
            }, this.props.opts),
            afterInit = this.props.afterInit instanceof Function ?
                this.props.afterInit.bind(this) :
                undefined,
            $table = $('#'+this.tableId).DataTable( opts )

        if( afterInit ){
            afterInit($table, this.props, this.state)
        }
        
        this.setState({
            $table: $table
        })
    }
    shouldComponentUpdate(nextProps, nextState){
        //console.log("is same columns: ", this.props.columns == nextProps.columns )
        if( this.props.columns == nextProps.columns ){
            return false
        }
        return true
    }
    componentDidUpdate(prevProps){ //console.log('in componentDidUpdate')
        const $table = this.state.$table

        for(let propsColumn of this.props.columns){
            const name = propsColumn.name + ':name',
                isVisible = propsColumn.visible

            $table.column( name ).visible( isVisible, false )
        }

        $table.draw()
    }
    componentWillUnmount(){ //console.debug("DEBUG - in AjaxDatatable.componentWillUnmount for "+this.tableId)
        if(this.state.$table ){
            this.state.$table.destroy()
        }
        AjaxDatatable.INSTANCES.remove( this.instanceKey )
    }

    render(){ //console.debug("DEBUG - in AjaxDataTable.render for "+this.tableId, this.props.dataUrl)
        this.tableAttr.className = addClassNames('table', this.tableAttr.className)
        this.tableAttr.style = addStyle({width:100+'%'}, this.tableAttr.style)
        
        return(<>
        <table id={ this.tableId } {...this.tableAttr}>
            { !isEmpty( this.theadAttr ) && <thead {...this.theadAttr}></thead> }
            { !isEmpty( this.tbodyAttr ) && <tbody {...this.tbodyAttr}></tbody> }
            { !isEmpty( this.tfootAttr ) && <tfoot {...this.tfootAttr}></tfoot> } 
        </table>
        </>)
    }
}