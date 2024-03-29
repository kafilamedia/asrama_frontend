export default class AttachmentInfo {
    setUrl(arg0: string) {
        this.url = arg0;
        this.data = arg0.split(",")[1];
    }
    static nameOnly(name: any) {
        const info = new AttachmentInfo();
        info.name = name;
        return info;
    }
    static instance(name: any, url: string) {
        const info = new AttachmentInfo();
        info.name = name;
        info.url = url;
        return info;
    }
    constructor(public file?: File) {
        //
    }
    name: string = "";
    blob: Blob = new Blob();
    url: string = "";
    data: string = "";
}