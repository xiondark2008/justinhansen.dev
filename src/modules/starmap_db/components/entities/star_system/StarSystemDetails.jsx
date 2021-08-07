import { Component, ReactDOM } from "react";
import DetailsHeader from "@/starmap_db/components/elements/DetailsHeader";
import BootstrapNavTabs from "@/common/components/BootstrapNavTabs";
import AjaxDatatable from "@/common/components/AjaxDatatable";
import BootstrapProgressBar from "@/common/components/elements/BootstrapProgressBar"
import NumberCallout from "@/common/components/elements/NumberCallout"

import { ENTITY_PATHS, RSI_URL, UI_ENTITY_STUBS } from "@/starmap_db/utils/Utilities";
import CelestialObject from "@/modules/starmap_db/types/entities/CelestialObject";
import SetRecordLink from "../../elements/setRecordLink";

export default class StarSystemDetails extends Component {
    constructor(props) { //console.debug("in StarSystemDetails.constructor", arguements)
        super(props)

        this.state = {

        }
    }

    render(){ //console.debug("in StarSystemDetails.render", arguements)
        const self = this,
            record = this.props.record,
            departueTunnelFilter = JSON.stringify( { 
                entry_ssid: record.ssid 
            } ),
            departueTunnelDataUrl = UI_ENTITY_STUBS[ ENTITY_PATHS.tunnel ].dataUrl+"?filter="+encodeURIComponent( departueTunnelFilter ),
            departureTunnelColumns = [{
                    title: "to System",
                    name: "exit_ss_name",
                    data: "exit_ss_name"
                },{
                    title: "Size",
                    name: "size",
                    data: "size"
                },{
                    title: "Affiliation",
                    name: "exit_ss_affiliation_name",
                    data: "exit_ss_affiliation_name"
                }
            ],
            arrivalTunnelFilter = JSON.stringify( { 
                exit_ssid: record.ssid 
            } ),
            arrivalTunnelDataUrl = UI_ENTITY_STUBS[ ENTITY_PATHS.tunnel ].dataUrl+"?filter="+encodeURIComponent( arrivalTunnelFilter ),
            arrivalTunnelColumns = [{
                    title: "from System",
                    name: "entry_ss_name",
                    data: "entry_ss_name"
                },{
                    title: "Size",
                    name: "size",
                    data: "size"
                },{
                    title: "Affiliation",
                    name: "entry_ss_affiliation_name",
                    data: "entry_ss_affiliation_name"
                }
            ],
            celestialObjectFilter = JSON.stringify( {
                coid: { $in: record.children_coid }
            } ),
            celestialObjectDataUrl = UI_ENTITY_STUBS[ ENTITY_PATHS.celestialObject ].dataUrl+"?filter="+encodeURIComponent( celestialObjectFilter ),
            celestialObjectColumns = [{
                    title: "Name",
                    name: "name",
                    data: "name",
                    render: (field, type, doc, meta) => {
                        return CelestialObject.formatDesignationName(field, doc.designation)
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
                paging: false,
                searching: false,
                scrollY: "300px",
                scrollCollapse: true,
            },
            diagramSize = record.size > record.frost_line ? record.aggregated_size : record.frost_line + 1
        let sectionAttr = {}

        if( record.thumbnail_info ){
            sectionAttr = {
                style: {
                    'padding': '6rem 0 1rem',
                    'backgroundImage': 'url('+record.thumbnail_info.source+')', //TODO: find way to change source based on size
                    'backgroundSize': 'cover'
                } 
            }
        }

        return(<>
        <div className="row">
            <DetailsHeader
                title={ record.name }
                subtitle={ record.affiliation_name }
                sectionAttr={ sectionAttr }
            />
        </div>
        <div className="row">
            {/* Description */}
            <section className="col-md-6 col-lg-12 mb-3">
                <p>{ record.description }</p>
            </section>
            
            {/* Sensor reads */}
            <section className="col-md-6 col-lg-12 mb-3">
                <h4 className="border-bottom">Sensor Data</h4>
                <dl className="row align-items-center">
                    <dt className="col-12 col-sm-4 text-sm-end">Popuation</dt>
                    <dd className="col-12 col-sm-8">
                        <BootstrapProgressBar
                            barsAttr={ {
                                text: record.population,
                                className:"bg-success",
                                style: {width: (record.population / 10 * 100)+'%'}
                            } }
                        />
                    </dd>
                    <dt className="col-12 col-sm-4 text-sm-end">Economy</dt>
                    <dd className="col-12 col-sm-8">
                        <BootstrapProgressBar
                            barsAttr={ {
                                text: record.economy,
                                className:"bg-warning",
                                style: {width: (record.economy / 10 * 100)+'%'}
                            } }
                        />
                    </dd>
                    <dt className="col-12 col-sm-4 text-sm-end">Danger</dt>
                    <dd className="col-12 col-sm-8">
                        <BootstrapProgressBar
                            barsAttr={ {
                                text: record.danger,
                                className:"bg-danger",
                                style: {width: (record.danger / 10 * 100)+'%'}
                            } }
                        />
                    </dd>
                </dl>
            </section>
        </div>
        <div className="row">
            {/* Tunnels */}
            <section className="col-md-6 col-lg-12 mb-3">
                <h4 className="border-bottom">Tunnels</h4>
                <BootstrapNavTabs
                    tabLabels={ ['Departure Tunnels', 'Arrival Tunnels'] }
                    ulAttr={ {className:'nav-tabs nav-justified'} }
                >
                    <>
                    <div className="row">
                        <div className="col-3 border-end">
                            <NumberCallout
                                value={ ([record.tid_departure_large.length,
                                        record.tid_departure_medium.length,
                                        record.tid_departure_small.length]).reduce( (prev,val)=>prev+val, 0) }
                                label='Total'
                            />
                        </div>
                        <div className="col-3">
                            <NumberCallout
                                value={ record.tid_departure_large.length }
                                label='Large'
                            />
                        </div>
                        <div className="col-3">
                            <NumberCallout
                                value={ record.tid_departure_medium.length }
                                label='Medium'
                            />
                        </div>
                        <div className="col-3">
                            <NumberCallout
                                value={ record.tid_departure_small.length }
                                label='Small'
                            />
                        </div>
                    </div>
                    <AjaxDatatable
                        key={ record.ssid }
                        dataUrl={ departueTunnelDataUrl }
                        columns={ departureTunnelColumns }
                        opts={ datatableOpts }
                    />
                    </>
                    <>
                    <div className="row text-center">
                        <div className="col-3 border-end">
                            <NumberCallout
                                value={ ([record.tid_arrival_large.length,
                                        record.tid_arrival_medium.length,
                                        record.tid_arrival_small.length]).reduce( (prev,val)=>prev+val, 0) }
                                label='Total'
                            />
                        </div>
                        <div className="col-3">
                            <NumberCallout
                                value={ record.tid_arrival_large.length }
                                label='Large'
                            />
                        </div>
                        <div className="col-3">
                            <NumberCallout
                                value={ record.tid_arrival_medium.length }
                                label='Medium'
                            />
                        </div>
                        <div className="col-3">
                            <NumberCallout
                                value={ record.tid_arrival_small.length }
                                label='Small'
                            />
                        </div>
                    </div>
                    <AjaxDatatable
                        key={ record.ssid }
                        dataUrl={ arrivalTunnelDataUrl }
                        columns={ arrivalTunnelColumns }
                        opts={ datatableOpts }
                    />
                    </>
                </BootstrapNavTabs>
            </section>
            
            {/* Celestial objects */}
            <section className="col-md-6 col-lg-12 mb-3">
                <h4 className="border-bottom">Celestial Objects</h4>
                <AjaxDatatable
                    key={ record.ssid }
                    dataUrl={ celestialObjectDataUrl }
                    columns={ celestialObjectColumns }
                    opts={ datatableOpts }
                />
            </section>
        </div>
        <div className="row">
            {/* Stats */}
            <section className="col-12">
                <h4 className="border-bottom">Info</h4>
                <dl>
                    <dt>Diagram</dt>
                    <dd>
                        <BootstrapProgressBar
                            barsAttr={ [{
                                    className:'bg-light',
                                    style: {width: ( record.habitable_zone_inner / diagramSize * 100)+'%'}
                                },{
                                    text: 'Habital Zone',
                                    className:'bg-success',
                                    style: {width: ( (record.habitable_zone_outer - record.habitable_zone_inner) / diagramSize * 100)+'%'}
                                },{
                                    className:'bg-light',
                                    style: {width: ( (record.frost_line - record.habitable_zone_outer) / diagramSize * 100)+'%'}
                                },{
                                    text: 'Frost Line',
                                    className:'bg-info',
                                    style: {width: ( ( 1 - (record.frost_line / diagramSize) ) * 100)+'%'}
                                }]
                            }
                        />
                    </dd>
                    <dt>Stats</dt>
                    <dd>
                        <ul className="list-group">
                            <li className="list-group-item">
                                <h6 className="fst-normal m-0">Aggregated Size</h6>
                                <div className="text-sm-end"><b>{ record.size + 'au' }</b></div>
                            </li>
                            <li className="list-group-item">
                                <h6 className="fst-normal m-0">Habitable Zone(Inner)</h6>
                                <div className="text-sm-end"><b>{ record.habitable_zone_inner + 'au' }</b></div>
                            </li>
                            <li className="list-group-item">
                                <h6 className="fst-normal m-0">Habitable Zone(Outer)</h6>
                                <div className="text-sm-end"><b>{ record.habitable_zone_outer + 'au' }</b></div>
                            </li>
                            <li className="list-group-item">
                                <h6 className="fst-normal m-0">Frost Line</h6>
                                <div className="text-sm-end"><b>{ record.frost_line + 'au' }</b></div>
                            </li>
                        </ul>
                    </dd>
                    <dt>Meta</dt>
                    <dd>
                        <ul className="list-group">
                            <li className="list-group-item">
                                <h6 className="fst-normal m-0">Link to Starmap</h6>
                                <div className="text-sm-end">
                                    <b><a target="_blank" href={ RSI_URL+'?location='+record.code }>Go To Starmap</a></b>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <h6 className="fst-normal m-0">Last Modified</h6>
                                <div className="text-sm-end">
                                    <b>{ ( new Date(record.rsi_last_modified) ).toLocaleString() }</b>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <h6 className="fst-normal m-0">Info URL</h6>
                                <div className="text-sm-end">
                                    <b>{ record.info_url ? 'none' : <a target="_blank" href={ record.info_url }>{ record.info_url }</a> }</b>
                                </div>
                            </li>
                        </ul>
                    </dd>
                </dl>
            </section>
        </div>
        </>);
    }
}