import React from 'react'
import BaseComponent from './../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import BaseEntity from './../../../models/BaseEntity';
import MasterDataService from './../../../services/MasterDataService';
import WebRequest from '../../../models/commons/WebRequest';
import WebResponse from '../../../models/commons/WebResponse'; 
class EditDeleteButton extends BaseComponent
{
    masterDataService:MasterDataService;
    constructor(props) {
        super(props, true);
        this.masterDataService = this.getServices().masterDataService;
    }

    get modelName  () : string   {
        return this.props.modelName;
    }
    getRecord = () : BaseEntity => {
        const rec = this.props.record;
        if (!rec) {
            alert("this.props.record undefined");
            return {};
        }
        return rec;
    }
    recordLoaded = (response:WebResponse) => {
        if (this.props.recordLoaded) {
            this.props.recordLoaded(response.item);
        }
    }
    recordLoadedForDetail = (response:WebResponse) => {
        if (this.props.recordLoadedForDetail) {
            this.props.recordLoadedForDetail(response.item);
        }
    }
    recordDeleted = (response:WebResponse) => {
        this.showInfo("Record has been deleted");
        if (this.props.recordDeleted) {
            this.props.recordDeleted(response.item);
        }
    }
    get loadRecordRequest():WebRequest {
        const req :WebRequest = {
            record_id : this.getRecord().id,
            modelName : this.modelName
        }
        return req;
    }
    loadRecord = () => {
        
        this.commonAjax(
            this.masterDataService.getOne,
            this.recordLoaded,
            this.showCommonErrorAlert,
            this.loadRecordRequest
        )
    }
    loadRecordForDetail = () => {

        this.commonAjax(
            this.masterDataService.getOne,
            this.recordLoadedForDetail,
            this.showCommonErrorAlert,
            this.loadRecordRequest
        )
    }
    deleteRecord = () => {
        this.showConfirmationDanger("Delete record?")
        .then(ok=>{
            if (!ok) return;
            this.commonAjax(
                this.masterDataService.delete,
                this.recordDeleted,
                this.showCommonErrorAlert,
                this.loadRecordRequest
            )
        })
    }
    hasType = (type:string):boolean => {
        if (!this.props.types) return false;
        return  (this.props.types as string[]).indexOf(type) >= 0;
    }
    render() {
        const types:string[] | undefined = this.props.types ?? undefined;
        return (
            <div className="btn-group">
                {this.hasType('detail') ?
                    <AnchorWithIcon onClick={this.loadRecordForDetail} iconClassName="fas fa-info-circle" className="btn btn-info btn-sm"/>
                    :
                    null}
                {types === undefined || this.hasType('edit') ?
                    <AnchorWithIcon onClick={this.loadRecord} iconClassName="fas fa-edit" className="btn btn-warning btn-sm"/>
                    :
                    null}
                {types === undefined || this.hasType('delete') ?
                    <AnchorWithIcon onClick={this.deleteRecord} iconClassName="fas fa-times" className="btn btn-danger btn-sm"/>
                    :
                    null}
               
            </div>
        )
    }
}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(EditDeleteButton)
)