// pages/apply_code/apply_code.js
import { ERR_OK, base_url } from '../../utils/config'
import { showLoading, hideLoading, showToast, listAddress } from '../../utils/api'
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: null,
    back_name: null,
    phnumber: null,
    id_card: null,
    flag: false,
    apply_suc: false,
    codeUrl: null,
    updatedAt: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      back_name: options.back_name
    })
    this.judege_apply()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 获取输入银行
  backnameInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      back_name: e.detail.value
    })
  },
  //获取姓名
  nameInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },
  //获取手机号码
  phnumberInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      phnumber: e.detail.value
    })
  },
  //获取身份证号码
  idcardInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      id_card: e.detail.value
    })
  },
  //申请我的二维码按钮
  _apply_code: function () {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    console.log(this.data.name)
    if (this.data.name == null || this.data.name == ' ' || this.data.name == '') {
      showToast("姓名不能为空！")
    } else if (!myreg.test(this.data.phnumber)) {
      showToast("手机号格式有误!")
    }
    else if (this.data.id_card == null || this.data.id_card == ' ' || this.data.id_card == '') {
      showToast("身份证号有误")
    } else {
      wx.request({
        url: base_url + '/tg/wx/user/addCode',
        header: {
          'content-type': 'application/json',
        },
        method: 'POST',
        data: {
          "regName": this.data.name,
          "codeType": this.data.back_name,
          "phoneNum": this.data.phnumber,
          "idCard": this.data.id_card,
          "userOpenId": app.userInfo.user.userOpenId,
        },
        success: res => {
          console.log(res);
          if (res.data.code == 200) {
            wx.showToast({
              title: '提交成功',
              icon: 'seccess',
              image: '',
              duration: 1000,
              mask: true,
              success: res => {
                this.setData({
                  flag: false
                })
                this.apply_success()
              },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else {
            showToast("申请失败，请重试！")
          }
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }
  },
  //判断是否申请
  judege_apply: function () {
    console.log(this.data.back_name)
    wx.request({
      url: base_url + '/tg/wx/user/judgement',
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      data: {
        "codeType": this.data.back_name,
        "userOpenId": app.userInfo.user.userOpenId,
      },
      success: res => {
        console.log("判断是否申请")
        console.log(res);
        if (res.data.data == '0') {
          console.log("没有申请")
          this.setData({
            flag: true
          })
        } else {
          console.log("已经申请")
          this.apply_success()
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  //审核是否完成
  apply_success: function () {
    console.log(this.data.back_name)
    wx.request({
      url: base_url + '/tg/wx/user/listOne',
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      data: {
        "codeType": this.data.back_name,
        "userOpenId": app.userInfo.user.userOpenId,
      },
      success: res => {
        console.log("审核是否完成")
        console.log(res)
        var s = new Date(res.data.data.updatedAt);
        var dformat = [s.getFullYear(), this.p(s.getMonth() + 1), this.p(s.getDate())].join('-');
        this.setData({
          updatedAt: dformat
        })
        if (res.data.data.applyStatus3 == 1) {
          this.setData({
            apply_suc: true,
            codeUrl: res.data.data.codeUrl,
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  //日期补位
  p: function (s) {
    return s < 10 ? '0' + s : s;
  }
})