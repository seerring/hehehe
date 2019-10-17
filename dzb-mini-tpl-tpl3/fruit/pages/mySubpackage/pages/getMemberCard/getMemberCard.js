// pages/mySubpackage/pages/getMemberCard/getMemberCard.js
Page({

     /**
      * 页面的初始数据
      */
     data: {
          time:'获取验证码',
          isClick:false,
          currentTime:60,
          phone:'',
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {

     },
     //手机号
     inpVal:function(e){
          var that = this;
          console.log(e.detail.value);
          var phone = e.detail.value;
          that.setData({
               phone: phone,
          })
     },
     //获取验证码
     getCode:function(){
          var that = this;
          if(!that.data.phone){
               wx.showToast({
                    icon: 'none',
                    title: '请填写手机号！',
               })
          }
          else if (that.data.phone.length != 11){
               wx.showToast({
                    icon: 'none',
                    title: '手机号有误！',
               })
          }
          else{
               var currentTime = that.data.currentTime;
               that.setData({
                    time: currentTime + 's',
                    isClick: true,
               })
               var interval = setInterval(() => {
                    that.setData({
                         time: --currentTime + 's',
                    })
                    if (currentTime <= 0) {
                         clearInterval(interval);
                         that.setData({
                              time: '重新获取',
                              currentTime: 60,
                              isClick: false,
                         })
                    }
               }, 1000)
          }
     },
     //提交
     submitBtn(e){
          console.log(e);
          var that = this;
          var value = e.detail.value;
          console.log(value);
          if(!value.name){
               wx.showToast({
                    icon:'none',
                    title: '请填写姓名！',
               })
          }
          else if (!value.phone){
               wx.showToast({
                    icon: 'none',
                    title: '请填写手机号！',
               })
          }
          else if (value.phone.length != 11){
               wx.showToast({
                    icon: 'none',
                    title: '手机号有误！',
               })
          }
          else if(!value.code){
               wx.showToast({
                    icon: 'none',
                    title: '请输入验证码！',
               })
          }
          else{
               wx.showToast({
                    icon:'none',
                    title: '恭喜您，领取成功！',
               })
               setTimeout(function(){
                    wx.reLaunch({
                         url: '../memberCard/memberCard',
                    })
               },1000)
          }
     }
})