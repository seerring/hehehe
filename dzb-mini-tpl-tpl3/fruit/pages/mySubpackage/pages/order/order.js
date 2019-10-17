// pages/mySubpackage/pages/order/order.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowModal1: false,
        loadingHidden: false,//加载
        paged: 1,//当前页数
        isempty: false,//显示底线
        orderIndex: '',//当前订单下标
        curIndex: 0,//tab下标
        tabList: ['全部', '待付款', '待配送', '配送中', '已完成'],//tab列表
        orderList: [],//当前订单里列表
        orderid: '',//当前订单id
        index01: 0,//选择卡tab下标
        qxId:'',//取消订单id
        orderDes: '',//当前订单信息
        orsid:'',//待付款订单号
        oid:'',//行业id
        refundId:'',//退款订单id
        confirmId:'',//确认收货当前订单id
        delId: '',//删除订单id
        storeInfo: '',//当前门店信息
        orderAgain: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var name = null;
        if (options.name){
        var name = options.name;
        };
        var that = this;
        if (name == '待付款') {
            //获取当前订单列表
            that.getOrderList(1);
            that.setData({
                loadingHidden: false,
                paged: 1,
                curIndex: 1,
            })
        } else if (name == '待配送') {
            that.getOrderList(2);
            that.setData({
                loadingHidden: false,
                paged: 1,
                curIndex: 2,
            })
        } else if (name == '配送中') {
            that.getOrderList(3);
            that.setData({
                loadingHidden: false,
                paged: 1,
                curIndex: 3,
            })
        } else if (name == '已完成') {
            that.getOrderList(4);
            that.setData({
                loadingHidden: false,
                paged: 1,
                curIndex: 4,
            })
        } else {
            that.getOrderList(0);
        }
    },
  //  onShow: function (options){
  //    console.log('order onshow')
  //    var that = this;
  //     that.onLoad();
  //   },
 
    //获取当前订单列表
    getOrderList: function(index) {
        var that = this;
        var paged = that.data.paged;
        var orderList = that.data.orderList;
        var uid = wx.getStorageSync('uid');
        var oid = app.globalData.oid;
        if(index == 0){
          index = '';
        }
        var data = {
          'oid': oid,
          'uid': uid,
          'status': index,
          'paged': paged
        }
        wx.request({
          url: hostUrl + '/storeorder',
            data: {
                'oid': oid,
                'uid': uid,
                'status': index,
                'paged': paged
            },
            method: 'GET',
            success: function(result) {
                var res = result.data;
                if (res.code == 1) {
                    var datas = res.data.list;
                    // datas.forEach(item => {
                    //   that.data.orderList.push(item);
                    // })
                    console.log(datas)
                    for (var i = 0; i < datas.length; i++) {
                      // orderList.push(datas[i]);
                      var orderList_info = datas[i]['order_info'];
                      var totalSum = 0;
                      var totalPrice = 0;

                      for (var j = 0; j < orderList_info.length; j++){
                        totalSum += parseInt(orderList_info[j].num);
                        totalPrice += parseInt(orderList_info[j].num) * parseFloat(orderList_info[j].product_fact_price);
                      }
                      console.log(totalPrice)
                      datas[i]['procount'] = totalSum;
                      var  coupon_price = 0;
                      if (datas[i]['coupon_price']){
                        coupon_price = datas[i]['coupon_price'];
                      }
                      datas[i]['totalPrice'] = (totalPrice - coupon_price).toFixed(2);

                      orderList.push(datas[i]);

                    }
                    that.setData({
                        orderList: orderList
                    })
                    console.log(that.data.orderList)
                    paged++;
                    that.setData({
                        paged: paged
                    })
                } else {
                    that.setData({
                        isempty: true //显示底线
                    })

                }
            },
            complete: function() {
                that.setData({
                    loadingHidden: true
                })
            }
        })
    },
    //选项卡
    tabFun: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        that.setData({
            curIndex: index,
            orderList: [],
            loadingHidden: false,
            paged: 1,
            isempty: false
        })
        that.getOrderList(index)
        that.setData({
          index01: index,
        })
    },
    //确认订单收货
    confirmOrder: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var orderId = e.currentTarget.dataset.id;
        that.setData({
            orderIndex: index,
            isShowModal3: true,
            orderId: orderId,
        })
    },
    //确定-收货
    confirmSubmitOrder: function (e) {
        var that = this;
        var orderList = that.data.orderList;
        var orderid = that.data.orderId;
        var orderIndex = that.data.orderIndex;
        that.setData({ loadingHidden: false })
        var uid = wx.getStorageSync('uid');
        var oid = wx.getStorageSync('oid');
        wx.request({
            url: hostUrl + '/confirmorder',
            data: {
                'orderid': orderid
            },
            method: 'GET',
            success: function (result) {
                var res = result.data;
                if (res.code == 1) {
                    orderList.splice(orderIndex, 1);
                    that.setData({
                        orderList: that.data.orderList,
                        isShowModal3: false,
                        orderid: orderid,
                    })
                }
                wx.showToast({
                    icon: 'none',
                    title: res.msg
                })
            },
            complete: function () {
                that.setData({
                    loadingHidden: true
                })
            }
        })
    },
    //删除订单
    delSubmitOrder: function(e){
        var that = this;
        var orderList = that.data.orderList;
        var orderid = that.data.orderId;
        var orderIndex = that.data.orderIndex;
        that.setData({ loadingHidden: false })
        var uid = wx.getStorageSync('uid');
        var oid = wx.getStorageSync('oid');
        wx.request({
            url: hostUrl + '/order/' + orderid,
            data: {
                'oid': oid,
                'uid': uid
            },
            method: 'DELETE',
            success: function (result) {
                var res = result.data;
                if (res.code == 1) {
                    orderList.splice(orderIndex, 1);
                    that.setData({
                        orderList: that.data.orderList,
                        isShowModal2: false,
                        orderid: orderid,
                    })
                }
                wx.showToast({
                    icon: 'none',
                    title: res.msg
                })
            },
            complete: function () {
                that.setData({
                    loadingHidden: true
                })
            }
        })
    },

    //取消操作
    cancleOrder: function() {
        var that = this;
        that.setData({
            isShowModal1: false,
            isShowModal2: false,
            isShowModal3: false,
        })
    },
    //确认操作
    comOrder: function() {
        var that = this;
        var orderList = that.data.orderList;
        var orderid = that.data.orderId;
        var orderIndex = that.data.orderIndex;
        that.setData({ loadingHidden: false })
        var uid = wx.getStorageSync('uid');
        var oid = wx.getStorageSync('oid');
        wx.request({
            url: hostUrl + '/order/' + orderid,
            data: {
                'oid': oid,
                'uid': uid
            },
            method: 'PUT',
            success: function (result) {
                var res = result.data;
                if (res.code == 1) {
                    orderList.splice(orderIndex, 1);
                    that.setData({
                        orderList: that.data.orderList,
                        isShowModal1: false,
                        orderid: orderid,
                    })
                }
                wx.showToast({
                    icon: 'none',
                    title: res.msg
                })
            },
            complete: function () {
                that.setData({
                    loadingHidden: true
                })
            }
        })
    },

    //取消订单
    qxOrder(e) {
      var that = this
      that.setData({
        qxId: e.currentTarget.dataset.id
      })
      wx.showModal({
        title: '提示',
        content: '确定要取消订单吗？',
        success(res) {
          if (res.confirm) {
            that.remove();
            wx.showLoading({
              title: '加载中',
            })
          } else if (res.cancel) {
          }
        }
      })
    },
    //确定--取消订单
    remove() {
      var that = this;
      var data = that.data.qxId + "?type_status=1";
      wx.request({
        url: hostUrl + '/storeorder/' + data,
        method: 'PUT',
        data: '',
        success: function (res) {
          var res = res.data
          if (res.code == 1) {
            setTimeout(() => {
              wx.hideLoading();
              wx.showToast({
                title: '操作成功！',
                icon: 'none',
              })
              var index = {
                currentTarget: {
                  dataset: {
                    index: that.data.index01
                  }
                }
              }
              that.tabFun(index)
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
    payWay(index) {
      var that = this;
      var index =  index.currentTarget.dataset.index
      that.setData({
        orsid: (that.data.orderList)[index].order_num,
        isCloseModal2: true,
        orderDes: (that.data.orderList)[index]
      })
      that.wePay()
    },
    //微信支付
    wePay() {
      var that = this;
      var params = {
        orsid: that.data.orsid,
        price: that.data.orderDes.totalPrice,
        oid: app.globalData.oid,
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
    //提醒配送
    hint_ps(id) {
      var that = this;
      wx.showLoading({
        title: '加载中',
      })
      var sid = id.currentTarget.dataset.sid
      var id = id.currentTarget.dataset.id
      var data = {}
      data.uid = wx.getStorageSync("uid");
      data.sid = sid;
      data.order_id = id;
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
    //退款
    refund(e) {
      var that = this
      that.setData({
        refundId: e.currentTarget.dataset.id
      })
      console.log(that.data.refundId)
      wx.showModal({
        title: '提示',
        content: '确认退款吗？',
        success(res) {
          if (res.confirm) {
            that.torefund();
            wx.showLoading({
              title: '加载中',
            })
          } else if (res.cancel) {
          }
        }
      })
    },
    //确认--退款
    torefund() {
      var that = this;
      // var data = that.data.refundId + "?type_status=1";
      var data = {
        id: that.data.refundId
      }
      wx.request({
        url: hostUrl + '/refund',
        method: 'POST',
        data: data,
        success: function (res) {
          var res = res.data
          if (res.code == 1) {
            setTimeout(() => {
              wx.hideLoading();
              wx.showToast({
                title: '操作成功！',
                icon: 'none',
              })
              var index = {
                currentTarget: {
                  dataset: {
                    index: that.data.index01
                  }
                }
              }
              that.tabFun(index)
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
    comReceipt(id) {
      var that = this
      that.setData({
        confirmId: id.currentTarget.dataset.id
      })
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
    confirm() {
      var that = this;
      var data = that.data.confirmId + "?type_status=2";
      wx.request({
        url: hostUrl + '/storeorder/' + data,
        method: 'PUT',
        data: '',
        success: function (res) {
          var res = res.data
          if (res.code == 1) {
            setTimeout(() => {
              wx.hideLoading();
              wx.showToast({
                title: '操作成功！',
                icon: 'none',
              })
              var index = {
                currentTarget: {
                  dataset: {
                    index: that.data.index01
                  }
                }
              }
              that.tabFun(index)
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
    //删除订单
    delOrder(id) {
      var that = this
      that.setData({
        delId: id.currentTarget.dataset.id
      })
      wx.showModal({
        title: '提示',
        content: '确定要删除订单吗？',
        success(res) {
          if (res.confirm) {
            that.todel();
            wx.showLoading({
              title: '加载中',
            })
          } else if (res.cancel) {
          }
        }
      })
    },
    //确认--删除订单
    todel() {
      var that = this;
      var data = that.data.delId + "?type_status=3";
      wx.request({
        url: hostUrl + '/storeorder/' + data,
        method: 'PUT',
        data: '',
        success: function (res) {
          var res = res.data
          if (res.code == 1) {
            setTimeout(() => {
              wx.hideLoading();
              wx.showToast({
                title: '操作成功！',
                icon: 'none',
              })
              var index = {
                currentTarget: {
                  dataset: {
                    index: that.data.index01
                  }
                }
              }
              that.tabFun(index)
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
    //再次购买
    buyAgain(index) {
      var that = this;
      var index = index.currentTarget.dataset.index
      let order = (that.data.orderList)[index]
      let info = (that.data.orderList)[index].order_info
      let id = order.sid
      // that.getDetail(id, info)
    },
    //获取当前门店
    getDetail(id, info) {
      var that = this;
      var params = id
      wx.request({
        url: hostUrl + '/store/'+ params,
        method: 'GET',
        data: '',
        success: function (res) {
          var res = res.data
          if (res.code == 1) {
            that.setData({
              storeInfo:res.data
            })
            let t = []
            info.forEach(item => {
              var data = {
                id: item.id,
                product_images: item.product_images,
                product_name: item.product_name,
                product_price: '',
                product_fact_price: item.product_fact_price,
                price: item.product_fact_price,
                num: item.num,
                shop_type: item.shop_type,
                name: that.data.storeInfo.name,
                logo: that.data.storeInfo.logo,
              }
              t.push(data)
            });
            that.setData({
              orderAgain: t
            })
            var c = JSON.stringify(t)
            wx.setStorageSync("proArr", c);
            wx.navigateTo({
              url: '/pages/cartSubpackage/pages/subOrder/subOrder?type=3',
            })
          }
        }
      })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var orderList = this.data.orderList;
        //if (orderList > 0){
        this.setData({
            loadingHidden: false
        });
        var idx = this.data.curIndex;
        this.getOrderList(idx);
        //} 
    }
})