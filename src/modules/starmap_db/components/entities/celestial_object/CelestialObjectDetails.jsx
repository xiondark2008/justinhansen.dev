import { Component } from "react";
import DetailsHeader from "@/starmap_db/components/elements/DetailsHeader";
import AjaxDatatable from "@/common/components/AjaxDatatable";
import BootstrapProgressBar from "@/common/components/elements/BootstrapProgressBar"
import StarSystemStub from "@/starmap_db/components/entities/star_system/StarSystemStub";

import { UI_ENTITY_STUBS } from "@/starmap_db/utils/Utilities";

export default class CelestialObjectDetails extends Component {
    constructor(props){
        super(props)
    }

    render(){
        const record = this.props.record,
            satelliteFilter = JSON.stringify( {
                coid: { $in: record.children_coid }
            } ),
            satelliteDataUrl = UI_ENTITY_STUBS['celestial-objects'].dataUrl+"?filter="+encodeURIComponent( satelliteFilter ),
            satelliteColumns = [{
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
                paging: false,
                searching: false,
                scrollY: "300px",
                scrollCollapse: true,
            }
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
            {/* Header & Name */}
            <DetailsHeader
                title={ record.name ? record.name : record.designation }
                subtitle={ record.name ? record.designation : undefined }
                sectionAttr={ sectionAttr }
            />
        </div>
        <div className="row">
            {/* Details */}
            <section className="col-md-6 col-lg-12 mb-3">
                <dl className="row mb-0">
                    <dt className="col-12 col-sm-6 text-sm-end">Star System</dt>
                    <dd className="col-12 col-sm-6">{ record.ss_name }</dd>
                    <dt className="col-12 col-sm-6 text-sm-end">Type</dt>
                    <dd className="col-12 col-sm-6">{ record.type }</dd>
                    <dt className="col-12 col-sm-6 text-sm-end">Subtype</dt>
                    <dd className="col-12 col-sm-6">{ record.subtype }</dd>
                    <dt className="col-12 col-sm-6 text-sm-end">Habitable</dt>
                    <dd className="col-12 col-sm-6">{ record.habitable ? 'Yes' : '-' }</dd>
                    <dt className="col-12 col-sm-6 text-sm-end">Affiliation</dt>
                    <dd className="col-12 col-sm-6"><span>{ record.affiliation_name }</span></dd>
                    <dt className="col-12 col-sm-6 text-sm-end">Fair Chance Act</dt>
                    <dd className="col-12 col-sm-6">{ record.fair_chance_act ? 'Protected' : '-' }</dd>
                    <dt className="col-12 col-sm-6 text-sm-end">Orbits</dt>
                    <dd className="col-12 col-sm-6">{ record.parent_name }</dd>
                </dl>
            </section>
            
            {/* Description */}
            <section className="col-md-6 col-lg-12 mb-3">
                <p>{ record.description }</p>
            </section>
        </div>
        <div className="row">
            {/* Sensor data */}
            <section className="col-md-6 col-lg-12 mb-3">
                <h4 className="border-bottom">Sensor Data</h4>
                <dl className="row mb-0">
                    <dt className="col-12 col-sm-4 text-sm-end">Popuation</dt>
                    <dd className="col-12 col-sm-8">
                        <BootstrapProgressBar
                            barsAttr={ {
                                text: record.sensor_population,
                                className:"bg-success",
                                style: {width: (record.sensor_population / 10 * 100)+'%'}
                            } }
                        />
                    </dd>
                    <dt className="col-12 col-sm-4 text-sm-end">Economy</dt>
                    <dd className="col-12 col-sm-8">
                        <BootstrapProgressBar
                            barsAttr={ {
                                text: record.sensor_economy,
                                className:"bg-warning",
                                style: {width: (record.sensor_economy / 10 * 100)+'%'}
                            } }
                        />
                    </dd>
                    <dt className="col-12 col-sm-4 text-sm-end">Danger</dt>
                    <dd className="col-12 col-sm-8">
                        <BootstrapProgressBar
                            barsAttr={ {
                                text: record.sensor_danger,
                                className:"bg-danger",
                                style: {width: (record.sensor_danger / 10 * 100)+'%'}
                            } }
                        />
                    </dd>
                </dl>
            </section>
            
            {/* Star System Details */}
            <section className="ss_details col-md-6 col-lg-12">
                <h4 className="border-bottom">Star System Details</h4>
                <StarSystemStub
                    key={ record.ssid }
                    ssid={ record.ssid }/>
            </section>
        </div>
        <div className="row">
            {/* Child Objects */}
            <section className="col-md-6 col-lg-12 mb-3">
                <h4 className="border-bottom">Satellites</h4>
                <AjaxDatatable
                    key={ record.coid }
                    dataUrl={ satelliteDataUrl }
                    columns={ satelliteColumns }
                    opts={ datatableOpts }
                />
            </section>
            
            {/* Stats */}
            <section className="col-md-6 col-lg-12 mb-3">
                <h4 className="border-bottom">Stats</h4>
                <dl>
                    <dt>Stats</dt>
                    <dd>
                        <ul className="list-group">
                            <li className="list-group-item">
                                <h6 className="fst-normal m-0">Size</h6>
                                <div className="text-sm-end"><b>{ record.size + 'km' }</b></div>
                            </li>
                            <li className="list-group-item">
                                <h6 className="fst-normal m-0">Orbit Period</h6>
                                <div className="text-sm-end"><b>{ record.orbit_period + ' days' }</b></div>
                            </li>
                            <li className="list-group-item">
                                <h6 className="fst-normal m-0">Orbit Radius</h6>
                                <div className="text-sm-end"><b>{ record.distance + 'au' }</b></div>
                            </li>
                            <li className="list-group-item">
                                <h6 className="fst-normal m-0">Axial Tilt</h6>
                                <div className="text-sm-end"><b>{ record.axial_tilt + '°' }</b></div>
                            </li>
                        </ul>
                    </dd>
                </dl>
            </section>
        </div>
        </>)
    }
}