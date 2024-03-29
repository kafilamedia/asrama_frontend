
import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import Student from '../../../models/Student';
import AnchorWithIcon from '../../navigation/AnchorWithIcon';
import Modal from '../../container/Modal';
import FormStepThree from './form/FormStepThree';
import FormStepTwo from './form/FormStepTwo';
import FormStepOne from './form/FormStepOne';
import Category from '../../../models/Category';
import RulePoint from '../../../models/RulePoint';
import SimpleError from '../../alert/SimpleError';
import PointRecord from '../../../models/PointRecord';
import StudentService from '../../../services/StudentService';
import WebResponse from '../../../models/commons/WebResponse';
import FormGroup from '../../form/FormGroup';
import { doItLater } from '../../../utils/EventUtil';
import AttachmentInfo from '../../../models/settings/AttachmentInfo';
import BasePage from '../BasePage';
import { resolve } from 'inversify-react';
class State {
  student?: Student
  category?: Category;
  rulePoint?: RulePoint;
  formStep: number = 0;
  savedRecord?: PointRecord;
  attachmentInfo?: AttachmentInfo;
}
class InputPointForm extends BasePage<any, State> {
  state: State = new State();
  @resolve(StudentService)
  private studentService: StudentService;
  totalStep: number = 4;
  constructor(props) {
    super(props, 'Input Point Record', true);
  }
  validateStudentData = () => {
    if (!this.props.location.state) {
      return;
    }
    const student = this.props.location.state.student;
    if (student) {
      this.setState({ student: Object.assign(new Student(), student) });
    }
  }
  componentDidMount() {
    super.componentDidMount();
    this.validateStudentData();
    this.scrollTop();
    doItLater(() => {
      this.nextStep(1);
    }, 200);

  }
  setAttachment = (attachmentInfo: AttachmentInfo | undefined) => {
    this.setState({ attachmentInfo: attachmentInfo });
  }
  removeStudent = () => {
    this.setState({ formStep: 0 }, () => {
      doItLater(() => {
        this.setState({ student: undefined })
      }, 500);
    })
  }
  removeAttachment = () => {
    this.setAttachment(undefined);
  }
  setCategory = (c: Category) => {
    this.setState({ category: c });
  }
  setRulePoint = (r: RulePoint) => {
    this.setState({ rulePoint: r });
  }
  nextStep = (step: number) => {
    this.setState({ formStep: step });
  }
  submitRecord = (record: PointRecord) => {

    if (!this.state.student || !this.state.rulePoint) {
      alert("ERROR: student or rulePoint missing!");
      return;
    }
    record.classMemberId = this.state.student?.id;
    record.rulePointId = this.state.rulePoint?.id;
    this.commonAjax(
      this.studentService.insertPointRecord,
      this.recordSubmitted,
      this.showCommonErrorAlert,
      record,
      this.state.attachmentInfo
    )
  }
  recordSubmitted = (response: WebResponse) => {
    this.setState({ savedRecord: response.result, formStep: 4 }, this.scrollTop);
  }
  render() {
    const student: Student | undefined = this.state.student;
    if (!student) {
      return <Warning />
    }

    return (
      <div className="container-fluid section-body">
        <h2>Form Input Pelanggaran</h2>
        <Modal title={student.name + " - " + student.classLevel + student.classLetter + " " + student.schoolName}>
          <Progress step={this.state.formStep} totalStep={this.totalStep} />
          {
            this.state.formStep == 1 &&
            <FormStepOne
              category={this.state.category}
              onBack={this.removeStudent}
              setSelectedCategory={this.setCategory}
              onSubmit={() => { this.nextStep(2) }}
            />
          }
          {
            this.state.formStep == 2 && this.state.category &&
            <FormStepTwo
              rulePoint={this.state.rulePoint}
              setRulePoint={this.setRulePoint}
              category={this.state.category}
              onBack={() => this.nextStep(1)}
              onSubmit={() => { this.nextStep(3) }}
            />
          }
          {
            this.state.formStep == 3 && this.state.category && this.state.rulePoint &&
            <FormStepThree
              submit={this.submitRecord}
              attachmentInfo={this.state.attachmentInfo}
              setAttachment={this.setAttachment}
              removeAttachment={this.removeAttachment}
              rulePoint={this.state.rulePoint}
              onBack={() => this.nextStep(2)}
            />
          }
          {
            this.state.formStep == 4 &&
            this.state.savedRecord &&
            <Detail
              back={() => this.setState({ student: undefined })}
              record={this.state.savedRecord}
            />
          }

        </Modal>
      </div>
    )
  }
}

const Progress = (props: { step: number, totalStep: number }) => {
  return (
    <div className="progress" style={{ height: '5px', marginBottom: 15 }}>
      <div className="bg-info" style={{ transitionDuration: '500ms', width: (props.step / props.totalStep * 100) + '%' }}  ></div>
    </div>
  )
}

const Detail = (props: { record: PointRecord, back(): any }) => {
  const record = PointRecord.clone(props.record);
  const date = record.getDate();
  return (
    <div>
      <h4 className="text-center text-success"><i className="fas fa-check" style={{ marginRight: 5 }} />Record saved</h4>
      <p />
      <FormGroup label="Date">{new Date(record.time).toLocaleString()}</FormGroup>
      <FormGroup label="Category">{record.ruleCategoryName}</FormGroup>
      <FormGroup label="Name">{record.ruleName}</FormGroup>
      <FormGroup label="Point">{record.point}</FormGroup>
      <FormGroup label="Location">{record.location}</FormGroup>
      {
        record.getPicture() &&
        <FormGroup label="Picture">
          <img src={record.getPicture() ?? ''} width={200} height={200} />
        </FormGroup>
      }
      <hr />
      <FormGroup>
        <a onClick={props.back} className="btn btn-dark">Ok</a>
      </FormGroup>
    </div>
  )
}

const Warning = () => {
  return (
    <div className="container-fluid section-body">
      <h2>Form Input Pelanggaran</h2>
      <SimpleError>
        <i className="fas fa-exclamation-circle mr-2" />
        <span>Please select student</span>
        <hr />
        <AnchorWithIcon to="/asrama/studentlist" iconClassName="fas fa-list">
          Student List
        </AnchorWithIcon>
      </SimpleError>
    </div>
  )
}

export default withRouter(connect(mapCommonUserStateToProps)(InputPointForm));
