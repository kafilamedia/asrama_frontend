import { commonAjaxPostCalls, commonAjaxPostCallsWithBlob } from './Promises';
import { contextPath } from '../constant/Url';
import PointRecord from './../models/PointRecord';
import AttachmentInfo from './../models/settings/AttachmentInfo';
import WebRequest from './../models/commons/WebRequest';
import MedicalRecord from './../models/MedicalRecord';
import WebResponse from '../models/commons/WebResponse';
export default class StudentService {
    
   

    private static instance?: StudentService;

    static getInstance(): StudentService {
        if (this.instance == null) {
            this.instance = new StudentService();
        }
        return this.instance;
    }
    public submitPointRecord(pointRecord: PointRecord, attachmentInfo?:AttachmentInfo|undefined) {
        if (attachmentInfo) {
            attachmentInfo.data = "";
        }
        const req:WebRequest = {
            pointRecord: pointRecord,
            attachmentInfo: attachmentInfo
        }
        return commonAjaxPostCalls(contextPath() + "api/dormitorymanagement/submitpointrecord", req);
    }
    public getClasses() :Promise<WebResponse> {
        return commonAjaxPostCalls(contextPath() + "api/dormitorymanagement/classes", {});
    }
    public getCategories() :Promise<WebResponse> {
        return commonAjaxPostCalls(contextPath() + "api/dormitorymanagement/rulecategories", {});
    }
    public followUp = (pointRecordId:number):Promise<WebResponse> => {
        return commonAjaxPostCalls(contextPath() + "api/dormitorymanagement/followup", {
            record_id:pointRecordId
        });
    }
    public getFollowUpReminders = ():Promise<WebResponse> => {
        return commonAjaxPostCalls(contextPath() + "api/dormitorymanagement/followupreminders", {});
    }
    public getRaporData = (classId: string) :Promise<WebResponse> => {
        return commonAjaxPostCalls(contextPath() + `api/report/studentdata/${classId}`, {});
    }
    public downloadRaporData = (classId: string) :Promise<any> => {
        // return commonAjaxPostCallsWithBlob(endpoint, request);
        return commonAjaxPostCallsWithBlob(contextPath() + `api/report/downloaddata/${classId}`, {});
    }
    

    public submitMedicalRecord = (record:MedicalRecord) => {
        const req:WebRequest = {
            medicalRecord: record
        }
        return commonAjaxPostCalls(contextPath() + "api/dormitorymanagement/submitmedicalrecord", req)
    }
    public loadMonthlyMedicalRecord = (studentId:number, month:number, year:number) => {
        const req:WebRequest = {
            filter: {
                year:year, month:month,
                fieldsFilter: {student_id:studentId}
            }
        }
        return commonAjaxPostCalls(contextPath() + "api/dormitorymanagement/monthlymedicalrecord", req)
    }

    public setPointDropped = (id: number, dropped: boolean) => {
        return commonAjaxPostCalls(contextPath() + "api/dormitorymanagement/droppoint", { 
            pointRecord : {
                id: id,
                dropped_at: dropped?new Date():null
            }
        });
    }

    /**
     * pemutihan
     * @param recordIdArray 
     */
    public dropAll = (recordIdArray: any[]) => {
        return commonAjaxPostCalls(contextPath() + "api/dormitorymanagement/droppointall", { 
            items : recordIdArray});
    }
    /**
     * reset pemutihan
     * @param recordIdArray 
     */
    public undropAll = (recordIdArray: any[]) => {
        return commonAjaxPostCalls(contextPath() + "api/dormitorymanagement/undroppointall", { 
            items : recordIdArray});
    }
     
}