// pages/mySubpackage/pages/refun/refun.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        message: '',//退款描述
        reasonList: [],//退款原因列表
        reason: '',//选中的退款原因下标
        isShowModal: false,//退款列表弹窗
        proDes: '',//退款商品详情
        totalPrice: 0,//实付总额
        id: '',//当前退款订单id
        imgLists: [],//上传图片列表
        goods_evaluate_image: [],//处理后的上传图片列表
        stringImg: '',//字符串格式的图片
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        console.log(options)
        that.setData({
            id: options.id
        })
        that.getProDes()
        that.refundReasonList()
    },
    //获取基本信息
    getProDes() {
        var that = this;
        var data = that.data.id;
        wx.request({
            url: hostUrl + '/refund/' + data,
            method: 'GET',
            data: '',
            success: function (res) {
                var res = res.data;
                console.log(res)
                if (res.code == 1) {
                    that.setData({
                        proDes: res.data.list,
                    })
                    var arr = that.data.proDes
                    arr.forEach(item => {
                        that.data.totalPrice += item.product_fact_price * item.num
                    });
                    console.log(that.data.totalPrice)
                    let t = that.data.totalPrice
                    that.setData({
                        totalPrice: t.toFixed(2),
                    })
                } else { }
            },
        })
    },
    // 关闭送达时间弹窗
    closeModal_time: function () {
      var that = this;
      that.setData({
        isShowModal: false
      })
    },
    //退款原因
    refundReasonList() {
        var that = this;
        var data = {
            oid: app.globalData.oid,
        }
        wx.request({
            url: hostUrl + '/refundreason',
            method: 'GET',
            data: data,
            success: function (res) {
                var res = res.data;
                console.log(res)
                if (res.code == 1) {
                    that.setData({
                        reasonList: res.data,
                    })
                } else { }
            },
        })
    },
    //显示退款原因弹窗
    refundReason() {
        var that = this;
        that.setData({
            isShowModal: true,
        })
    },
    //选择退款原因
    chooseReason(index) {
        var that = this;
        var index = index.currentTarget.dataset.index
        that.setData({
            isShowModal: false,
            reason: that.data.reasonList[index]
        })
    },
    //关闭退款原因弹窗
    closeModal() {
        var that = this;
        that.setData({
            isShowModal: false,
        })
    },
    //上传图片
    addImg: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var imgLists = res.tempFilePaths;
                console.log(imgLists)
                if (that.data.imgLists.length + imgLists.length < 4) {
                    for (var i = 0; i < imgLists.length; i++) {
                        that.data.imgLists.push(imgLists[i])
                    }
                    that.setData({
                        imgLists: that.data.imgLists,
                    })
                }
                else {
                    for (var i = 0; i < 4 - that.data.imgLists.length; i++) {
                        that.data.imgLists.push(imgLists[i])
                    }
                    that.setData({
                        imgLists: that.data.imgLists,
                    })
                }
                // for (var i = 0; i < that.data.imgLists.length; i++) {
                console.log(imgLists[0])
                wx.uploadFile({
                    url: hostUrl + "/xcxavatar",
                    filePath: imgLists[0],
                    name: 'avatar',
                    formData: {
                        'user': 'test'
                    },
                    success(res) {
                        console.log(res)
                        var goods_evaluate_image = that.data.goods_evaluate_image;
                        // var data = JSON.stringify(res.data);
                        var data = res.data;
                        goods_evaluate_image.push(data);
                        console.log(goods_evaluate_image)
                        that.setData({
                            goods_evaluate_image: goods_evaluate_image
                        })
                    }
                })
                // }
                console.log(that.data.goods_evaluate_image)


            },
        })
    },
    //删除图片
    clickDel: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var imgLists = that.data.imgLists;
        var goods_evaluate_image = that.data.goods_evaluate_image;
        imgLists.splice(index, 1);
        goods_evaluate_image.splice(index, 1)
        that.setData({
            imgLists: imgLists,
            goods_evaluate_image: goods_evaluate_image
        })
        console.log(that.data.goods_evaluate_image)


    },
    //退款描述
    maxSize: function (e) {
        console.log(e)
        var that = this;
        var maxLen = 200;
        var len = e.detail.value;
        // maxLen -= len.length;
        that.setData({
            maxLen: maxLen,
            message: len
        })
    },
    //提交
    submit() {
        var that = this;
        if (that.data.reason == '') {
            wx.showToast({
                title: '请选择退款原因！',
                icon: 'none',
            })
        }
        else {
            wx.showLoading({
                title: '提交申请中',
            })
            var goods_evaluate_image = that.data.goods_evaluate_image
            // console.log(goods_evaluate_image)
            var stringImg = goods_evaluate_image.toString()
            console.log(stringImg)
            that.setData({
                stringImg: stringImg,
            })
            that.tosubmit()
        }
    },
    //提交接口
    tosubmit() {
        var that = this;
        var data = that.data.id + '?proof_cause=' + that.data.reason + '&proof_img=' + that.data.stringImg + '&proof_content=' + that.data.message;
        wx.request({
            url: hostUrl + '/refund/' + data,
            method: 'PUT',
            data: '',
            success: function (res) {
                var res = res.data;
                console.log(res)
                if (res.code == 1) {
                    wx.showToast({
                        title: '申请成功！',
                        icon: 'none',
                    })
                    wx.hideLoading();
                    setTimeout(() => {
                        wx.redirectTo({
                            url: '../refundList/refundList',
                        })
                    }, 2000)
                } else { }
            },
        })

    },
})