// pages/mySubpackage/pages/feedback/feedback.js
Page({

     /**
      * 页面的初始数据
      */
     data: {
          imgLists:[],
          len:0,
          curIndex:0,
          feedbackList:[
               { id: 1, title: '商品、购买' },
               { id: 2, title: '登录、注册' },
               { id: 3, title: '商品、购买' },
               { id: 4, title: '支持、订单' },
               { id: 5, title: '推荐有奖' },
               { id: 6, title: '地址、提现' },
               { id: 7, title: '其他' },
               { id: 8, title: '新建议' },
          ],
          submitWait:true,
          isShowModal:false,
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
     },
     //反馈类型
     feedbackType:function(e){
          console.log(e)
          var that = this;
          var curIndex = e.currentTarget.dataset.index;
          that.setData({
               curIndex: curIndex,
          })
     },
     //获取文本域的长度
     getLentgh:function(e){
          var that = this;
          var len = 0;
          var maxLen = e.detail.value;
          len += maxLen.length;
          that.setData({
               len:len,
          })
     },
     //上传图片
     addImg:function(){
          var that = this;
          wx.chooseImage({
               count:3,
               sizeType: ['original','compressed'],
               sourceType: ['album','camera'],
               success: function(res) {
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
                    else{
                         for (var i = 0; i < 4 - that.data.imgLists.length; i++) {
                              that.data.imgLists.push(imgLists[i])
                         }
                         that.setData({
                              imgLists: that.data.imgLists,
                         }) 
                    }
               },
          })
     },
     //删除图片
     clickDel: function (e) {
          var that = this;
          var index = e.currentTarget.dataset.index;
          var imgLists = that.data.imgLists;
          imgLists.splice(index, 1);
          that.setData({
               imgLists: imgLists,
          })

     },
     //提交
     submitBtn:function(){
          var that = this;
          // 创建一个动画实例
          var animation = wx.createAnimation({
               // 动画持续时间
               duration: 500,
               // 定义动画效果，当前是匀速
               timingFunction: "linear",
               delay: 0,
          })
          // 将该变量赋值给当前动画
          that.animation = animation;
          // 先在y轴偏移，然后用step()完成一个动画
          animation.opacity(0).step();
          // 用setData改变当前动画
          that.setData({
               // 通过export()方法导出数据
               animationData: animation.export(),
               // 改变view里面的Wx：if
               isShowModal: true
          })
          // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
          setTimeout(function () {
               animation.opacity(1).step();
               that.setData({
                    animationData: animation.export()
               })
          }, 200)
          that.setData({
               submitWait:false,
          })
     },
     //关闭弹窗
     cancleModal: function () {
          var that = this;
          var animation = wx.createAnimation({
               duration: 1000,
               timingFunction: 'linear'
          })
          that.animation = animation
          animation.opacity(0).step();
          that.setData({
               animationData: animation.export()

          })
          setTimeout(function () {
               animation.opacity(1).step();
               that.setData({
                    animationData: animation.export(),
                    isShowModal: false
               })
          }, 500)
     }
})