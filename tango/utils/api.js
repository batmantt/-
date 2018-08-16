import { base_url } from './config'

// 封装微信request接口为Promise对象
function http(url, data, method = 'POST') {
  return new Promise((resolve, reject) => {
    wx.request({
      url: base_url + url,
      method: method,
      data,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}
// 封装弹窗功能
export const showToast = text => {
  wx.showToast({
    title: text,
    icon: 'none'
  })
}
export const showLoading = () => {
  wx.showLoading({
    title: '加载中'
  })
}
export const hideLoading = () => {
  wx.hideLoading()
}
// 用户登陆接口
export const userLogin = data => {
  return http('/tg/wx/user/login', data)
}
// 获取用户签到列表
export const userSignList = data => {
  return http('/tg/wx/sign/list', data)
}
// 用户签到
export const userSign = data => {
  return http('/tg/wx/sign/signIn', data)
}
// 用户分享增加积分
export const userShare = data => {
  return http('/tg/wx/user/share', data)
}
// 积分明细列表
export const getItergralList = data => {
  return http('/tg/wx/integral/listIntegral', data)
}
// 积分加速明细
export const getItergralAddSpeed = data => {
  return http('/tg/wx/integral/listIntegralSpeed', data)
}
// 发送验证码
export const sendQrCode = data => {
  return http('/tg/sms/send', data)
}
// 绑定手机号码
export const bindPhone = data => {
  return http('/tg/wx/user/binding', data)
}
// 修改用户信息
export const updateUserInfo = data => {
  return http('/tg/wx/user/modify', data)
}
// 展示积分商城所有商铺
export const showItergralMall = data => {
  return http('/tg/wx/integralShop/listGoods', data)
}
// 积分兑换接口_wzb
export const exchangeGoods = data => {
  return http('/tg/wx/integralShop/trading', data)
}
//查询兑换记录
export const listTradeRecord = data => {
  return http('/tg/wx/user/listTradeRecord', data)
}
//查询用户信息 
export const userMessage = data => {
  return http('/tg/wx/user/userMessage', data)
}
//系统消息
export const systemNews=data=>{
  return http('/tg/wx/user/listTradeRecord')
}
//获取随机签到奖励
export const getSixRecords = data => {
  return http('/tg/wx/sign/getSixRecords')
}
//判断用户是否签到
export const signStatus = data => {
  return http('/tg/wx/sign/signStatus')
}
//补签接口
export const retroactive = data => {
  return http('/tg/wx/sign/retroactive')
}
//补签卡信息
export const retroativeStatus = data => {
  return http('/tg/wx/sign/retroativeStatus')
}
//业务员积分明细（积分商城）
export const listGmv = data => {
  return http('/tg/wx/integral/listGmv')
}
//用户地址展示
export const listAddress = data => {
  return http('/tg/wx/user/listAddress')
}