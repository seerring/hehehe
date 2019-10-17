// pages/mySubpackage/pages/orderDes/orderDes.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',//用户id
    oid: '',//行业id
    orsid: '',//订单号
    id: '',//当前订单id
    sid: '',//门店id
    totalSum: 0,//总件数
    note: '',//备注
    orderDes: '',//当前订单基本信息
    address_info: [],//配送地址
    isCloseModal2: false,//支付弹窗
    // payList: [
    //   { name: '微信', img: require('@/assets/images/index/wx.png') },
    //   { name: '支付宝', img: require('@/assets/images/index/zfb.png') },
    // ],
    curIndex: 0,//选中的支付方式下标
    totalPrice: 0,//总金额
    cartList:0,
    period_time:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      oid: app.globalData.oid,
      uid: wx.getStorageSync("uid"),
      sid: wx.getStorageSync("clickId"),
      id: options.id
    })
    that.getorderDes()
  },
  //获取订单基本信息
  getorderDes() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var data = that.data.id;
    wx.request({
      url: hostUrl + '/storeorder/' + data,
      method: 'GET',
      data: '',
      success: function (res) {
        var res = res.data;
        console.log(res);
        if (res.code == 1) {
          that.setData({
            orderDes: res.data,
            address_info: res.data.address_info,
            period_time:res.data.period_time,
          })
          var totalSum = 0;
          var totalPrice = 0;
          var list = that.data.orderDes.order_info
          for (var j = 0; j < list.length; j++) {
            totalSum += parseInt(list[j].num);
            totalPrice += parseInt(list[j].num) * parseFloat(list[j].product_fact_price);
          }
          list[0].totalSum = totalSum
          list[0].totalPrice = (totalPrice - that.data.orderDes.coupon_price).toFixed(2)
          that.setData({
            orderDes: that.data.orderDes,
            note: res.data.note
          })
        } else { }
      }
    })
    setTimeout(() => {
      wx.hideLoading();
    }, 500)
  },
  //再次购买
  buyAgain() {
    var that = this;
    let order = that.data.orderDes;
    let info = order.order_info;
    console.log(info)
    if (info[0].shop_type == 2) {
      wx.navigateTo({
        url: '/pages/idxSubpackage/pages/specialDes/specialDes?id=' + info[0].id,
      })
    }
    else {
      that.getDetail(info);
    }
  },
  //获取当前门店
  getDetail(info) {
    var that = this;
    if (info.length > 1) {
      wx.showLoading({
        title: '加载中',
      })
      // var cartList1 = that.data.cartList;
      info.forEach(item => {
        var params = {};
        params.uid = that.data.uid;
        params.pid = item.id;
        params.shopid = that.data.sid;
        params.num = item.num;
        params.oid = that.data.oid;
        params.shop_type = 1;
        wx.request({
          url: hostUrl + '/storecart',
          method: 'POST',
          data: params,
          success: function (res) {
            var cartList1 = that.data.cartList;
            that.setData({
              cartList: ++cartList1,
            })
            if (that.data.cartList == info.length) {
              wx.hideLoading();
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/tabBar/shopCart/shopCart',
                })
              }, 500)
            }
          }
        })
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/idxSubpackage/pages/proDetails/proDetails?id=' + info[0].id,
      })
    }
  },
  //退款
  refund() {
    var that = this;
    wx.navigateTo({
      url: '/pages/mySubpackage/pages/refund/refund?id=' + that.data.orderDes.id
    })
  },
  //提醒配送
  hint_ps() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var data = {}
    data.uid = that.data.uid;
    data.sid = that.data.orderDes.sid;
    data.order_id = that.data.orderDes.id;
    wx.request({
      url: hostUrl + '/storemessages',
      method: 'POST',
      data: data,
      success: function (res) {
        var res = res.data
        if (res.code == 1) {
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
                title: res.msg,
                icon: 'none',
            })
          }, 1000)
        }
        else {
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '操作失败！',
              icon: 'none',
            })
          }, 1000)
        }
      }
    })
  },
  //确认收货
  comReceipt() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认收货吗？',
      success(res) {
        if (res.confirm) {
          that.confirm();
          wx.showLoading({
            title: '加载中',
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  //确认--收货
  confirm(){
    var that = this;
    var data = that.data.orderDes.id + "?type_status=2";
    wx.request({
      url: hostUrl + '/storeorder/'+ data,
      method: 'PUT',
      data: '',
      success: function (res) {
        var res = res.data
        console.log(res);
        if (res.code == 1) {
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '操作成功！',
              icon: 'none',
            })
            wx.navigateTo({
              url: '/pages/mySubpackage/pages/order/order?type=4',
            })
          }, 1000)
        }
        else {
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '操作失败！',
              icon: 'none',
            })
          }, 1000)
        }
      }
    })
  },
  //点击去支付
  payWay() {
    var that = this;
    that.setData({
      orsid: that.data.orderDes.order_num,
      isCloseModal2: true,
    })
    console.log(that.data.orsid)
    that.wePay()
  },
  //微信支付
  wePay() {
    var that = this;
    var params = {
      orsid: that.data.orsid,
      price: that.data.orderDes.order_info[0].totalPrice,
      oid: that.data.oid,
      uid: wx.getStorageSync('uid')
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
              wx.reLaunch({
                url: '/pages/tabBar/my/my?name=待发货'
              })
            },
            fail(res) {
              wx.showToast({
                icon: 'none',
                title: '支付失败或取消'
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/tabBar/my/my?name=待付款'
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
      }
    })

  },
  
})