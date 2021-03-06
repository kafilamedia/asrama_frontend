import React, { ChangeEvent } from 'react'
import BaseManagementPage from './BaseManagementPage';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import WarningAction from '../../../models/WarningAction';
import Filter from './../../../models/commons/Filter';
import WebRequest from './../../../models/commons/WebRequest';
import FormGroup from './../../form/FormGroup';
import NavigationButtons from './../../navigation/NavigationButtons';
import { tableHeader } from './../../../utils/CollectionUtil';
import EditDeleteButton from './EditDeleteButton';
import Class from './../../../models/Class';
import Modal from './../../container/Modal';
import StudentSearchForm from '../shared/StudentSearchForm';
import Student from './../../../models/Student';
import BaseEntity from './../../../models/BaseEntity';
class State {
    items: WarningAction[] = [];
    filter: Filter = new Filter();
    totalData: number = 0;
    record: WarningAction = new WarningAction();

}
class WarningActionManagement extends BaseManagementPage {

    state:State = new State();
    constructor(props) {
        super(props, 'warningaction');
    }
    setStudent = (s:Student) => {
        const record = this.state.record;
        record.student = s;
        record.student_id = s.id;
        this.setState({record: record});
    }
    emptyRecord = (): BaseEntity => {
        return new WarningAction();
    }
    onSubmit = () => {
        if (!this.state.record.student_id) {
            this.showError("Input tidak lengkap");
            return;
        }
        this.showConfirmation("Submit Data?")
            .then(ok => {
                if (!ok) return;
                this.callApiSubmit({
                    warningAction: this.state.record,
                    modelName: this.modelName
                });
            })
    }
    render() {
        const filter: Filter = this.state.filter;
        return (
            <div className="container-fluid section-body">
                <h2>Peringatan</h2>
                <hr />
                {this.isAdmin()?
                <RecordForm formRef={this.formRef} setStudent={this.setStudent} resetForm={this.resetForm} onSubmit={this.onSubmit} record={this.state.record} updateRecordProp={this.updateRecordProp} />
                :null}
                <form onSubmit={this.reload}>
                    <FormGroup label="Cari">
                        <select name="name"   className="form-control-sm" value={filter.fieldsFilter['name']?? ""} onChange={this.updateFieldsFilter}>
                            <option value="">Semua</option>
                            <option>SP1</option>
                            <option>SP2</option>
                            <option>SP3</option>
                        </select>
                        <input name="student_name" placeholder="nama siswa" className="form-control-sm" value={filter.fieldsFilter['student_name']?? ""} onChange={this.updateFieldsFilter} />
                    </FormGroup>
                    <FormGroup label="Jumlah Tampilan">
                        <input name="limit" type="number" className="form-control-sm" value={filter.limit ?? 5} onChange={this.updateFilter} />
                    </FormGroup>
                    <FormGroup>
                        <input className="btn btn-primary btn-sm" type="submit" value="Submit" />
                    </FormGroup>
                </form>
                <NavigationButtons activePage={filter.page ?? 0} limit={filter.limit ?? 10} totalData={this.state.totalData}
                    onClick={this.loadAtPage} />
                <ItemsList  items={this.state.items}  isAdmin={this.isAdmin()}
                    recordLoaded={this.oneRecordLoaded} recordDeleted={this.loadItems}
                    startingNumber={(filter.page??0)*(filter.limit ?? 10)} />
            </div>
        )
    }

}
interface ItemProps {isAdmin:boolean ,startingNumber:number, items:WarningAction[], recordLoaded(item:any), recordDeleted()}
const ItemsList = (props: ItemProps) => {

    return (
        <div style={{overflow:'scroll'}}>
        <table className="table table-striped">
            {tableHeader("No", "Siswa", "Kelas", "Nama", "Deskripsi", "Tgl Simpan", "Opsi")}
            <tbody>
                    {props.items.map((item:WarningAction, i)=>{

                        return (
                            <tr key={"category-"+i}>
                                <td>{i+1+props.startingNumber}</td>
                                <td>{item.student?.user?.name}</td>
                                <td>{Class.studentClassString(item.student)}</td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.created_at}</td>
                                <td>{props.isAdmin?
                                    <EditDeleteButton 
                                        recordLoaded={props.recordLoaded}
                                        recordDeleted={props.recordDeleted}
                                        record={item} modelName={'warningaction'}/>:null}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
        </table>
        </div>
    )
}
const RecordForm = (props: { formRef:React.RefObject<Modal>, setStudent(s:Student), updateRecordProp(e: ChangeEvent): any, resetForm():any, onSubmit(): any, record: WarningAction }) => {
    const record = props.record;
    return (
        <div className="record-form mb-3" >
            <Modal show={false} ref={props.formRef} toggleable={true} title="Record Form" >
                <FormGroup label="Siswa">
                    <StudentSearchForm selectItem={props.setStudent} />
                    
                </FormGroup>
                {record.student?
                        <FormGroup children={record.student.user?.name+ " " +Class.studentClassString(record.student)} />:null
                    }
                <form onSubmit={(e) => { e.preventDefault(); props.onSubmit() }}>
                <FormGroup label="Nama">
                    <select required value={record.name  } onChange={props.updateRecordProp} className="form-control" name="name" >
                        <option>SP1</option>
                        <option>SP2</option>
                        <option>SP3</option>
                    </select>
                </FormGroup>
                <FormGroup label="Deskripsi">
                    <textarea required className="form-control" name="description" onChange={props.updateRecordProp} value={record.description ?? ""} />
                </FormGroup>
                <FormGroup>
                    <input type="submit" value="Submit" className="btn btn-primary btn-sm" />
                    &nbsp;
                    <input type="reset"   className="btn btn-secondary btn-sm" onClick={(e)=>props.resetForm()} />
                </FormGroup>
                </form>
            </Modal>
        </div>
    )
}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(WarningActionManagement)
)