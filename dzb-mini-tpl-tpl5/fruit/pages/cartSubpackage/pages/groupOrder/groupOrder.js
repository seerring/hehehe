const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '', //用户id
    oid: '',//商家id
    orsid: '',//订单号
    sid: '',
    sub_type: 1, //配送方式
    addressInfo: { //门店信息
      period_time: [],
    },
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
    var that = this
    //获取基本信息
    that.getParams();
    //地址信息
    that.getAddressList()
    console.log(that.data.isSure)
  },
  //获取基本信息
  getParams() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      oid: app.globalData.oid,
      uid: wx.getStorageSync("uid"),
      proList: JSON.parse(wx.getStorageSync("proArr")),
      sid: wx.getStorageSync("clickId"),
    })
      var list = that.data.proList
      var totalSum = 0;
      var totalPrice = 0;
      for (var i = 0; i < list.length; i++) {
        var data = {
          id: list[i].id,
          product_images: list[i].product_images[1],
          product_name: list[i].product_name,
          product_price: list[i].original_price,
          product_fact_price: list[i].present_price,
          num: list[i].buyNum,
          shop_type: list[i].shop_type,
        };
        that.data.order_info.push(data);
      }
      for (var i = 0; i < list.length; i++) {
        list[i].totalSum = totalSum += list[i].buyNum
        list[i].totalPrice = (totalPrice += list[i].buyNum * list[i].present_price).toFixed(2)
      }
      that.setData({
        proList: that.data.proList
      })
      console.log(that.data.proList)
      setTimeout(()=>{
        wx.hideLoading();
      },1000)
   
  },
  // 选择支付方式
  choosePay(index) {
    var that = this;
    that.setData({
      curIndex: index.currentTarget.dataset.index
    })
    console.log(`"curIndexis"${that.data.curIndex}`)
  },
  //地址信息
  getAddressList() {
    var that = this;
    var data = {
      uid: that.data.uid,
      sid: that.data.sid,
      sub_type: 2,
    }
    wx.request({
      url: hostUrl + '/orderaddress',
      method: 'GET',
      data: data,
      success: function (res) {
        var res = res.data;
        if (res.code == 1) {
          that.setData({
            addressInfo: res.data,
          })
        } else { }
      }
    })
  },
  
  //备注内容
  inputValue2(e) {
    var that = this;
    that.setData({
      note: e.detail.value
    })
    if (that.data.note.length >= 45) {
      wx.showToast({
        title: '备注请在45字以内!',
        icon: 'none',
      })
    }
  },
  //协议
  agreement() {
    var that = this;
    if (that.data.isSure == true) {
      this.setData({
        isSure: false
      })
    } else {
      this.setData({
        isSure: true
      })
    }
  },
  //提示
  showWarn() {
    wx.showModal({
      title: '提示',
      content: '订单金额不满足送货上门服务哦！您可以进店自取或重新下单',
      success(res) {
        if (res.confirm) {
          var a = { currentTarget: { dataset: { index: 1 } } }
          this.buyStyle(a);
        } else if (res.cancel) {
        }
      }
    })
  },
 
  //点击去支付
  payWay() {
    var that = this;
    if (!that.data.isSure) {
      wx.showToast({
        title: '协议内容未勾选!',
        icon: 'none',
      })
    }
    else {
      var data = {};
      data.uid = that.data.uid
      data.oid = app.globalData.oid,
      data.groupId = that.data.proList[0].id
      data.sum = that.data.proList[0].totalPrice
      data.sid = that.data.sid
      data.price = parseInt(that.data.proList.totalPrice).toFixed(2)
      data.source = 1;
      data.address_info = that.data.addressInfo.address_phone
      data.order_info = JSON.stringify(that.data.order_info)
      data.note = that.data.note
      data.type = 3
      wx.request({
        url: hostUrl + '/storeorder',
        data: data,
        method: 'POST',
        success: function (res) {
          var res = res.data;
          if (res.code == 1) {
            that.setData({
              orsid: res.data,
            })
            // setTimeout(() => {
            //   if (that.data.curIndex == 0) {
            //   that.wePay()
            //   }else{
            //     that.wallet()
            //     console.log("钱包支付")
            //   }
            // }, 1000)
          } else if(res.code == 2){ 
            wx.showToast({
              title: res.msg,
              icon: 'none',
            })
          } else if (res.code == 3) {
            wx.showToast({
              title: res.msg,
              icon: 'none',
            })
          } else{
            wx.showToast({
              title: "参团失败！",
              icon: 'none',
            })
          }
        }
      })

      setTimeout(() => {
        if (that.data.curIndex == 0) {
          that.wePay()
        } else {
          that.wallet()
          console.log("钱包支付")
        }
      }, 1000)
      
    }
  },
  //启用支付框
  payOn() {
    var that = this;
    that.setData({
      isCloseModal2: true
    })
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
              setTimeout(() => {
                that.getParams();
              }, 1000)
              // setTimeout(() => {
              //   wx.redirectTo({
              //     url: '/pages/mySubpackage/pages/verGoods/verGoods',
              //   })
              // }, 1000)
              //判断订单状态
              wx.request({
                url: hostUrl + '/storeorder/' + '27?' + 'orsid=' + data.orsid,
                data:'',
                method: 'GET',
                success: function (abc) {
                  if (abc.data.data.status == 2){
                    wx.redirectTo({
                      url: '/pages/mySubpackage/pages/order/order',
                    })
                  }else{
                    wx.navigateTo({
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
  //截取当前订单
  filterById:function(array){
    if (array.order_num == this.data.orsid){
      return true;
    }else{
      return false;
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
  walletCloseModal() {
    var that = this;
    that.setData({
      isCloseModal: false,
      isCloseModal2: false,
      isShowModal2: false
    })
    wx.navigateTo({
      url: '/pages/mySubpackage/pages/order/order?name=待付款',
    })
    console.log("关闭了")
  },
  //微信支付
  wePay() {
    var that = this;
    let payPrice = that.data.proList[0].totalPrice
    var params = {
      orsid: that.data.orsid,
      price: payPrice,
      oid: that.data.oid,
      uid:that.data.uid
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
              //判断订单状态
              wx.request({
                url: hostUrl + '/storeorder/' + '27?' + 'orsid=' + params.orsid,
                data: '',
                method: 'GET',
                success: function (abc) {
                  console.log(abc)
                  if (abc.data.data.status == 2) {
                    wx.redirectTo({
                      url: '/pages/mySubpackage/pages/order/order',
                    })
                  } else {
                    wx.redirectTo({
                      url: '/pages/mySubpackage/pages/verGoods/verGoods',
                    })
                  }
                }

              })
            },
            fail(res) {
              wx.showToast({
                icon: 'none',
                title: '支付失败或取消'
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/tabBar/my/my?name=全部'
                })
              }, 800)

            }
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '支付失败'
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/tabBar/my/my?name=全部'
            })
          }, 800)
        }
      }
    })

  },

})
