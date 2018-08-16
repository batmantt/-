//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    data: 0,
  },
  onLoad: function () {
      var d = new Date(1527670642000);
      var dformat = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
        + ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
      console.log(dformat);
      this.setData({
        data: dformat
      })
  },
})
