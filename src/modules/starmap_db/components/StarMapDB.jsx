import { Component } from "react";
import NavBar from "@/starmap_db/components/NavBar.jsx";
import ListView from "@/starmap_db/components/ListView.jsx";
import DetailsView from "@/modules/starmap_db/components/DetailsView.jsx";
import { ENTITY_PATHS, UI_ENTITY_STUBS } from "@/starmap_db/utils/Utilities";

export default class StarMapDB extends Component {
    constructor(props) { //console.debug("in StarMapDB.constructor", arguements)
        super(props)

        this.state = {
            record: null,
            recordEntityStub: null,
            tableEntityStub: UI_ENTITY_STUBS[ ENTITY_PATHS.starSystem ]
        }

        this.setRecord = this.setRecord.bind(this)
        this.setTableEntityStub = this.setTableEntityStub.bind(this)
        this.setContentHeight = this.setContentHeight.bind(this)
    }

    componentDidMount(){
        $(window).on('resize', this.setContentHeight)
        $(window).trigger('resize')
    }

    setRecord(record, entityStub){
        this.setState( prevState => {
            const obj = {
                record: record
            }

            if( entityStub ){
                obj.recordEntityStub = entityStub
            }

            return obj
        })
    }
    setTableEntityStub( entityStub ){
        this.setState( prevState => {
            return {
                tableEntityStub: entityStub
            }
        })
    }

    setContentHeight(){
        const vh = $(window).height()
        const navBar = $('nav.navbar').outerHeight()

        $('main').height(vh - navBar)
    }

    render(){ //console.debug("in StarMapDB.render", arguements)
        return(<>
        <div className="vh-100">
            <NavBar
                currentEntityStub={ this.state.tableEntityStub }
                setEntityStub={ this.setTableEntityStub }
            />
            <main className="container-fluid">
                <div className="row h-100">
                    <ListView
                        entityStub={ this.state.tableEntityStub }
                        setRecord={ this.setRecord }
                        record={ this.state.record }
                    />
                    <DetailsView
                        record={ this.state.record }
                        entityStub={ this.state.recordEntityStub }
                        setRecord={ this.setRecord }
                    />
                </div>
            </main>
        </div>
        </>);
    }
}