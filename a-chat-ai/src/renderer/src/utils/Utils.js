import dayjs from "dayjs";
dayjs.locale('zh-cn')
const isEmpty = (str)=>{
  return str === null || str === undefined || str === "";
}
const formatDate = (timestamp) => {
  const timestampTime = dayjs(Math.floor(timestamp));
  const currentTime = dayjs(); // 获取当前时间
  const days = currentTime.diff(timestampTime, 'day'); // 计算两个时间之间的天数差

  if (days === 0) {
    return timestampTime.format('HH:mm'); // 同一天，返回小时分钟
  } else if (days === 1) {
    return "昨天"; // 昨天
  } else if (days >= 2 && days < 7) {
    return timestampTime.format('dddd'); // 过去一周内的时间，返回星期几
  } else {
    return timestampTime.format('YYYY/MM/DD'); // 更早的日期，返回完整日期格式
  }
};
const formatTimeArray = (timeArray) => {
  // 将月份减 1，以适应 JavaScript Date 对象的 0-11 规则
  const adjustedTimeArray = [...timeArray];
  adjustedTimeArray[1] = timeArray[1] - 1; // 将月份减 1

  const date = new Date(...adjustedTimeArray.slice(0,6));

  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false // 24小时制
  };

  return date.toLocaleString('zh-CN', options);
};

export default {
  isEmpty,
  formatDate,
  formatTimeArray
}
