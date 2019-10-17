// pages/mySubpackage/pages/memberCharge/memberCharge.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberList: [],//当前用户会员信息
    wLenth: '100%',//会员类型宽度
    curIndex: 'hide',//会员类型是否选中
    curIndex2: 0,//会员权益tab选择
    curIndex3: 0,//支付方式的选择
    isCloseModal2: false,//支付弹窗的显示与否
    // tabList: ['黄金会员', '铂金会员', '钻石会员'],
    isShowModal: false,//钱包支付弹窗
    disabled: false,//钱包立即支付按钮
    tabList: [],//会员类型列表
    vipList: [],//会员类型列表
    payInfo: {},//钱包支付所需信息
    password: '',//钱包支付密码
    privilegeList: [],//会员权益列表
    monthGiftList: [],//优惠列表
    payList: [
      { name: '微信', img: '../../images/wx.png' },
      // { name: '支付宝', img: '../../images/zfb.png' },
      { name: '钱包', img: '../../images/wallet-icon.png' },
    ],//支付方式
    level:"",//会员权益选中的等级
    id:"",//选中会员类型的id
    price: ""//选中会员类型的价格
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this
    // that.getParams()
  },
  //获取基本信息
  getParams(){
    var that = this
    // oid
    that.setData({
      oid: app.globalData.oid,
      uid: wx.getStorageSync("uid")
    })
    console.log(that.data.oid)
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      wx.hideLoading();
    }, 500)
    //获取会员类型
    that.getDetail();
    // 会员权益分类
    that.vipList();
  },
  vipSort(a,b){
    return (a.time - b.time)
  },
  //获取会员类型
  getDetail() {
    var that = this;
    var data = {
      uid: that.data.uid,
      oid: that.data.oid,
    }
    wx.request({
      url: hostUrl + '/vip',
      data: data,
      method: 'GET',
      success: function (result) {
        var res = result.data;
        console.log("++++++++++"+res.data);
        if (res.code == 1) {
          that.setData({
            memberList: res.data
          })
          var vipList = null;
          vipList = res.data.vip_list.sort(that.vipSort);
          console.log("-------"+vipList);
          that.setData({
            vipList: vipList
          })


          that.setData({
            wLenth: (that.data.memberList.vip_list.length * 220) + ((that.data.memberList.vip_list.length - 1) * 15) + 'rpx'
          })
          if (res.data.level) {
            var a = {
              currentTarget: {
                dataset: {
                  index: that.data.memberList.level - 1,
                  lev: that.data.memberList.level
                }
              }
            }
            that.tabFun(a);
          }
          else {
            var a = {
              currentTarget: {
                dataset: {
                  index: 0,
                  lev: 1
                }
              }
            }
            that.tabFun(a);
          }
        }
      },
    })     
  },
  // 会员分类
  vipList() {
    var that = this;
    var data = that.data.oid;
    wx.request({
      url: hostUrl + '/vip/'+ data,
      data: '',
      method: 'GET',
      success: function (result) {
        var res = result.data;
        console.log(res);
        if (res.code == 1) {

          that.setData({
            tabList: res.data
          })
        }
      },
    })    
  },
  //选中的会员类型信息
  buyMemberType(e) {
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var price = e.currentTarget.dataset.price
    // console.log(id + "------------------"+ price)
    // console.log(this.data.memberList)
    var that = this;
    if (that.data.curIndex == index) {
      that.setData({
        curIndex: 'hide',
        price: price
      })
    }
    else {
      that.setData({
        curIndex: index,
        id:id,
        price: price
      })
    }
  },
  //立即购买
  payMentBtn() {
    var that = this;
    console.log(that.data.curIndex)
    if (that.data.curIndex != 'hide') {
      that.setData({
        isCloseModal2: true
      })
    }
    else {
      wx.showToast({
        title: '请选择会员类型!',
        icon: 'none',
      })
    }
  },
  //会员权益tab选择
  tabFun(e) {
    var that = this;
    // console.log(e)
    var index = e.currentTarget.dataset.index
    var level = e.currentTarget.dataset.lev
    that.setData({
      curIndex2: index,
      level: level
    })
    var data = {
      oid: that.data.oid,
      uid: that.data.uid,
      level: level,
    }
    // console.log(data)
    wx.request({
      url: hostUrl + '/vipequity',
      data: data,
      method: 'GET',
      success: function (result) {
        var res = result.data;
        // console.log(res);
        if (res.code == 1) {
          that.setData({
            privilegeList: res.data.vip_equity_list,
            monthGiftList: res.data.coupon_list
          })
          console.log(that.data.monthGiftList)
        }
      },
    })    
  },
  //领取礼包
  getCoupons(id) {
    var that = this;
    var id = id.currentTarget.dataset.id
    console.log(id)
    var list = that.data.monthGiftList;
    var data = {
      oid: that.data.oid,
      uid: that.data.uid,
      level: that.data.level,
      id:id
    }
    // that.setData({
    //   id: id,
    // })
    console.log(data)
    wx.request({
      // url: hostUrl + '/vipequity',
      url: hostUrl + '/storercoupon',
      data: data,
      method: 'POST',
      success: function (result) {
        var res = result.data;
        console.log(res);
        if (res.code == 1) {
          wx.showToast({
            title: res.msg,
            icon: 'none',
          })
          setTimeout(() => {
            that.getParams();
          }, 500)
        } else if (res.code == 2) {
          wx.showToast({
            title: res.msg,
            icon: 'none',
          })
        }else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
          })
        }
      },
    })    
  },
  //关闭支付弹窗、钱包支付弹窗
  closeModal() {
    var that = this;
    that.setData({
      isCloseModal2: false,
      isShowModal:false
    })
  },
  //选择支付方式
  choosePay(e) {
    var that = this;
    var index = e.currentTarget.dataset.index
    that.setData({
      curIndex3: index
    })
  },
  //去支付
  payment() {
    var that = this;
    var index = that.data.curIndex3
    console.log(index)
    if (index == 0) {
      //微信支付
      that.wePay();
    }
    
    else if (index == 1) {
      
      that.wallet();
    }
  },
  //微信支付
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
    // data.recharge_amount = that.data.recharge_amount
    data.id = that.data.id
    console.log(data)
    wx.request({
      url: hostUrl + '/vip',
      data: data,
      method: 'POST',
      success: function (result) {
        var res = result.data;
        console.log(res);
        if (res.code == 1) {
          var data = {
            price: that.data.price,
            uid: that.data.uid,

            orsid: res.data,
            oid: that.data.oid,
            pay_type: 2,
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
                        url: '/pages/mySubpackage/pages/memberCharge/memberCharge'
                      })

                  },
                  fail(res) {
                    console.log(res);
                    wx.showToast({
                      icon: 'none',
                      title: '支付失败或取消'
                    })
                    that.closeModal();
                    // setTimeout(function () {
                    //   wx.redirectTo({
                    //     url: '/pages/mySubpackage/pages/memberCharge/memberCharge'
                    //   })
                    // }, 800)

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
  //钱包支付弹窗
  wallet(){
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
    data.id = that.data.id
    wx.request({
      url: hostUrl + '/vip',
      data: data,
      method: 'POST',
      success: function (result) {
        var res = result.data;
        console.log(res);
        if (res.code == 1) {
          var data = {
            order_num: res.data,
            oid: that.data.oid,
          }

          wx.request({
            url: hostUrl + '/walletpay',
            data: data,
            method: 'GET',
            success: function (res) {
              console.log("数据返回", res.data);
              var re = res.data;
              if (re.code === 1) {
                that.setData({
                  payInfo: re.data
                })
                console.log(that.data.payInfo)
                setTimeout(() => {
                  that.setData({
                    disabled: false,
                    isShowModal:true
                  })
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
  // 密码
  inputValue(e) {
    var that = this;
    this.setData({
      password: e.detail.value
    })
    console.log(that.data.password)
  },
  // 钱包立即支付
  payment2() {
    var that = this;
    that.setData({
      disabled: true
    })
    if (that.data.password) {
      wx.showLoading({
        title: '支付中',
      })
      setTimeout(() => {
        wx.hideLoading();
      }, 500)

      var data = {};
      data.uid = that.data.uid
      data.oid = that.data.oid
      data.id = that.data.id
      wx.request({
        url: hostUrl + '/vip',
        data: data,
        method: 'POST',
        success: function (result) {
          var res = result.data;
          console.log(res);
          if (res.code == 1) {
            var data = {};
            data.orsid = res.data
            data.oid = that.data.oid
            data.pay_type = 2
            data.uid = that.data.uid
            data.password = that.data.password

            wx.request({
              url: hostUrl + '/walletpay',
              data: data,
              method: 'POST',
              success: function (result) {
                var res = result.data;
                console.log(res);
                if (res.code == 1) {
                  setTimeout(() => {
                    that.setData({
                      disabled:false,
                      isCloseModal2: false,
                      isShowModal:false,
                    })
                    wx.showToast({
                      icon: 'none',
                      title: res.msg
                    })
                    setTimeout(() => {
                      that.getParams();
                    }, 1000)
                  }, 500)
                }
                else {
                  setTimeout(() => {
                    wx.showToast({
                      icon: 'none',
                      title: res.msg
                    })
                    that.setData({
                      disabled: false,
                    })
                  }, 500)
                }
              },
            })    


          }
        },
      }) 
    }
    else {
      that.setData({
        disabled:false,
      })
      wx.showToast({
        icon: 'none',
        title: '请输入支付密码'
      })
    }
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
              // var a = { currentTarget: { dataset: { type: 2 } } }
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.getParams()
  },
})