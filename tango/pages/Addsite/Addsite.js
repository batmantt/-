// pages/Addsite/Addsite.js
import { ERR_OK, base_url } from '../../utils/config'
import { showLoading, hideLoading, showToast, listAddress } from '../../utils/api'
const app = getApp().globalData
Page({
  /**
   * 页面的初始数据
   */

// 改变一下
//zaigaibianyixia 
  data: {
    id: null,
    modify: null,
    area: ['省份', '城市', '区县'],
    name: null,
    phnumber: null,
    street: null,
    defaultAddress: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.modify == 1) {
      this.setData({
        defaultAddress: options.defaultAddress,
        modify: options.modify,
        area: [options.province, options.city, options.area],
        street: options.addressDetails,
        phnumber: options.phoneNum,
        name: options.name,
        id: options.id,
      })
    }
  },

  // 点击选择地区
  getArea: function (e) {
    this.setData({
      area: e.detail.value
    })
  },
  //获取输入的地址
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //获取手机号码
  phnumberInput: function (e) {
    this.setData({
      phnumber: e.detail.value
    })
  },
  //获取街道地址
  streetInput: function (e) {
    this.setData({
      street: e.detail.value
    })
  },
  //添加地址按钮
  _add_address: function () {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (this.data.name == null || this.data.name == '') {
      showToast("姓名不能为空！")
    } else if (this.data.area[0] == '省份') {
      showToast("请选择地区！")
    } else if (!myreg.test(this.data.phnumber)) {
      showToast("手机号格式错误！")
    } else if (this.data.street == null || this.data.street == '') {
      showToast("请输入地址！")
    } else {
      wx.request({
        url: base_url + '/tg/wx/user/addAddress',
        header: {
          'content-type': 'application/json',
        },
        method: 'POST',
        data: {
          "addressDetails": this.data.street,
          "area": this.data.area[2],
          "city": this.data.area[1],
          "name": this.data.name,
          "phoneNum": this.data.phnumber,
          "province": this.data.area[0],
          "userOpenId": app.userInfo.user.userOpenId,
        },
        success: res => {
          console.log(res);
          if (res.data.code == 200) {
            wx.showToast({
              title: '添加成功',
              icon: 'seccess',
              image: '',
              duration: 1000,
              mask: true,
              success: function (res) {
                wx.navigateBack({
                  delta: 1
                })
              },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else {
            showToast("添加失败，请重试！")
          }
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }
  },
  //删除地址
  _del_address: function () {
    if (this.data.defaultAddress == 1) {
      wx.showModal({
        title: '提示',
        content: '业务员默认地址只能修改',
        showCancel: false,
        confirmText: '确定',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定删除此地址？',
        success: res => {
          if (res.confirm) {
            console.log('用户点击确定')
            this.de_add()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //删除地址接口
  de_add: function () {
    wx.request({
      url: base_url + '/tg/wx/user/deleteAddress',
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      data: {
        "id": this.data.id,
        "userOpenId": app.userInfo.user.userOpenId,
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            image: '',
            duration: 1000,
            mask: true,
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
            },
          })
        } else {
          showToast("删除失败，请检查重试！")
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  //修改地址
  _modify_address: function () {
    wx.request({
      url: base_url + '/tg/wx/user/updateAddress',
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      data: {
        "id": this.data.id,
        "addressDetails": this.data.street,
        "area": this.data.area[2],
        "city": this.data.area[1],
        "name": this.data.name,
        "phoneNum": this.data.phnumber,
        "province": this.data.area[0],
        "userOpenId": app.userInfo.user.userOpenId,
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          showToast("修改成功")
          wx.navigateBack({
            delta: 1
          })
        } else {
          showToast("修改失败，请重试！")
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
})
