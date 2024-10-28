import {
  run,
  queryOne,
  queryCount,
  queryAll,
  insertOrReplace,
  insert,
  insertOrIgnore,
  update,
} from "./ADB";
import store from "../store";
import {updateNoReadCount} from "./ChatSessionModel";
const saveMessage = (data)=>{
     data.question.userId = store.getUserId();
     let answers = data.answers;
     answers.forEach(answer=>{
         insertOrReplace("answers",answer)
     })
     insertOrReplace("conversations",data.question);
}

const saveMessageBatch = (messageList)=>{
  return new Promise(async (resolve, reject) => {
      const chatSessionCountMap  = {};
      messageList.forEach(item => {
           let answers = item.answers;
           answers.forEach( answer =>{
                 let robotId = answer.answerRobotType === 1? answer.groupId: answer.answerRobotId;
                 let noReadCount = chatSessionCountMap[robotId];
                 if(!noReadCount){
                     chatSessionCountMap[robotId]= 1;
                 }else{
                   chatSessionCountMap[robotId] = noReadCount + 1;
                 }
             }
           )
      })
       for(let item in chatSessionCountMap){
            await updateNoReadCount({robotId:item,noReadCount:chatSessionCountMap[item]})
       }

       for (const item of messageList) {
            await saveMessage(item)
         }
  })
}

const selectMessageList = (query)=>{
   return new Promise(async (resolve,reject)=>{
          const {sessionId,pageNo,maxMessageId} = query;
          let sql = "select count(*) from conversations where session_id= ? and user_id= ?";
          const totalCount = await queryCount(sql,[sessionId,store.getUserId()])
          const {pageTotal,offset,limit} = getPageOffset(pageNo,totalCount);
          const params = [sessionId,store.getUserId()]
          sql = "SELECT \n" +
            "              conv.id AS conv_id, \n" +
            "              conv.create_time AS conv_create_time, \n" +
            "              conv.status AS conv_status,\n" +
            "              conv.files AS conv_files,\n" +
            "              conv.session_id AS conv_session_id,\n" +
            "              conv.question,\n" +
            "\t\t\t\t\t\t\tconv.question_type,\n" +
            "\t\t\t\t\t\t\tconv.user_id,\n" +
            "\t\t\t\t\t\t\tconv.user_name, \n" +
            "              ans.id AS ans_id, \n" +
            "              ans.create_time AS ans_create_time, \n" +
            "              ans.status AS ans_status,\n" +
            "              ans.file_size AS ans_file_size,\n" +
            "              ans.file_name AS ans_file_name,\n" +
            "              ans.file_path AS ans_file_path,\n" +
            "              ans.file_type AS ans_file_type,\n" +
            "              ans.session_id AS ans_session_id,\n" +
            "              ans.answer,\n" +
            "\t\t\t\t\t\t\tans.answer_robot_id,\n" +
            "\t\t\t\t\t\t\tans.answer_robot_name,\n" +
            "\t\t\t\t\t\t\tans.answer_robot_type,\n" +
            "\t\t\t\t\t\t\tans.conversation_id,\n" +
            "\t\t\t\t\t\t\tans.group_id,\n" +
            "\t\t\t\t\t\t\tans.answer_type\n" +
            "           FROM conversations conv \n" +
            "           LEFT JOIN answers ans \n" +
            "           ON conv.id = ans.conversation_id where conv.session_id = ? and conv.user_id = ?"
          if(maxMessageId){
             sql += "and conv.id<=?"
             params.push(maxMessageId)
          }
          params.push(offset)
          params.push(limit)
          sql += "order by conv.id DESC limit ?,?";
          const preList = await queryAll(sql,params);
          const messageList = transformData(preList);
          resolve({messageList:messageList,pageTotal:pageTotal,pageNo:pageNo})
   })
}

const getPageOffset = (pageNo = 1,totalCount)=>{
    const pageSize = 40;
    const pageTotal = totalCount % pageSize === 0 ? totalCount / pageSize : Math.floor(totalCount / pageSize) + 1;
    pageNo = pageNo< 1? 1 : pageNo;
    pageNo = pageNo > pageTotal? pageTotal : pageNo;
    return {
       pageTotal,
       offset: (pageNo - 1) * pageSize,
       limit: pageSize
    }
}

const transformData = (data) => {
  const result = [];
  const questionsMap = {};

  data.forEach(item => {
    if (!questionsMap[item.convId]) {
      questionsMap[item.convId] = {
        question: {
          id: item.convId,
          createTime: item.convCreateTime,
          status: item.convStatus,
          files: item.convFiles,
          question: item.question,
          questionType: item.questionType,
          userId: item.userId,
          userName: item.userName,
          answers: []
        }
      };
      result.push(questionsMap[item.convId]);
    }

    questionsMap[item.convId].question.answers.push({
      id: item.ansId,
      createTime: item.ansCreateTime,
      status: item.ansStatus,
      fileSize: item.ansFileSize,
      fileName: item.ansFileName,
      filePath: item.ansFilePath,
      fileType: item.ansFileType,
      sessionId: item.ansSessionId,
      answer: item.answer,
      answerRobotId: item.answerRobotId,
      answerRobotName: item.answerRobotName,
      answerRobotType: item.answerRobotType,
      conversationId: item.conversationId,
      groupId: item.groupId,
      answerType: item.answerType
    });
  });

  return result;
};
export {saveMessageBatch,selectMessageList,saveMessage};
