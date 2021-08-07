import { Component } from "react";
import DetailsHeader from "@/starmap_db/components/elements/DetailsHeader";
import AjaxDatatable from "@/common/components/AjaxDatatable";

import { UI_ENTITY_STUBS } from "@/starmap_db/utils/Utilities"

export default class AffiliationDetails extends Component {
    constructor(props){
        super(props)
    }

    render(){
        const record = this.props.record,
            ssFilter = JSON.stringify( { 
                entry_ssid: record.ssid 
            } ),
            ssDataUrl = UI_ENTITY_STUBS['star-systems'].dataUrl+"?filter="+encodeURIComponent( ssFilter ),
            ssColumns = [{
                    title: "Name",
                    name: "name",
                    data: "name"
                },{
                    title: "Affiliation",
                    name: "affiliation",
                    data: "affiliation_name",
                    render: (field, type, doc, meta)=>{
                        if(type === 'display'){
                            return '<span className="affiliation" data-affiliation="'+field+'">'+field+'</span>'
                        }
                        return field
                    }
                },{
                    title: "Status",
                    name: "status",
                    data: "status",
                    render: (field, type, doc, meta)=>{
                        switch(field){
                            case 'M': return "Classified";
                            case 'N': return "Incomplete";
                            case 'P':
                            default: return '-'
                        }
                    }
                }
            ],
            coFilter = JSON.stringify( { 
                entry_ssid: record.ssid 
            } ),
            coDataUrl = UI_ENTITY_STUBS['celestial-objects'].dataUrl+"?filter="+encodeURIComponent( coFilter ),
            coColumns = [{
                    title: "Name",
                    name: "name",
                    data: "name",
                    render: (field, type, doc, meta)=>{
                        return ( field ?
                            field+' ('+doc.designation+')'
                            : doc.designation )
                    }
                },{
                    title: "Type",
                    name: "type",
                    data: "type"
                },{
                    title: "Subtype",
                    name: "subtype",
                    data: "subtype"
                }
            ],
            datatableOpts = {
                info: false,
                lengthChange: false,
                searching: false,
                scrollY: "300px",
                scrollCollapse: true,
            }

        return(<>
        <div className="row">
            {/* Header & Name */}
            <DetailsHeader
                title={ record.name }
            />
        </div>
        <div className="row">
            {/* Star Systems */}
            <section className="col-md-6 col-lg-12 mb-3">
                <h4 className="border-bottom">Star Systems</h4>
                <dl className="row mb-0">
                    <dt className="col-12 col-sm-4 text-sm-end">Count</dt>
                    <dd className="col-12 col-sm-8">{ record.ssids ? record.ssids.length : 0 }</dd>
                </dl>
                <AjaxDatatable
                    key={ record.aid }
                    dataUrl={ ssDataUrl }
                    columns={ ssColumns }
                    opts={ datatableOpts }
                />
            </section>
            
            {/* Celestial Objects */}
            <section className="col-md-6 col-lg-12 mb-3">
                <h4 className="border-bottom">Celestial Objects</h4>
                <dl className="row mb-0">
                    <dt className="col-12 col-sm-4 text-sm-end">Count</dt>
                    <dd className="col-12 col-sm-8">{ record.coids ? record.coids.length : 0 }</dd>
                </dl>
                <AjaxDatatable
                    key={ record.aid }
                    dataUrl={ coDataUrl }
                    columns={ coColumns }
                    opts={ datatableOpts }
                />
            </section>
        </div>
        </>)
    }
}