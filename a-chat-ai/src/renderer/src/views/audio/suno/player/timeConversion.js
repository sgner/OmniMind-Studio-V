const TimeToString = (seconds) => {
  let param = parseInt(seconds);
  let hh = "",
    mm = "",
    ss = "";
  if (param >= 0 && param < 60) {
    param < 10 ? (ss = "0" + param) : (ss = param);
    return "00:" + ss;
  } else if (param >= 60 && param < 3600) {
    mm = parseInt(param / 60);
    mm < 10 ? (mm = "0" + mm) : mm;
    param - parseInt(mm * 60) < 10 ?
      (ss = "0" + String(param - parseInt(mm * 60))) :
      (ss = param - parseInt(mm * 60));
    return mm + ":" + ss;
  }
}
const TimeToSeconds = (time)=>{
  if (!time.startsWith('[') || !time.endsWith(']')) {
    throw new Error('Invalid time format: missing brackets');
  }
  const cleanTime = time.slice(1, time.length - 1);
  const parts = cleanTime.split(':');
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    throw new Error('Invalid time format: should be mm:ss');
  }
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  return minutes * 60 + seconds;
}
export  {
  TimeToString,
  TimeToSeconds
};
