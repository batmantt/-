const app = getApp().globalData;
import { ERR_OK } from './config'
import { showToast, userSign } from './api'

let d = new Date();

function addDateInfo (list) {
  // 今天是星期几
  let today = d.getDay();
  // 今天是几号
  let day = d.getDate();
  // 这周是从几号开始的
  let startDay = '';
  // 这周是几号结束的
  let endDay = '';
  // console.log(list)
  // 先创建一个数组，这个数组的每一项是list对应的日期（日）
  list.forEach((value, index) => {
    let tempDate = value.date.substring(8, 10);
    value.id = index;
    value.day = tempDate;
    let tempMonth = value.date.substring(5, 7);
    addIsThisMonth(tempMonth, index);
    if (tempDate == day) {
      if (!value.isPass) {
        userSign({
          userOpenId: app.userInfo.token
        }).then(res => {
          showToast('签到成功')
        })
      }
      list[index].isPass = true
      switch (today) {
        case 1:
          addIsThisWeek(index, index + 7)
          break;
        case 2:
          addIsThisWeek(index - 1, index + 6)
          break;
        case 3:
          addIsThisWeek(index - 2, index + 5)
          break;
        case 4:
          addIsThisWeek(index - 3, index + 4)
          break;
        case 5:
          addIsThisWeek(index - 4, index + 3)
          break;
        case 6:
          addIsThisWeek(index - 5, index + 2)
          break;
        default:
          addIsThisWeek(index - 6, index + 1)
      }
    }
  })
  // console.log(list)
  return list
  // 映射是否本周
  function addIsThisWeek(start, end) {
    for (var i = start; i < end; i++) {
      list[i].isThisWeek = true
    }
  }
  // 映射是否本月
  function addIsThisMonth(tempMonth, idx) {
    const thisMonth = d.getMonth() + 1;
    if (tempMonth == thisMonth) {
      list[idx].isThisMonth = true
    }
  }
}


export { addDateInfo }