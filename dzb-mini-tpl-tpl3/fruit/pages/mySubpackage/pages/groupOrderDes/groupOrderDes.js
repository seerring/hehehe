// pages/mySubpackage/pages/groupOrderDes/groupOrderDes.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sid: '',//门店id
    orsid: '',//订单号
    oid: '',//行业id
    orderDes: {},//当前订单基本详情
    timeObj: {},//倒计时
    uid: '', //用户id
    sub_type: 1, //配送方式
    addressInfo: {}, //门店信息
    period_time: [],
    addressList: [], //送货地址信息
    proList: [], //商品详细信息
    index01: 0, //送货上门、进店取货选项卡选中下标
    timeIdx: 0, //送达时间下标
    timeIdx2: 0, //送达时间下标
    curIndex: 0, //支付方式下标
    isAddress: false, //支付按钮颜色控制
    showScrollBox: false, //显示订单金额不足提示弹窗
    disPrice: 0,
    dis_totalPrice: 0, //商品总价
    member_price: '', //已优惠价格
    couponList: [], //优惠券列表
    payList: [ //支付方式
      { name: '微信', img: '../../images/wx.png' },
      // { name: '支付宝', img: '../../images/zfb.png' },
      { name: '钱包', img: '../../images/wallet-icon.png' },
    ],
    couponIndex: -1, //用户选择优惠券下标
    isSure: true, //购买协议复选框图片切换
    isCloseModal: false, //是否显示优惠券弹窗
    isCloseModal2: false, //是否显示支付弹窗
    order_info: [], //订单信息
    note: '', //留言输入框内容
    isShowModal: false, //是否显示送达时间弹窗
    isShowModal2: false, //是否显示钱包支付弹窗
    disabled: false, //支付按钮禁用
    password: '', //钱包支付密码输入框内容
    payInfo: '',//支付信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      oid: app.globalData.oid,
      sid: wx.getStorageSync("clickId"),
      id: options.id
    })
    that.data.uid = wx.getStorageSync("uid");
    that.getorderDes()
    // that.getGroupTime()
  },
  //启用支付框
  payOn() {
    var that = this;
    that.setData({
      isCloseModal2: true
    })
  },
  // 选择支付方式
  choosePay(index) {
    var that = this;
    // that.data.curIndex = index.currentTarget.dataset.index;
    that.setData({
      curIndex: index.currentTarget.dataset.index
    })
    console.log(`"curIndexis"${that.data.curIndex}`)
  },
  //获取当前订单基本详情
  getorderDes() {
    var that = this;
    var data = that.data.id;
    wx.showLoading({
      title: '加载中',
    })
    var data = that.data.id;
    wx.request({
      url: hostUrl + '/storeorder/' + data,
      method: 'GET',
      data: "",
      success: function (res) {
        var res = res.data;
        if (res.code == 1) {
          that.setData({
            orderDes: res.data,
            address_info: res.data.address_info[0],
            orsid:res.data.order_num
          })
     
          var totalSum = 0;
          // var totalPrice = 0;
          that.data.orderDes.order_info.forEach(item => {
            item.totalSum = totalSum += parseInt(item.num)
            // item.totalPrice = (totalPrice += item.num * item.product_fact_price).toFixed(2)
          })
          that.setData({
            // totalPrice: res.data.totalPrice,
            // totalSum: res.data.totalSum,
            orderDes: that.data.orderDes,
            note: res.data.note
          })
          that.getGroupTime()
        } else { }
      }
    })
    setTimeout(() => {
      wx.hideLoading();
    }, 500)
  },
  //倒计时
  getGroupTime() {
    let that = this;

    var formatDateTime = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      var h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? ('0' + minute) : minute;
      var second = date.getSeconds();
      return y + '/' + m + '/' + d + ' ' + h + ':' + minute + ':' + second;
    }

    let end_time = that.data.orderDes.endTime;
    end_time = end_time.replace(/\-/g, "/");
    let now_time = new Date();
    now_time = formatDateTime(now_time);
    let endTime = new Date(end_time).getTime();
    let nowTime = new Date(now_time).getTime();
    let total_micro_second = endTime - nowTime;
    that.setData({
      timeObj: that.dateFormat(total_micro_second)
    })
    // that.timeObj = that.dateFormat(total_micro_second);
    setTimeout(function () {
      that.getGroupTime();
    }, 1000)
  },
  //处理倒计时
  dateFormat: function (micro_second) {
    //总秒数
    let second = Math.floor(micro_second / 1000);
    //天数
    let day = Math.floor(second / 3600 / 24);
    //小时
    let hour = Math.floor(second / 3600 % 24);
    let hourStr = hour.toString();
    if (hourStr.length === 1) {
      hourStr = '0' + hourStr;
    }
    //分钟
    let min = Math.floor(second / 60 % 60);
    let minStr = min.toString();
    if (minStr.length === 1) {
      minStr = '0' + minStr;
    }
    //秒
    let sec = Math.floor(second % 60);
    let secStr = sec.toString();
    if (secStr.length === 1) {
      secStr = '0' + secStr;
    }
    let timeObj = {};  //声明一下
    timeObj.hourStr = parseInt(hourStr) + day*24;
    // timeObj.hourStr = hourStr;
    timeObj.minStr = minStr;
    timeObj.secStr = secStr;
    timeObj.countDown = second;
    return timeObj;
  },
  //再次购买
  buyAgain() {
    var that = this;
    let order = that.data.orderDes;
    let info = order.order_info;
      wx.navigateTo({
        url: '/pages/idxSubpackage/pages/groupDetails/groupDetails?id=' + info[0].id + "&sid=" + order.sid,
      })
  },
  //点击去支付
  payWay(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    
    that.setData({
      loadingHidden: false
    })  
    if (that.data.curIndex == 0) 
    {
      that.wePay(type)
    } else 
    {
      that.wallet(type)
      console.log("钱包支付")
    }
  },


  //钱包支付
  wallet() {
    var that = this;
    that.data.loadingHidden = false;
    var params = {
      order_num: that.data.orsid,
      oid: that.data.oid,
    }
    wx.request({
      url: hostUrl + '/walletpay',
      data: params,
      method: 'GET',
      success: function (res) {
        console.log(res)
        that.setData({
          payInfo: res.data.data
        })
        console.log(that.data.payInfo)
      }
    })
    setTimeout(
      () => {
        that.setData({
          loadingHidden: true,
          isCloseModal2: true,
          isShowModal2: true

        })
      }, 500
    );

  },
  // 密码
  inputValue(e) {
    var that = this;
    this.setData({
      password: e.detail.value
    })
    console.log(that.data.password)
  },
  //钱包支付
  payment2() {
    var that = this;
    that.data.disabled = false;
    if (that.data.password) {
      wx.showLoading({
        title: '支付中',
      })
      // var data = new FormData();
      // data.append('orsid', that.orsid);
      // data.append('oid', that.oid);
      // data.append('pay_type', 1);
      // data.append('uid', that.uid);
      // data.append('password', that.password);
      var data = {
        orsid: that.data.orsid,
        oid: that.data.oid,
        pay_type: 1,
        uid: that.data.uid,
        password: that.data.password
      }
      console.log(data)
      wx.request({
        url: hostUrl + '/walletpay',
        data: data,
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.data.code == 1) {
            setTimeout(() => {
              that.setData({
                disabled: false,
                isCloseModal2: false,
                isShowModal: false,
                isShowModal2: false,
              })
              wx.showToast({
                icon: 'none',
                title: res.data.msg
              })
              // setTimeout(() => {
              //   that.getParams();
              // }, 1000)
              // setTimeout(() => {
              //   wx.redirectTo({
              //     url: '/pages/mySubpackage/pages/verGoods/verGoods',
              //   })
              // }, 1000)
              //判断订单状态
              wx.request({
                url: hostUrl + '/storeorder/' + '27?' + 'orsid=' + data.orsid,
                data: '',
                method: 'GET',
                success: function (abc) {
                  if (abc.data.data.status == 2) {
                    wx.redirectTo({
                      url: '/pages/mySubpackage/pages/order/order?name=全部',
                    })
                  } else {
                    wx.redirectTo({
                      url: '/pages/mySubpackage/pages/verGoods/verGoods',
                    })
                  }
                }

              })
            }, 500)
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.msg
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/mySubpackage/pages/order/order',
              })
            }, 1000)
          }
        }
      })
    }
  },
  //关闭支付弹窗、钱包支付弹窗
  closeModal() {
    var that = this;
    that.setData({
      isCloseModal: false,
      isCloseModal2: false,
      isShowModal2: false,
    })
  },
  
  //微信支付
  wePay(type) {
    var that = this;
    let payPrice
    // if (that.data.dis_totalPrice) {
    //   payPrice = that.data.dis_totalPrice
    // } else {
    //   payPrice = that.data.proList[0].totalPrice
    // }
    var params = {
      orsid: that.data.orsid,
      price: payPrice,
      oid: that.data.oid,
      uid: that.data.uid
    }
    wx.request({
      url: hostUrl + '/xcxwxpay',
      data: params,
      method: 'GET',
      success: function (res) {
        var re = res.data;
        if (re.code === 1) {
          wx.requestPayment({
            "package": re.data.package,
            "nonceStr": re.data.nonceStr,
            "timeStamp": re.data.timeStamp,
            "paySign": re.data.paySign,
            "signType": re.data.signType,
            success(res) {
              wx.showToast({
                icon: 'success',
                title: '支付成功'
              })
              if (type == 1) {
                wx.redirectTo({
                  url: '/pages/mySubpackage/pages/verGoods/verGoods'
                })
              } else {
                wx.redirectTo({
                  url: '/pages/mySubpackage/pages/order/order?name=待配送'
                })
              }

            },
            fail(res) {
              wx.showToast({
                icon: 'none',
                title: '支付失败或取消'
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/mySubpackage/pages/order/order?name=全部'
                })
              }, 800)

            }
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '支付失败'
          })
        }
      },
      complete() {
        that.setData({
          loadingHidden: true
        })
      }
    })

  },

})