
const constValue = require('../../utils/constValue.js');
const app = getApp();
var login;

Page({
  data: {   

  },

  onLoad: function (options) {
    this.loadStaticDatas();
    login = this;   
    app.setUserInfoReadyCallback(this.getOpenID);
    this.getOpenID();
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  }, 

  getOpenID: function() {      
    if (app.getUserInfo()) { 
      wx.login({
        success: res => {
          wx.request({
            url: app.getServertUrl() + '/openid',
            data: {
              code: res.code,
              gameId: constValue.GAME_ID,
              littleGameId: constValue.GAME_ID
            },
            success: function(res) {       
              app.console.log('login success.....')  
              app.console.log(res.data);    
              app.setOpenId(res.data.openid, res.data.session_key);  
              login.getUserData();          
            },
            fail: function(res) {
              app.console.log('login fail........')
            },
            complete: function() {
              app.console.log('login complete.....')             
            }
          })           
        }
      })
    }
  },

  getUserData: function() {
    var that = this;
    wx.request({
      url: app.getServertUrl() + '/hget',
      data: {
        key: app.getKey(),
        gameId: constValue.GAME_ID,
        field: "baseInfo"
      },
      success: function (res) {
        app.console.log('get server success.....')
        if (!res.data) {
          app.console.log('login data is null....')
          res.data = app.getInintBaseInfo();
          app.setBaseInfo(res.data);
          app.updateBaseInfoToDB();
          app.updateWXInfoToDB();
        }
        app.setBaseInfo(res.data);
        app.dealFightNumWhenLogin();
        that.getTotalFightNum();         
      },
      fail: function (res) {
        app.console.log('login fail........')
      },
      complete: function () {
        app.console.log('login complete.....')
      }
    })  
   
  },

  getTotalFightNum: function() {
    wx.request({
      url: app.getServertUrl() + "/get",
      data: {
        gameId: constValue.GAME_ID,
        key: constValue.totalFightKey        
      },
      success: function (res) {
        app.console.log('get total fight num ')
        app.console.log(res);
        var num = 0;
        if (res.data) {
          num = parseInt(res.data);
        } 
        app.updateTotalFightNum(num);  
        wx.redirectTo({
          url: '../main/main'
        });     
      },
      fail: function (res) {
        app.console.log('key fail........')
      },
      complete: function () {
        app.console.log('key complete.....')
      }
    })
  },

  // 加载静态数据
  loadStaticDatas: function () {  
    // 获取题目配置表
    wx.request({
      url: app.getResourceUrl() + "config/littleGameInfo.json" + "?" + Math.floor(Math.random() * 100000),
      success: function (res) {       
        app.console.log(res.data);
        app.initLittleGameInfoConfig(res.data);       
      },
      fail: function () {
        app.console.log('load littleGameInfo json fail...')        
      }
    }); 
    wx.request({
      url: app.getResourceUrl() + "config/config.json" + "?" + Math.floor(Math.random() * 100000),
      success: function (res) {
        app.console.log(res.data);
        app.setConfig(res.data);
      },
      fail: function () {
        app.console.log('load littleGameInfo json fail...')
      }
    });     
  },
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {  
    return {
      title: '余音绕梁，三日不绝，这些声音你还记得多少？',
      path: '/pages/login/login',
      imageUrl: "../../resources/imgs/common/gongzhonghao_1.png",
      success(res) {

      }
    }
  },

  onUnload:function() {    
  }
})

