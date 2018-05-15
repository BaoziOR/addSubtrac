var constValue = require('./utils/constValue.js');
var util = require('./utils/util.js');

//app.js
var app;
App({
  onLaunch: function (ops) {
    app = this;   
    this.login();  
    app.console.log("onlaunch scene " + ops.scene);
    if (ops.scene == "1007" || ops.scene == "1008") {
      app.console.log("onLaunch with share");
    } 
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  onShow: function (ops) {
   
  },

  onHide: function (ops) {
    
  },  

  // 登录
  login: function () {
    app.getSetting();
  },

  // 获取用户信息
  getSetting: function () {
    // app.console.log("getSetting");
    wx.getSetting({
      success: res => {
        app.console.log("是否授权 " + res.authSetting['scope.userInfo']);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {           
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo;  
              app.console.log(res.userInfo);                
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况             
              if (app.userInfoReadyCallback) {
                app.userInfoReadyCallback(res)               
              }
            }
          })
        }
        else {
          app.console.log("wx authorize");
          wx.authorize({
            scope: 'scope.userInfo',
            success: () => {
              app.getSetting();
            }
          })
        }
      }
    })
  },  

  getResourceUrl: function () {
    if (this.globalData.innerNet) {
      return "https://littlegame.resource.ac.yxd17.com/ac/wx/master/";
    }
    return "https://littlegame.resource.ac.yxd17.com/ac/wx/master/";
  },

  //小游戏通用的资源服务器地址
  getCommonResourceUrl: function () {
    // if (this.globalData.innerNet) {
    //   return "http://106.14.153.203/";//
    // }
    return "https://littlegame.resource.ac.yxd17.com/ac/wx/common/";
  },

  getServertUrl: function () {
    if (this.globalData.innerNet) {
      return "http://192.168.19.43:3000";
    }
    return "https://littlegame.server.ac.yxd17.com";
  },


  console: {
    log: function (msg) {
      if (app.globalData.console) {     
        console.log(msg)
      }
    }
  }, 

  onShareAppMessage: function () {
    var that = this;
    return {
      title: app.globalData.userInfo.nickName + "正在最强耳朵中称王称霸，敢来挑战吗？",
      path: '/pages/login/login?roomId=' + that.data.roomIndex,
      success(res) {
        app.console.log("转发成功.....");
        app.share();
      }
    }
  },

  setOpenId: function(openId, sessionKey) {
    this.globalData.openId = openId;
    this.globalData.sessionKey = sessionKey;
  },

  getOpenId: function() {
    return this.globalData.openId;
  },

  getKey: function() {
    return this.globalData.openId + "_" + constValue.GAME_ID;
  },

  getSessionKey: function() {
    return this.globalData.sessionKey;
  },

  getUserInfo: function() {    
    return app.globalData.userInfo;
  },

  setUserInfoReadyCallback: function(cb) {   
    app.userInfoReadyCallback = cb;    
  },

  getInintBaseInfo: function() {
    var date = new Date();
    var initData = {     
        canFightNum: 1,
        haveFightNum: 0,
        maxScore: 0,
        dollNum: 0,
        day: date.getDate(),
        gids: []    
    }
    return initData;
  },

  setBaseInfo: function(baseData) {
    this.globalData.serverData['baseInfo'] = baseData;
  }, 

  updateBaseInfoToDB: function() {
    wx.request({
      url: this.getServertUrl() + "/hset",
      data: {
        key: app.getKey(),
        field: "baseInfo",
        gameId: constValue.GAME_ID,
        value: JSON.stringify(this.globalData.serverData['baseInfo'])
      }
    })
  },

  updateWXInfoToDB: function() {
    var userInfo = this.getUserInfo();
    var obj = {
      name: userInfo.nickName,
      url: userInfo.avatarUrl,
      province: userInfo.province
    }
    wx.request({
      url: this.getServertUrl() + "/hset",
      data: {
        key: app.getKey(),
        field: "wxInfo",
        gameId: constValue.GAME_ID,
        value: JSON.stringify(obj)
      }
    })
  }, 

  incrTotalFightNum: function(num) {
    wx.request({
      url: this.getServertUrl() + "/incrby",
      data: {
        key: constValue.totalFightKey,
        gameId: constValue.GAME_ID,
        increment: num       
      }
    })
  },

  updateTotalFightNum: function(num) {
    this.globalData.totalFightNum = num;
  },

  getTotalFightNum : function() {
    return this.globalData.totalFightNum + 30000;
  },

  getBaseInfo: function() {
    return this.globalData.serverData['baseInfo'];
  },

  addFightNum: function() {
    var randNum = Math.floor(Math.random() * 30) + 1;
    this.globalData.serverData['baseInfo'].haveFightNum++;
    this.globalData.totalFightNum += randNum;
    if (this.globalData.serverData['baseInfo'].canFightNum > 0) {
      this.globalData.serverData['baseInfo'].canFightNum--;
    }
    this.incrTotalFightNum(randNum);
    this.updateBaseInfoToDB();
    this.zaddWillRank();
  },

  updateMaxScoreAndDollNum: function(num, win) {
    var score = this.globalData.serverData['baseInfo'].maxScore;
    if (score < num) {
      this.globalData.serverData['baseInfo'].maxScore = num;
      this.updateBaseInfoToDB();
    }
    if (win) {
      this.globalData.serverData['baseInfo'].dollNum++;
      this.globalData.serverData['baseInfo'].winDate = util.getYMD();
      this.updateBaseInfoToDB();     
      wx.request({
        url: app.getServertUrl() + "/hset",
        data: {
          key: "gotDollKey",
          field: Date.now(),
          gameId: constValue.GAME_ID,
          value: app.getKey()
        }
      })
      app.console.log(app.getServertUrl());
      app.console.log(util.getDayGetDollNumKey());
      wx.request({
        url: app.getServertUrl() + "/incrby",
        data: {
          key: util.getDayGetDollNumKey(),         
          gameId: constValue.GAME_ID,
          increment: 1           
        }
      })

      wx.reportAnalytics('gotdoll', {
        num: 1,
      });
    }
  },

  getCanFightNum: function() {
    return this.globalData.serverData['baseInfo'].canFightNum;
  },

  getDollNum: function () {
    return this.globalData.serverData['baseInfo'].dollNum;
  },

  decDollNum: function() {
    if (this.globalData.serverData['baseInfo'].dollNum > 0) {
      this.globalData.serverData['baseInfo'].dollNum--;
      this.updateBaseInfoToDB();
    }
  },

  dealFightNumWhenLogin: function() {
    var date = new Date();
    if (this.globalData.serverData['baseInfo'].day != date.getDate()) {
      this.globalData.serverData['baseInfo'].day = date.getDate();
      this.globalData.serverData['baseInfo'].canFightNum++;
      this.globalData.serverData['baseInfo'].gids = [];
      this.updateBaseInfoToDB();
    }
  },

  dealShareGid: function(gid) {
    if (this.globalData.serverData['baseInfo'].gids.length > 10) {
      return -1; //超过10个群的限制
    }
    if (this.globalData.serverData['baseInfo'].gids.indexOf(gid) == -1) {
      this.globalData.serverData['baseInfo'].gids.push(gid);
      this.globalData.serverData['baseInfo'].canFightNum++;
      this.updateBaseInfoToDB();
      return 0;
    }
    return -2; //此群已经分享过了
  },

  //过审核用的逻辑
  addShareNum: function () {  
      this.globalData.serverData['baseInfo'].canFightNum++; 
  },

  getWinDate: function () {
    return this.globalData.serverData['baseInfo'].winDate;
  },

  zaddWillRank: function() {
    wx.request({
      url: this.getServertUrl() + "/zadd",
      data: {
        key: "willRank",
        score: this.globalData.serverData['baseInfo'].haveFightNum,
        gameId: constValue.GAME_ID,
        member: app.getKey() 
      }
    })
  },

  setTodayAllGotDollNum: function(num) {
    this.globalData.todayAllGotDollNum = num;
  },

  getTodayAllGotDollNum: function() {
    return this.globalData.todayAllGotDollNum;
  },

  //暂时未用
  requestServer: function(operation, data, success, fail, complete) {
    var httpData = {
      gameId: constValue.GAME_ID
    }
    for (var key in data) {
      httpData[key] = data[key];
    } 
    wx.request({
      url: app.getServertUrl() + "/" + operation,
      data: httpData,
      success: function(res) {
        if (typeof success === "function") {
          success(res);
        }
      },
      fail: function(res) {
        if (typeof fail === "function") {
          success(res);
        }
      },
      complete: function(res) {
        if (typeof complete === "function") {
          success(res);
        }
      }
    })
  },

  initLittleGameInfoConfig: function(data) {
    for (var key in data) {
      data[key].pic = app.getResourceUrl() + 'imgs/' + data[key].pic;
    }
    this.globalData.littleGameInfoConfig = data;
  }, 

  getLittleGameInfoConfig: function() {
    return this.globalData.littleGameInfoConfig;
  },

  getOneLittleGameInfo: function(id) {
    for (var key in this.globalData.littleGameInfoConfig) {
      if (id == key) {
        return this.globalData.littleGameInfoConfig[key];
      }
    }
  },

  setConfig: function(data) {
    this.globalData.config = data;
  },

  getConfig: function() {
    return this.globalData.config;
  },


  globalData: {
    console: false,
    innerNet: false,   
    userInfo: null,
    openId: null, // 自己的openId     
    sessionKey: null,  
    serverData: {},
    totalFightNum: 0,
    todayAllGotDollNum: 0,
    littleGameInfoConfig: null,
    config: null,
  }
})