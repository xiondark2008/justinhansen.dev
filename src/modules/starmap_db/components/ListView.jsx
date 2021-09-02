import { Component } from "react";
import TableViewNav from "@/starmap_db/components/TableViewNav.jsx";
import AjaxDatatable from "@/common/components/AjaxDatatable";
import { toHTMLName } from '@/utils/Utilities.js'

import style from '@/starmap_db/styles/StarMapDB.module.scss'

export default class ListView extends Component {
    constructor(props) { //console.debug("in ListView.constructor", arguements)
        super(props)
        const entityKey = this.getEntityKey()
        
        this.state = {
            [entityKey]: {
                view: this.props.entityStub.views[0],
                page: 0
            }
        }

        this.setView = this.setView.bind(this)
        this.getEntityKey = this.getEntityKey.bind(this)
    }

    //Lifecycle Methods
    shouldComponentUpdate(nextProps, nextState){
        const entityKey = this.getEntityKey( nextProps.entityStub.label )

        if( !nextState[entityKey] ){
            this.setState({
                [entityKey]: {
                    view: nextProps.entityStub.views[0],
                    page: 0
                }
            })

            return false
        }

        return true
    }

    //Update Methods
    setView(view){
        const entityKey = this.getEntityKey()
        
        this.setState({
            [entityKey]: {
                view: view
            }
        })
    }

    //Utility
    getEntityKey(label = this.props.entityStub.label){
        return "key_for_" + toHTMLName(label)
    }

    render(){ //console.debug("in ListView.render", arguements)
        const entityKey = this.getEntityKey(),
            entityStub = this.props.entityStub,
            setRecord = this.props.setRecord

        return(<>
        <nav className="mx-1"
            id={ style.side_nav }
        >
            <TableViewNav
                views={ entityStub.views }
                currentView={ this.state[ entityKey ].view }
                setView={ this.setView }
            />
        </nav>
        <article className="mx-1"
            id={ style.main_table }
        >
            <AjaxDatatable key={ entityStub.label /* NOTE: when the key changes, the component
                                                     will remount. This is needed to rebuild 
                                                     the data table when the entity changes */ }
                dataUrl={ entityStub.dataUrl }
                columns={ this.state[ entityKey ].view.columns }
                opts={ {
                    //searching: false,
                    select: { style: 'single' },
                    lengthChange: false,
                    scrollX: true,
                    scrollY: 'calc(100vh - 14rem)',
                    initComplete: (settings, json) => { //console.log('in initComplete', settings)
                        if( !this.props.record ){
                            const api = new $.fn.dataTable.Api( settings );

                            api.row(0).select()
                        }
                    }
                } }
                afterInit={ ($table) => { //console.log('in afterInit', $table)
                    $table.on('select', function selectHandler( e, dt, type, indexes ) {
                        //console.debug("DEBUG - in selectHandler.",type,indexes)
                        if ( type === 'row' ) {
                            var data = $table.rows( indexes ).data()[0]

                            setRecord(data, entityStub)
                        }
                    })
                } }
            />
        </article>
        </>);
    }
}