// pages/cartSubpackage/pages/subOrder/subOrder.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        uid: '', //用户id
        oid: '', //商家id
        orsid: '', //订单号
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
            {
                name: '微信',
                img: '../../images/wx.png'
            },
            // { name: '支付宝', img: '../../images/zfb.png' },
            {
                name: '钱包',
                img: '../../images/wallet-icon.png'
            },
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
        payInfo: '', //支付信息
        totalPrice:"",//折扣后总价
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

    // 点击送货时间显示选择送达时间弹窗
    chooseTime: function() {
        var that = this;
        that.setData({
            isShowModal: true
        })
    },
    // 关闭送达时间弹窗
    closeModal_time: function() {
        var that = this;
        that.setData({
            isShowModal: false
        })
    },
    // 送达时间确定按钮
    comBtn_tt: function() {
        var that = this;
        console.log(that)
        // that.data.timeIdx2 = that.data.timeIdx;
        that.setData({
            timeIdx2: that.data.timeIdx,

        })
        console.log(this.data.confirmedTime)
        // that.data.isShowModal = false;
        that.setData({
            isShowModal: false,
            confirmedTime: that.data.addressInfo.period_time[that.data.timeIdx2]
        })
        console.log(`"提交的index是："${this.data.timeIdx2}`)
    },
    // 送达时间选择
    comfirmTime: function(index) {
        console.log(index)
        var that = this;
        that.setData({
            timeIdx: index.currentTarget.dataset.index
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        wx.removeStorageSync('selected_address_id'); //重置选中的地址ID
        that.setData({
            type: options.type,
            oid: app.globalData.oid,
            uid: wx.getStorageSync("uid")
        })
        that.getParams();
        that.getCouponList()
    },
    onShow: function() {
        var that = this;
        var selected_address_id = wx.getStorageSync("selected_address_id");
        if (selected_address_id) {
            this.setData({
                loadingHidden: false
            });
            that.changeAddress(selected_address_id);
        }
    },

    getParams() {
        var that = this;
        that.setData({
            oid: app.globalData.oid,
            uid: wx.getStorageSync("uid"),
            proList: JSON.parse(wx.getStorageSync("proArr")),
            // shopinfo: JSON.parse(wx.getStorageSync("shopInfo")),
            sid: wx.getStorageSync("clickId"),
        })
        that.getStore()
        if (that.data.type == 1) {
            var list = that.data.proList
            var totalSum = 0;
            var totalPrice = 0;
            for (var i = 0; i < list.length; i++) {
                var data = {
                    id: list[i].id,
                    product_images: list[i].video ? list[i].product_images[1] : list[i].product_images[0],
                    product_name: list[i].product_name,
                    product_price: list[i].original_price,
                    product_fact_price: list[i].present_price,
                    num: list[i].buyNum,
                    shop_type: list[i].shop_type,
                };
                that.data.order_info.push(data);
                totalSum += list[i].buyNum;
                totalPrice += list[i].buyNum * list[i].present_price;
            }
            // for (var i = 0; i < list.length; i++) {
            //     list[i].totalSum = totalSum += list[i].buyNum
            //     list[i].totalPrice = (totalPrice += list[i].buyNum * list[i].present_price).toFixed(2)
            // }
            for (var i = 0; i < list.length; i++) {
                list[i].totalSum = totalSum;
                list[i].totalPrice = totalPrice.toFixed(2);
            }

            that.setData({
                proList: that.data.proList,
                totalSum: totalSum,
                totalPrice: totalPrice
            })
        } else if (that.data.type == 2) {
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
                totalSum += list[i].buyNum;
                totalPrice += list[i].buyNum * list[i].present_price;
            }
            // for (var i = 0; i < list.length; i++) {
            //     list[i].totalSum = totalSum += list[i].buyNum;
            //     list[i].totalPrice = (totalPrice += list[i].buyNum * list[i].present_price).toFixed(2);
            // }
            for (var i = 0; i < list.length; i++) {
                list[i].totalSum = totalSum;
                list[i].totalPrice = totalPrice.toFixed(2);
            }
            that.setData({
                proList: that.data.proList,
                totalSum: totalSum,
                totalPrice: totalPrice
            })
        } else {
            var list = that.data.proList
            var totalSum = 0;
            var totalPrice = 0;
            for (var i = 0; i < list.length; i++) {
                var data = {
                    id: list[i].pid,
                    cartid: list[i].cart_id,
                    product_images: list[i].product_images,
                    product_name: list[i].product_name,
                    product_fact_price: list[i].price,
                    num: list[i].num,
                    shop_type: list[i].shop_type,
                };
                that.data.order_info.push(data);
                totalSum += list[i].num;
                totalPrice += list[i].num * list[i].price;
            }
            for (var i = 0; i < list.length; i++) {
                list[i].totalSum = totalSum;
                list[i].totalPrice = totalPrice.toFixed(2);
            }

            that.setData({
                proList: that.data.proList,
                totalSum: totalSum,
                totalPrice: totalPrice
            })
        }

        //return;
    },

    //获取优惠券
    getCouponList() {
        var that = this;
        var proArr = [];
        for (var i = 0; i < that.data.proList.length; i++) {
            var proObj = {
                id: that.data.proList[i].id,
                product_fact_price: that.data.proList[i].present_price,
                num: that.data.proList[i].buyNum,
            }
            proArr.push(proObj);
        }
        wx.request({
            url: hostUrl + '/storencoupon',
            method: 'GET',
            data: {
                uid: that.data.uid,
                order_info: JSON.stringify(proArr),
                sum: parseInt(that.data.proList[0].totalPrice),
                sid: that.data.sid,
            },
            success: function(res) {
                var res = res.data;
                if (res.code == 1) {
                    that.setData({
                        couponList: res.data,
                    })
                } else {}
            },
            complete() {
                that.setData({
                    loadingHidden: true
                });
            }
        })
    },

    //获取当前门店详情
    getStore() {
        var that = this;
        var params = that.data.sid
        wx.request({
            url: hostUrl + '/store/' + params,
            method: 'GET',
            data: {},
            success: function(res) {
                var res = res.data;
                if (res.code == 1) {
                    that.setData({
                        lng: res.data.lon,
                        lat: res.data.lat,
                    })
                    var a = {
                        currentTarget: {
                            dataset: {
                                index: 0
                            }
                        }
                    }
                    that.buyStyle(a);
                } else {}
            }
        })
    },
    //点击tab变换
    buyStyle(index) {
        var that = this;
        var index = index.currentTarget.dataset.index
        if (index == 0) {
            that.setData({
                sub_type: 1,
                isSelect: true,
            })
            that.getAddressList1();
            that.getAddressList2();
        } else {
            that.setData({
                sub_type: 2,
                isSelect: false,
            })
            that.getAddressList1();
        }
        that.setData({
            index01: index,

            loadingHidden: true
        })
        console.log(this.data.index01)
    },
    //跳转收货地址
    shooseAds() {
        var that = this;
        wx.navigateTo({
            url: '/pages/cartSubpackage/pages/address/address?way=1' + "&type=" + that.data.type,
        })
    },
    // 进店取货
    getAddressList1() {
        var that = this;
        var data = {
            uid: that.uid,
            sid: that.sid,
            sub_type: that.data.sub_type,
            oid: that.oid,
        }
        wx.request({
            url: hostUrl + '/orderaddress',
            method: 'GET',
            data: {
                uid: that.data.uid,
                sid: that.data.sid,
                sub_type: that.data.sub_type,
                oid: that.data.oid,
            },
            success: function(res) {
                var res = res.data;
                if (res.code == 1) {
                    that.setData({
                        addressInfo: res.data,
                    })
                }
              if (that.data.addressInfo.discount == "") {
                var totalPrice = that.data.proList[0].totalPrice
                let b = parseFloat(totalPrice).toFixed(2)
                that.setData({
                  totalPrice:b,
                })
              } else {
                that.setData({
                  totalPrice: ((that.data.proList[0].totalPrice) * (that.data.addressInfo.discount) * 0.1).toFixed(2),
                })
              }
            }
        })
    },
    //获取切换的地址
    changeAddress(adsid) {
        var that = this;
        that.setData({
            loadingHidden: false
        });
        wx.request({
            url: hostUrl + '/address/' + that.data.uid,
            method: 'GET',
            data: {
                aid: adsid
            },
            success: function(res) {
                var res = res.data;
                if (res.code == 1) {
                    that.setData({
                        addressList: res.data.address
                    })
                  if (that.data.addressList && Number(that.data.proList[0].totalPrice) > Number(that.data.addressInfo.amount)) {
                    that.setData({
                      isAddress: true,
                    })
                  } else {
                    that.setData({
                      isAddress: false,
                    })
                  }
                }
            },
            complete() {
                that.setData({
                    loadingHidden: true
                });
            }
        })
    },
    // 送货上门
    getAddressList2() {
        var that = this;
        that.setData({
            loadingHidden: false
        });
        wx.request({
            url: hostUrl + '/address',
            method: 'GET',
            data: {
                uid: that.data.uid,
                type: 1,
                oid: that.data.oid,
                origin: that.data.lng + ',' + that.data.lat,
            },
            success: function(res) {
                var res = res.data;
                if (res.code == 1) {
                    that.setData({
                        addressList: res.data,
                    })
                    if (that.data.addressList) {
                        that.setData({
                            addressList: that.data.addressList[0]
                        })
                      if (that.data.addressList && Number(that.data.proList[0].totalPrice) > Number(that.data.addressInfo.amount)){
                        that.setData({
                          isAddress: true,
                        })
                      }else {
                        that.setData({
                          isAddress: false,
                        })
                      }
                    }
                } else {
                    that.setData({
                        isAddress: false,
                        addressList: false
                    })
                }
            },
            complete() {
                that.setData({
                    loadingHidden: true
                });
            }
        })
    },

    //备注内容
    inputValue2(e) {
        var that = this;
        that.setData({
            note: e.detail.value
        })
        console.log(note)
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
        var that = this;
        wx.showModal({
            title: '提示',
            content: '订单金额不满足送货上门服务哦！您可以进店自取或重新下单',
            showCancel: false,
            confirmColor: "#1ccfcf",
            success(res) {
                if (res.confirm) {
                    var a = {
                        currentTarget: {
                            dataset: {
                                index: 1
                            }
                        }
                    }
                    that.buyStyle(a);
                }
            }
        })
    },
    //优惠券
    chooseCoupon() {
        var that = this;
        this.setData({
            isCloseModal: true
        })
    },
    //关闭
    closeModal() { 
        var that = this;
        that.setData({
            isCloseModal: false,
            isCloseModal2: false
        })
        console.log("关闭了")
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
    //选择优惠券
    checkedCoupon(index) {
        var that = this;
        var index = index.currentTarget.dataset.index
        if (that.data.couponIndex == index) {
            this.setData({
                couponIndex: -1,
                disPrice: 0,
                dis_totalPrice: ((that.data.totalPrice) + that.data.disPrice).toFixed(2)
            })
        } else {
            this.setData({
                couponIndex: index,
                disPrice: that.data.couponList.list[index].coupon_price,
              dis_totalPrice: ((that.data.totalPrice) - that.data.disPrice).toFixed(2)
            })
            this.setData({
              dis_totalPrice: ((that.data.totalPrice) - that.data.disPrice).toFixed(2)
            })
        }
        console.log("选择了优惠券" + (that.data.totalPrice));
        that.closeModal();
    },
    //启用支付框
    payOn() {
        var that = this;
        if (that.data.index01 == 0) {
            // wx.showToast({
            //     title: '请先添加收货地址!',
            //     icon: 'none',
            // })
          if (Number(that.data.proList[0].totalPrice) < Number(that.data.addressInfo.amount)){
            that.showWarn()
          }
          else if(!that.data.isAddress){
            wx.showToast({
              title: '请选择收货地址!',
              icon: 'none',
            })
          } else if (!that.data.isSure) {
            wx.showToast({
              title: '协议内容未勾选!',
              icon: 'none',
            })
          }else {
            that.setData({
              isCloseModal2: true
            })
          }
            
        } else if (!that.data.isSure) {
            wx.showToast({
                title: '协议内容未勾选!',
                icon: 'none',
            })
        }else{
            that.setData({
                isCloseModal2: true
            })
        }   
    },
    //点击去支付
    payWay(e) {
        var that = this;
        var type = e.currentTarget.dataset.type;
        that.setData({
            loadingHidden: false
        })
        if (!that.data.isAddress && that.data.index01 == 0) {
            wx.showToast({
                title: '请选择收货地址!',
                icon: 'none',
            })
        } else if (!that.data.isSure) {
            wx.showToast({
                title: '协议内容未勾选!',
                icon: 'none',
            })
        } else {
            // if (that.data.proList[0].totalPrice - that.data.disPrice < that.data.addressInfo.amount) {
          if (Number(that.data.proList[0].totalPrice) < Number(that.data.addressInfo.amount)){
                that.showWarn()
            } else {
                var data = {};
                data.uid = that.data.uid
                data.oid = app.globalData.oid,
                    data.sum = that.data.proList[0].totalPrice
                data.sid = that.data.sid
                data.price = (that.data.proList[0].totalPrice - that.data.disPrice).toFixed(2)
                data.source = 1;
                data.order_info = JSON.stringify(that.data.order_info)
                data.note = that.data.note
                if (that.data.index01 == 0) {
                    data.type = 1;
                    data.address_info = JSON.stringify(that.data.addressList);
                    data.day_name = that.data.addressInfo.day_name;
                    data.period_time = that.data.addressInfo.period_time[that.data.timeIdx2];
                    console.log("提交的参数")
                    console.log(data)
                } else {
                    data.type = 2;
                    data.address_info = that.data.addressInfo.address_phone
                }
                if (that.data.couponIndex != -1) {
                    data.coupon_id = that.data.couponList.list[that.data.couponIndex].id;
                } else {
                    data.coupon_id = ""
                }
                //return;
                wx.request({
                    url: hostUrl + '/storeorder',
                    data: data,
                    method: 'POST',
                    success: function(res) {
                        var res = res.data;
                        if (res.code == 1) {
                            that.setData({
                                orsid: res.data,
                            })
                            // that.wePay(type)
                            if (that.data.curIndex == 0) {
                                that.wePay(type)
                            } else {
                                that.wallet(type)
                                console.log("钱包支付")
                            }
                        } else {
                            wx.showToast({
                                icon: 'none',
                                title: res.msg
                            })
                            that.setData({
                                loadingHidden: true
                            })
                        }
                    }
                })
            }
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
            success: function(res) {
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
                success: function(res) {
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

                            //判断订单状态
                            var data = {
                                orsid: that.data.orsid
                            }
                            wx.request({
                                url: hostUrl + '/storeorder/',
                                method: 'GET',
                                data: data,
                                success: function(res) {
                                    console.log(res)
                                }

                            })
                          if (that.data.sub_type == 1){
                            setTimeout(() => {
                              wx.redirectTo({
                                url: '/pages/mySubpackage/pages/order/order',
                              })
                            }, 1000)
                          }else{
                            setTimeout(() => {
                                wx.redirectTo({
                                    url: '/pages/mySubpackage/pages/verGoods/verGoods',
                                })
                            }, 1000)
                          }

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
    //     that.$api.walletpay2(data).then(res => {
    //       console.log(res);
    //       if (res.code == 1) {
    //         setTimeout(() => {
    //           that.disabled = false;
    //           that.isCloseModal2 = false;
    //           that.isShowModal = false;
    //           that.$vux.loading.hide();
    //           that.$vux.toast.text(res.msg, 'middle');
    //           setTimeout(() => {
    //             if (that.index01 == 0) {
    //               that.$router.replace({ name: 'orderList', params: { type: 0 } });
    //             }
    //             else {
    //               that.$router.replace({ name: 'verGoods' });
    //             }
    //           }, 1000)
    //         }, 500)
    //       }
    //       else {
    //         setTimeout(() => {
    //           that.$vux.loading.hide();
    //           that.disabled = false;
    //           that.$vux.toast.text(res.msg, 'middle');
    //         }, 500)
    //       }
    //     })
    //   }
    //   else {
    //     that.disabled = false;
    //     that.$vux.toast.text("请输入支付密码 ", 'middle');
    //   }
    // },
    //微信支付
    wePay(type) {
        var that = this;
        let payPrice
        if (that.data.dis_totalPrice) {
            payPrice = that.data.dis_totalPrice
        } else {
            payPrice = that.data.proList[0].totalPrice
        }
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
            success: function(res) {
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
                                wx.navigateTo({
                                    url: '/pages/mySubpackage/pages/verGoods/verGoods'
                                })
                            } else {
                                wx.navigateTo({
                                    url: '/pages/mySubpackage/pages/order/order?name=待配送'
                                })
                            }

                        },
                        fail(res) {
                            wx.showToast({
                                icon: 'none',
                                title: '支付失败或取消'
                            })
                            setTimeout(function() {
                                wx.navigateTo({
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


    //授权登录
    wxLogin(e) {
        var that = this;
        var info = e.detail;
        var oid = wx.getStorageSync('oid');
        wx.login({
            success: function(res) {
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
                    success: function(r) {
                        var s = r.data;
                        if (s.code == 4 || s == '-1001') {
                            wx.showModal({
                                title: '错误提示',
                                confirmColor: '#1ccfcf',
                                showCancel: false,
                                content: '授权失败，请重试:' + s.data,
                                success: function(res) {
                                    if (res.confirm) {
                                        that.setData({
                                            loadingHidden: true
                                        })
                                    }
                                }
                            })

                        } else {
                            var a = {
                                currentTarget: {
                                    dataset: {
                                        type: 2
                                    }
                                }
                            }
                            that.payWay(a);
                        }
                    },
                    complete: function() {
                        that.setData({
                            loadingHidden: true
                        })
                    }
                });
            },
        });
    },

})