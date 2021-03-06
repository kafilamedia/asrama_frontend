import React, { ChangeEvent } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import Student from '../../../models/Student';
import StudentService from '../../../services/StudentService';
import Filter from '../../../models/commons/Filter';
import WebResponse from '../../../models/commons/WebResponse';
import Class from '../../../models/Class';
import FormGroup from '../../form/FormGroup';
import NavigationButtons from '../../navigation/NavigationButtons';
import { tableHeader } from '../../../utils/CollectionUtil';
import AnchorWithIcon from '../../navigation/AnchorWithIcon';
import MasterDataService from '../../../services/MasterDataService';
import BaseManagementPage from '../management/BaseManagementPage';
import Spinner from '../../loader/Spinner';
import FilterPeriod from '../../form/FilterPeriod';
import { MONTHS } from '../../../utils/DateUtil';
import ToggleButton from '../../navigation/ToggleButton';
class State {
    items: Student[] = [];
    classes: Class[] = [];
    totalData: number = 0;
    filter: Filter = new Filter();
    loading: boolean = false;
}
class StudentList extends BaseManagementPage {
    state: State = new State();
    studentService: StudentService;
    masterDataService: MasterDataService;
    constructor(props) {
        super(props, 'student');
        this.studentService = this.getServices().studentService;
        this.masterDataService = this.getServices().masterDataService;
        this.state.filter.limit = 10;
        this.state.filter.day = this.state.filter.dayTo = new Date().getDate();
        this.state.filter.month = this.state.filter.monthTo = new Date().getMonth() + 1;
        this.state.filter.year = this.state.filter.yearTo = new Date().getFullYear();
        this.state.filter.fieldsFilter = {
            'class_id': '',
            'with_point_record': false
        }
    } 
    itemsLoaded = (response: WebResponse) => {
        this.setState({ items: response.items, totalData: response.totalData });
    }
    classesLoaded = (response: WebResponse) => {
        this.setState({ classes: response.items }, this.loadItems);
    }
    loadItems = () => {
        this.commonAjax(
            this.masterDataService.list,
            this.itemsLoaded,
            this.showCommonErrorAlert,
            { modelName: 'student', filter: this.state.filter }
        )
    }
    loadAtPage = (page: number) => {
        const filter = this.state.filter;
        filter.page = page;
        this.setState({ filter: filter }, this.loadItems);
    }
    loadClasses = () => {
        this.commonAjax(
            this.studentService.getClasses,
            this.classesLoaded,
            this.showCommonErrorAlert,
        )
    }
    componentDidMount() {
        this.validateLoginStatus(() => {
            this.scrollTop();
            this.loadClasses();
        })
    }
    updateSelectedClass = (e: ChangeEvent) => {
        const target = e.target as HTMLSelectElement;
        const filter = this.state.filter;
        if (!filter.fieldsFilter) {
            filter.fieldsFilter = {};
        }
        filter.fieldsFilter['class_id'] = target.value;
        this.setState({ filter: filter });
    }
    inputPage = (type: string, s: Student) => {
        switch (type) {
            case 'pointrecord':
                this.inputPoint(s);
                break;
            case 'medicalrecord':
                this.inputMedicalRecord(s);
                break;
            default:
                break;
        }
    }
    inputPoint = (student: Student) => {
        this.props.history.push({
            pathname: "/asrama/inputpoint",
            state: { student: student }
        })
    }
    inputMedicalRecord = (student: Student) => {
        this.props.history.push({
            pathname: "/asrama/medicalrecord",
            state: { student: student }
        })
    }
    updateWithPointRecord = (val: boolean) => {
        const filter = this.state.filter;
        if (filter.fieldsFilter) {
            filter.fieldsFilter['with_point_record'] = val;
        }
        this.setState({ filter: filter });
    }
    onSubmit = (e) => { e.preventDefault(); this.loadAtPage(0) }
    render() {

        const filter = this.state.filter;
        const classes = this.state.classes;
        const defaultClass: Class = { id: "", level: "Semua Kelas", sekolah: {} };
        const selectedClassId = filter.fieldsFilter && filter.fieldsFilter['class_id'] ? filter.fieldsFilter['class_id'] : "";
        const showPointRecord = filter.fieldsFilter && filter.fieldsFilter['with_point_record'] && filter.fieldsFilter['with_point_record'] == true;
        return (
            <div className="container-fluid section-body">
                <h2>Siswa</h2>
                <hr />
                <form onSubmit={this.onSubmit}>
                    <FormGroup label="Cari">
                        <div className="input-group">
                            <input name="name" placeholder="Nama" className="form-control-sm" value={filter.fieldsFilter ? filter.fieldsFilter['name'] : ""} onChange={this.updateFieldsFilter} />
                            <select value={selectedClassId} onChange={this.updateFieldsFilter} className="form-control-sm" name="class_id">
                                {[defaultClass, ...classes].map((c) => {
                                    return <option key={'class_' + c.id} value={c.id}>{c.level}{c.rombel} - {c.sekolah?.nama}</option>
                                })}
                            </select>
                        </div>
                    </FormGroup>
                    <FormGroup label="Jumlah Tampilan">
                        <input name="limit" type="number" className="form-control-sm" value={filter.limit ?? 5} onChange={this.updateFilter} />
                    </FormGroup>
                    <FormGroup label="Periode">
                        <ToggleButton active={showPointRecord}
                            yesLabel={"tampilkan poin"} noLabel="tanpa poin"
                            onClick={this.updateWithPointRecord}
                        />
                        {showPointRecord ?
                            <React.Fragment>
                                <div className="input-group">
                                    <FilterPeriod filter={filter} onChange={this.updateFilter} />
                                </div>
                                <div className="input-group">
                                    <FilterPeriod mode={"to"} filter={filter} onChange={this.updateFilter} />
                                </div>
                            </React.Fragment> : null}
                    </FormGroup>
                    {showPointRecord ?
                        <FormGroup>
                            {filter.day} {MONTHS[(filter.month ?? 1) - 1]} {filter.year} - {filter.dayTo} {MONTHS[(filter.monthTo ?? 1) - 1]} {filter.yearTo}
                        </FormGroup>
                        : null}
                    <FormGroup>
                        <input type="submit" className="btn btn-primary btn-sm" value="Submit" />
                    </FormGroup>

                </form>
                <p />
                <NavigationButtons onClick={this.loadAtPage} activePage={filter.page ?? 0} limit={filter.limit ?? 10} totalData={this.state.totalData} />
                <ItemsList showPointRecord={showPointRecord} loading={this.state.loading} inputPage={this.inputPage} startingNumber={(filter.page ?? 0) * (filter.limit ?? 10)} items={this.state.items} />
            </div>
        )
    }
}

