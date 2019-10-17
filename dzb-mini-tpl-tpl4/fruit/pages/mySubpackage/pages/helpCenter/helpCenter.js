// pages/mySubpackage/pages/helpCenter/helpCenter.js
const hostUrl = require('../../../../config').hostUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isContent: false,//是否显示问题回答
        hotList: [
            { name: '已经下单，怎么还会出现缺货呢？', content: '配货过程中，因商品破损、残缺可能会导致商品缺货无法发出，所以会造成下单后，商品中途缺货的情况。', isContent: false },
            { name: '商城平时的优惠活动多吗？', content: '配货过程中，因商品破损、残缺可能会导致商品缺货无法发出，所以会造成下单后，商品中途缺货的情况。', isContent: false },
            { name: '提现会收取手续费吗？多久能到账？', content: '配货过程中，因商品破损、残缺可能会导致商品缺货无法发出，所以会造成下单后，商品中途缺货的情况。', isContent: false },
            { name: '如何联系客服？客服的工作时间是怎样的？', content: '配货过程中，因商品破损、残缺可能会导致商品缺货无法发出，所以会造成下单后，商品中途缺货的情况。', isContent: false }
        ],//问题列表
        tel:'',//门店号码
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getHelplist();
    },
    //获取帮助列表
    getHelplist: function () {
        var that = this;
        var oid = wx.getStorageSync('oid');
        var sid = wx.getStorageSync('clickId');
        console.log(sid);
        wx.request({
            url: hostUrl + '/options',
            data: {
                'oid': oid,
                'type': 1,
                'sid': sid,
            },
            method: 'GET',
            success: function (result) {
                console.log(result.data);
                var res = result.data;
                if (res.code == 1) {
                    that.setData({
                        hotList:res.data.list,
                        tel:res.data.phone
                    })
                } else {

                    wx.showToast({
                        icon: 'none',
                        title: res.msg,
                    })
                }
            },
            complete: function () {
                that.setData({
                    loadingHidden: true
                })
            }
        })
    },
    //显示原因
    showContent: function (e) {
        console.log(e);
        var that = this;
        var index = e.currentTarget.dataset.index;
        var hotList = that.data.hotList;
        console.log("====");
        console.log(index);
        console.log(hotList);
        console.log("2======");
        hotList[index].isContent = !hotList[index].isContent;
        that.setData({
            hotList: hotList,
        })
    },
    //联系门店
    call(){
      var that = this 
      wx.makePhoneCall({
        phoneNumber: that.data.tel,
      })
    },

})