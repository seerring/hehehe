// pages/tabBar/shopCart/shopCart.js
const hostUrl = require('../../../config').hostUrl
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loadingHidden: false,//加载
        totalPrice: '0.00',//合计金额
        selectAllStatus: false,//是否全选
        shopCartList: [],//购物车商品列表
        orderList: [],//选中的商品列表
        shopinfo:[],//门店店名
        // recommendList: [
        //     { id: 21, images: '/images/recomImg1.png', proName: '丝柔扎染男女家居北欧丝柔家居北欧', price: '168' },
        //     { id: 22, images: '/images/recomImg2.png', proName: '丝柔扎染男女家居北欧丝柔家居北欧', price: '168' },
        //     { id: 23, images: '/images/recomImg1.png', proName: '丝柔扎染男女家居北欧丝柔家居北欧', price: '168' },
        //     { id: 24, images: '/images/recomImg2.png', proName: '丝柔扎染男女家居北欧丝柔家居北欧', price: '168' }
        // ],
        toOrder: false,//去结算
        sid:0  //店铺ID
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideLoading();
        var that = this;
        that.getCart();
        // if (!app.isLogin()) { return; }; //检测是否登录
        that.setData({
            loadingHidden: true,
            sid: wx.getStorageSync("clickId")
        })
        
    },
    onShow:function(){
        var that = this;
        wx.hideLoading();
        that.getCart();
        that.setData({
          loadingHidden: true,
        })
    },
    onHide: function () {
      var that = this;
      that.setData({
        cartNum: null,
        shopCartList: null,
        shopinfo: null
      })
      console.log("ONHIDE")
      console.log(`${that.data.cartNum}+${that.data.shopCartList}+${that.data.shopinfo}`)
      that.getCart()
    },

    //获取购物车信息
    getCart() {
        var that = this;
        var sid = that.data.sid;
        wx.request({
            url: hostUrl + '/storecart',
            data: {
                uid: wx.getStorageSync("uid"),
                oid: wx.getStorageSync("oid"),
            },
            success: function (res) {
                console.log("hostUrl + '/storecart'↓");
                console.log(res);
                var res = res.data;
              if (res.code == 1 || res.code == 0) {
                    var datas = res.data;
                    for (var i = 0; i < datas.length; i++) {
                        if (datas[i].shopid == sid) {
                            var shopinfo = datas[i];
                            var goodList = datas[i].list;
                            ///console.log("获取购物车内容2222222", cartList);
                            that.setData({
                                cartNum: goodList.length,
                                shopCartList: goodList,
                                shopinfo: shopinfo
                            })
                            console.log(that.data.shopCartList)

                            var cartNum = that.data.cartNum;
                            console.log(cartNum);
                            if(cartNum == undefined){
                              let cartNum = 0
                            }
                            var carNumstr = cartNum.toString();
                          if (cartNum != 0){
                            wx.setTabBarBadge({
                              index: 3,
                              text: carNumstr  // 购物车数量
                            })
                          }else{
                            wx.removeTabBarBadge({
                              index: 3
                            })
                          }
                        }
                    }
                }else{
                  console.log("请求失败！")
                  that.setData({
                    cartNum: null,
                    shopCartList: null,
                    shopinfo: null
                  })
                }
              if (carNumstr == undefined) {
                wx.removeTabBarBadge({
                  index: 3
                })
                that.setData({
                  cartNum: null,
                  shopCartList: null,
                  shopinfo: null
                })
              }
            },
   
            complete:function(){
                that.setData({
                    loadingHidden: true
                })
            }
        })
    },
    //全选
    selectAll(e) {
        var that = this;
        var selectNum = 0;
        var selectAllStatus = that.data.selectAllStatus;
        var shopCartList = that.data.shopCartList;
        var toOrder = that.data.toOrder;
        selectAllStatus = !selectAllStatus;
        for (var i = 0; i < shopCartList.length; i++) {
            shopCartList[i].selected = selectAllStatus;
        }
        that.setData({
            selectAllStatus: selectAllStatus,
            shopCartList: shopCartList,
        })
        for (var i = 0; i < shopCartList.length; i++) {
            if (shopCartList[i].selected == true) {
                selectNum++;
                console.log(shopCartList[i].selected)
            }
        }
        if (selectNum > 0) {
            that.setData({
                toOrder: true,
            })
        }
        else {
            that.setData({
                toOrder: false,
            })
        }
        console.log(that.data.shopCartList)
        that.getTotalPrice();
    },
    //购物车商品列表
    selectList(e) {
        console.log(e);
        var that = this;
        var index = e.currentTarget.dataset.index;
        var shopCartList = that.data.shopCartList;
        var selected = shopCartList[index].selected;
        shopCartList[index].selected = !selected;
        that.setData({
            shopCartList: shopCartList,
        })
        var selectNum = 0;
        for (var i = 0; i < shopCartList.length; i++) {
            if (shopCartList[i].selected == true) {
                selectNum++;
                console.log(shopCartList[i].selected)
            }
        }
        if (selectNum == shopCartList.length) {
            that.setData({
                selectAllStatus: true,
                toOrder: true,
            })
        }
        else {
            that.setData({
                selectAllStatus: false,
            })
            if (selectNum > 0) {
                that.setData({
                    toOrder: true,
                })
            }
            else {
                that.setData({
                    toOrder: false,
                })
            }
        }
        that.getTotalPrice();
    },
    //减
    minusCount(e) {
        var that = this;
        that.setData({ loadingHidden: false })
        var index = e.currentTarget.dataset.index;
        var shopCartList = that.data.shopCartList;
        var count = shopCartList[index].num;
        var cartid = shopCartList[index].cart_id;
        if (count <= 1) {
            that.setData({ loadingHidden: true })
            wx.showModal({
              title: '提示',
              content: '确认要删除该商品吗？',
              confirmColor: '#1ccfcf',
              success: function (res) {
                if (res.confirm) {
                  console.log("确认删除")
                  that.changeShopCart(that, 0, cartid, "DELETE");
                  shopCartList.splice(index, 1);
                  that.setData({
                    shopCartList: shopCartList,
                    cartNum: shopCartList.length
                  })

                  console.log(shopCartList);

                  var cartNum = that.data.cartNum;

                  console.log(cartNum);

                  if (cartNum == 0) {

                    wx.removeTabBarBadge({
                      index: 3
                    })

                  } else {
                    var carNumstr = cartNum.toString();
                    wx.setTabBarBadge({
                      index: 3,
                      text: carNumstr  // 购物车数量
                    })
                  }
                } else if (res.cancel){
                  console.log("不删除")
                }

              }
            });
            return false;
        }
        count -= 1;
        console.log(`"count="${count}`)
        shopCartList[index].num = count;
        that.setData({
            shopCartList: shopCartList,
        })
        that.changeShopCart(that, count, shopCartList[index].cart_id, "PUT");
        that.getTotalPrice(); //重置总计计算
    },
    //加
    addCount(e) {
        var that = this;
        that.setData({ loadingHidden: false })
        var index = e.currentTarget.dataset.index;
        var shopCartList = that.data.shopCartList;
        var count = shopCartList[index].num;
        count += 1;
        shopCartList[index].num = count;
        that.setData({
            shopCartList: shopCartList,
        })
        that.changeShopCart(that, count, shopCartList[index].cart_id, "PUT");
        that.getTotalPrice(); //重置总价计算
    },
    //删除购物车商品
    deleteList(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var shopCartList = that.data.shopCartList;
        var cartid = shopCartList[index].cart_id;
        wx.showModal({
            title: '提示',
            content: '确认要删除该商品吗？',
            confirmColor: '#1ccfcf',
            success: function (res) {
                if (res.confirm) {
                    that.changeShopCart(that, 0, cartid, "DELETE");
                    shopCartList.splice(index, 1);
                    that.setData({
                        shopCartList: shopCartList,
                        cartNum: shopCartList.length
                    })
                  
                  console.log(shopCartList);

                  var cartNum = that.data.cartNum;

                  console.log(cartNum);

                  if (cartNum == 0){

                    wx.removeTabBarBadge({
                      index: 3
                    })

                  }else{
                    var carNumstr = cartNum.toString();
                    wx.setTabBarBadge({
                      index: 3,
                      text: carNumstr  // 购物车数量
                    })
                  }
                }
            }
        })
        that.getTotalPrice();
    },
    //更改购物车商品数量
    changeShopCart(that, count, cartid, type) {
        var remoteUrl = hostUrl + '/storecart/' + cartid;
        if (type == "DELETE") { remoteUrl = hostUrl + '/storecart/1';  }
        wx.request({
            url: remoteUrl,
            data: {
                ids: cartid,  //删除购物车商品的时候
                num: count
            },
            method: type,
            success: function (res) {
                console.log(res);
            },
            complete: function () {
                that.setData({ loadingHidden: true });
            }
        })
    },
    //计算总价
    getTotalPrice() {
        var that = this;
        var shopCartList = that.data.shopCartList;
        var total = 0;
        for (var i = 0; i < shopCartList.length; i++) {
            if (shopCartList[i].selected == true) {
                var product_price = shopCartList[i].price;
                total += shopCartList[i].num * product_price;
            }
        }
        that.setData({
            shopCartList: shopCartList,
            totalPrice: total.toFixed(2),
        })
    },
    //去结算
  toOrderPage() {
    var that = this;
    if (that.data.toOrder == false) {
      wx.showToast({
        icon: 'none',
        title: '请选择结算商品',
      })
    } else {
      var selectNum = 0;
      var orderList = [];
      var shopCartList = that.data.shopCartList;
      for (var i = 0; i < shopCartList.length; i++) {
        if (shopCartList[i].selected == false) {
          selectNum++;
        }
      }
      if (selectNum == shopCartList.length) {
        wx.showToast({
          icon: 'none',
          title: '请选择结算商品',
        })
      }
      else {
        for (var i = 0; i < shopCartList.length; i++) {
          if (shopCartList[i].selected == true) {
            orderList.push(shopCartList[i]);
          }
        }
        that.setData({
          orderList: orderList,
          loadingHidden: false,
        })
        wx.setStorageSync('proArr', JSON.stringify(that.data.orderList));
        wx.setStorageSync('totalPrice', that.data.totalPrice);
        var uid = wx.getStorageSync('uid');
        var oid = wx.getStorageSync('oid');
        if (uid) {
          wx.navigateTo({
            url: '/pages/cartSubpackage/pages/subOrder/subOrder?type=3'
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '您需要先点击确定，进行登录',
            confirmColor: '#1ccfcf',
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/common/pages/login/login?oid=' + oid
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }

        that.setData({
          loadingHidden: true,
        })
      }
    }
  },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log("onShow:shopCart")
        var that = this;
        that.setData({
            selectAllStatus: false,
            totalPrice: '0.00',
            toOrder: false,
            loadingHidden: false,
        })
        that.getCart();
        wx.removeStorageSync('curIndex')
    }
})

