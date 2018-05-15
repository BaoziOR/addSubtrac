var constValue = require('./constValue.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var getDayGetDollNumKey = function() {
  var date = new Date();
  var num = date.getFullYear() * 1000 + date.getMonth() * 100 + date.getDate();
  return constValue.dayGotAllDollNum + num;
}

var getYMD = function() {
  var date = new Date();
  var num = date.getFullYear() * 1000 + date.getMonth() * 100 + date.getDate();
  return num;
}

module.exports = {
  formatTime: formatTime,
  getDayGetDollNumKey: getDayGetDollNumKey,
  getYMD: getYMD
}
