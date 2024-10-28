import * as fileType from 'file-type';
export const getFileType = async (file)=>{
        const buffer = await file.arrayBuffer();
        const type = await fileType.fileTypeFromBuffer(buffer);
        if(!type){
          return 'unknown';
        }
        return type.mime;
}