const ItemsList = (props: { showPointRecord: boolean, loading: boolean, startingNumber: number, inputPage(type: string, s: Student): any, items: Student[] }) => {

    return (
        <div style={{ overflow: 'scroll' }}>
            <table className="table table-striped">
                {props.showPointRecord ? tableHeader("No", "", "Name", "Kelas", "Point") : tableHeader("No", "", "Name", "Kelas")}
                <tbody>
                    {props.loading ?
                        <tr><td colSpan={5}><Spinner /></td></tr>

                        : props.items.map((student, i) => {

                            return (
                                <tr key={"student-" + i}>
                                    <td>{i + 1 + props.startingNumber}</td>
                                    <td>
                                        <div style={{ width: '100px' }}>
                                            <AnchorWithIcon className="btn" onClick={(e) => props.inputPage('pointrecord', student)} iconClassName="far fa-edit" />
                                            <AnchorWithIcon className="btn" onClick={(e) => props.inputPage('medicalrecord', student)} iconClassName="fas fa-notes-medical" />
                                        </div>
                                    </td>
                                    <td>
                                        {student.user?.name}</td>
                                    <td>{student.kelas?.level} {student.kelas?.rombel} {student.kelas?.sekolah?.nama}</td>
                                    {props.showPointRecord ? <td>{student.point}</td> : null}
                                </tr>
                            )
                        })}
                </tbody>
            </table>
        </div>
    )
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(StudentList))