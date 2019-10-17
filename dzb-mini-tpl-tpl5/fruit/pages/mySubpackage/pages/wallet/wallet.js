// pages/mySubpackage/pages/wallet/wallet.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
      uid:"",//用户id
      oid:"",//行业id
      showLogin: false,//使用规则弹窗
      isCloseModal2: false,//关闭弹窗
      curIndex: 'hide',//在线充值是否选中
      curIndex2: 0,//支付方式的额选中
      list: [],//余额
      payList: [
        { name: '微信', img: '../../images/wx.png' },
        // { name: '支付宝', img: '../../images/zfb.png'},
        // { name: '钱包', img: '../../images/wallet-icon.png' },
      ],//支付方式
      rechargeVal:"",//充值框金额
      recharge_amount: '',//自定义金额
      rs_id: '',//选中充值列表的id
      price: ""//选中充值列表的价格
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var that = this;
      that.getParams();
    },
  //获取基本信息
  getParams() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      wx.hideLoading();
    }, 500)
    that.setData({
      oid: wx.getStorageSync("oid"),
      uid: wx.getStorageSync("uid")
    })
    that.rechargeList();
  },
  //钱包充值，获取余额
  rechargeList() {
    var that = this;
    var data = {
      oid: that.data.oid,
      uid: that.data.uid,
    }
    wx.request({
      url: hostUrl + '/recharge',
      data: data,
      method: 'GET',
      success: function (result) {
        var res = result.data;
        console.log(res);
        if (res.code == 1) {
          that.setData({
            list: res.data,
          })
        }
      },
    })    
  },
  //获取充值列表
  ChooseRecharge(e) {
    var that = this;
    console.log(e)
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var price = e.currentTarget.dataset.price
    this.setData({
      price: price
    })
    if (that.data.curIndex == index) {
      that.setData({
        curIndex: 'hide'
      });
    }
    else {
      that.setData({
        curIndex: index
      })
      if (that.data.curIndex != 'hide') {
        that.setData({
          isCloseModal2: true,
          rs_id:id
        })
      }
    }
  },
  //自主充值
  customRecharge(){
    var that = this;
    if (that.data.curIndex != 6){
      that.setData({
        curIndex: 6
      })
    }else {
      that.setData({
        curIndex: 'hide'
      })
    }
  },
  //自定义金额
  inputValue(e) {
    var that = this;
    this.setData({
      rechargeVal: e.detail.value
    })
    this.setData({
      price: that.data.rechargeVal
    })
  },
  otherPay() {
    var that = this;
    if (!that.data.rechargeVal) {
      wx.showToast({
        title: '请输入充值的金额',
        icon: 'none',
      })
    }else {
      that.setData({
        isCloseModal2: true,
        recharge_amount: that.data.rechargeVal
      })
    }
  },
  //打开余额使用规则弹窗
  useExplain() {
    var that = this;
    that.setData({
      showLogin: true
    })
  },
  //关闭弹窗或支付方式
  closeModal() {
    var that = this;
    that.setData({
      showLogin: false,
      isCloseModal2:false
    })
  },
  choosePay(e) {
    var that = this;
    console.log(e)
    var index = e.currentTarget.dataset.index
    that.setData({
      curIndex2: index,
      // isCloseModal2:true
    })
    console.log(that.data.isCloseModal2)
  },
  payment(index) {
    var that = this;
      that.wePay();
  },
  // 微信支付
  wePay() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      wx.hideLoading();
    }, 500)

    var data = {};
    data.uid = that.data.uid
    data.oid = that.data.oid
    data.recharge_amount = that.data.price
    data.rs_id = that.data.rs_id
    console.log(data)
    wx.request({
      url: hostUrl + '/recharge',
      data: data,
      method: 'POST',
      success: function (result) {
        var res = result.data;
        console.log(res);
        if (res.code == 1) {
          var data = {
            price: String(that.data.price),
            uid: that.data.uid,

            orsid: res.data,
            oid: that.data.oid,
            pay_type: 3,
          }
          console.log(data)

          wx.request({
            url: hostUrl + '/xcxwxpay',
            data: data,
            method: 'GET',
            success: function (res) {
              console.log("数据返回", res.data);
              var re = res.data;
              if (re.code === 1) {
                wx.requestPayment({
                  "package": re.data.package,
                  "nonceStr": re.data.nonceStr,
                  "timeStamp": re.data.timeStamp,
                  "paySign": re.data.paySign,
                  "signType": re.data.signType,
                  success(res) {
                    console.log(res);
                    wx.showToast({
                      icon: 'success',
                      title: '支付成功'
                    })
                    wx.redirectTo({
                      url: '/pages/mySubpackage/pages/wallet/wallet'
                    })
                  },
                  fail(res) {
                    console.log(res);
                    wx.showToast({
                      icon: 'none',
                      title: '支付失败或取消'
                    })
                    setTimeout(function () {
                      wx.redirectTo({
                        url: '/pages/mySubpackage/pages/wallet/wallet'
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
        }
      },
    })

  },

  //授权登录
  wxLogin(e) {
    var that = this;
    var info = e.detail;
    console.log(e);
    var oid = wx.getStorageSync('oid');
    wx.login({
      success: function (res) {
        wx.request({
          url: hostUrl + '/xcxBindPhone',
          data: {
            'uid': that.data.uid,
            'oid': wx.getStorageSync('oid'),
            'code': res.code,
            'signature': info.signature,
            'iv': info.iv,
            'encryptedData': info.encryptedData
          },
          header: {
            "Content-Type": "applciation/json"
          },
          method: "POST",
          success: function (r) {
            var s = r.data;
            console.log(s);
            if (s.status == 4 || s == '-1001') {
              wx.showModal({
                title: '错误提示',
                confirmColor: '#1ccfcf',
                showCancel: false,
                content: '授权失败，请重试:' + s.data,
                success: function (res) {
                  if (res.confirm) {
                    that.setData({
                      loadingHidden: true
                    })
                  }
                }
              })

            } else {
              that.payment();
            }
          },
          complete: function () {
            that.setData({
              loadingHidden: true
            })
          }
        });
      },
    });
  },


})