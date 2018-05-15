var headUrl = "https://littlegame.resource.ac.yxd17.com/ac/wx/superear_test/AI/Image/";

const app = getApp();
var constValue = require('../../utils/constValue.js');
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "../../resources/imgs/main/",
    selfPage: 1, //0表示个人信息页面，1表示挑战页面
    changeTextIndex: 0,  //0表示荣誉榜，1表示毅力榜，2表示娃娃奖牌
    honorRank: [
      { index: 1, url: headUrl + "1.jpg", name: "各自生欢", num: 20, bg: '#fea13a' },
      { index: 2, url: headUrl + "2.jpg", name: "尘缘若梦", num: 19, bg: '#ff4341' },
      { index: 3, url: headUrl + "3.jpg", name: "森芋暖暖", num: 19, bg: '#42c3ff' },
      { index: 4, url: headUrl + "4.jpg", name: "薄荷绿", num: 17, bg: '#bfbfbf' },
      { index: 5, url: headUrl + "5.jpg", name: "国产小祖宗", num: 15, bg: '#bfbfbf' },
      { index: 6, url: headUrl + "6.jpg", name: "墨雨浅殇、", num: 14, bg: '#bfbfbf' },
      { index: 7, url: headUrl + "7.jpg", name: "南柯梦", num: 14, bg: '#bfbfbf' },
      { index: 8, url: headUrl + "8.jpg", name: "出租半张床", num: 13, bg: '#bfbfbf' }
    ],
    selfImg: null,
    selfName: null,
    dollNum: 0, //可以领取的娃娃数目
    dollInfo: [
      { img: "1.jpg", name: "粉红豹" }, { img: "2.jpg", name: "马里奥兄弟" }, { img: "3.jpg", name: "皮卡丘"},
      { img: "4.jpg", name: "3D愤怒小鸟公仔" }, { img: "5.jpg", name: "单身狗" }, { img: "6.jpg", name: "倒霉熊" },
      { img: "7.jpg", name: "桃子" }, { img: "8.jpg", name: "小马宝莉" }, { img: "9.jpg", name: "么么小刺猬 " },
      { img: "10.jpg", name: "阿狸" }
       ],
    otherProgram: [{ pic: "liamxiamicon.png", text1: "连连线", text2: "很好玩的游戏哟！" }],
    fightNum: 0, //总共挑战次数
    canFightNum: 0, //挑战机会
    haveFightNum: 0, //已经挑战次数
    maxScore: 0, //最高分
    notEnoughFightNum: 0, //挑战次数不够
    willRank: [
      { index: 1, openid: "", url: headUrl + "9.jpg", name: "得而不惜", num: 336, bg: '#fea13a' },
      { index: 2, openid: "", url: headUrl + "10.jpg", name: "旖旎", num: 290, bg: '#ff4341' },
      { index: 3, openid: "", url: headUrl + "11.jpg", name: "Bitter", num: 263, bg: '#42c3ff' },
      { index: 4, openid: "", url: headUrl + "12.jpg", name: "早春的树", num: 210, bg: '#bfbfbf' },
      { index: 5, openid: "", url: headUrl + "13.jpg", name: "不要对我好", num: 160, bg: '#bfbfbf' },
      { index: 6, openid: "", url: headUrl + "14.jpg", name: "三三得九", num: 135, bg: '#bfbfbf' },
      { index: 7, openid: "", url: headUrl + "15.jpg", name: "少女大佬", num: 126, bg: '#bfbfbf' },
      { index: 8, openid: "", url: headUrl + "16.jpg", name: "迷妹超冷", num: 98, bg: '#bfbfbf' }
    ],
    initWillRank: 0,
    showDiag: 0, //
    showInput: 0,
    newOtherProgram: null,
    shwoFriendFight: 0,
    outerVersion: 3    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.updateData();
    if (this.data.initWillRank == 0) {
      this.data.initWillRank = 1;
      this.getWillRank();
    }
  },

  getWillRank: function () {
    var that = this;
    wx.request({
      url: app.getServertUrl() + '/zrevrange',
      data: {
        key: "willRank",
        start: 0,
        stop: 8,
        gameId: constValue.GAME_ID,
        withscores: "withscores"
      },
      success: function (res) {
        app.console.log('willrank success.....')
        app.console.log(res);
        var needGetInfo = [];
        for (var i = 0; 2 * i < res.data.length; i++) {
          var score = res.data[2 * i + 1];
          app.console.log(score);
          for (var j = 0; j < that.data.willRank.length; j++) {
            if (that.data.willRank[j].num < score) {
              that.data.willRank[j].openid = res.data[2 * i];
              that.data.willRank[j].num = res.data[2 * i + 1];
              needGetInfo.push(res.data[2 * i]);
              break;
            }
          }
        }
        app.console.log(needGetInfo);
        if (needGetInfo.length) {
          wx.request({
            url: app.getServertUrl() + '/hmget',
            data: {
              keys: JSON.stringify(needGetInfo),
              gameId: constValue.GAME_ID,
              fields: JSON.stringify(['wxInfo'])
            },
            success: function (res) {
              app.console.log('get all info success.....')
              app.console.log(res.data);   
              that.dealWillRank(res.data);           
            },
            fail: function (res) {
              app.console.log('get all fail........')
            },
            complete: function () {
              app.console.log('get all complete.....')
            }
          })
        }
      },
      fail: function (res) {
        app.console.log('willRank fail........')
      },
      complete: function () {
        app.console.log('willRank complete.....')
      }
    })
  },


  dealWillRank: function(data) {
    for (var i = 0; i < data.length; i++) {
      var openid = data[i].key;
      for (var j = 0; j < this.data.willRank.length; j++) {
        var item = this.data.willRank[j];
        if (item.openid == openid) {
          app.console.log('find openid' + openid)
          app.console.log(data[i].values[0].data)
          var obj = JSON.parse(data[i].values[0].data);         
          item.url = obj.url;
          item.name = obj.name;
          app.console.log(item.headUrl);
          app.console.log(item.name)
          break;
        }
      }
    }
    this.setData({
      willRank : this.data.willRank
    })
  },

  updateData: function () {  
    this.data.newOtherProgram = app.getLittleGameInfoConfig(); 
    var baseInfo = app.getBaseInfo();
    this.data.fightNum = app.getTotalFightNum();
    this.data.canFightNum = baseInfo.canFightNum;
    this.data.haveFightNum = baseInfo.haveFightNum;
    this.data.maxScore = baseInfo.maxScore;
    this.data.dollNum = baseInfo.dollNum;

    var userInfo = app.getUserInfo();
    this.data.selfImg = userInfo.avatarUrl;
    this.data.selfName = userInfo.nickName;

    var config = app.getConfig();
    this.data.shwoFriendFight = config.showFriendFight;
    this.setData({
      selfImg: this.data.selfImg,
      selfName: this.data.selfName,
      fightNum: this.data.fightNum,
      canFightNum: this.data.canFightNum,
      haveFightNum: this.data.haveFightNum,
      maxScore: this.data.maxScore,
      dollNum: this.data.dollNum,
      newOtherProgram: this.data.newOtherProgram,
      shwoFriendFight: this.data.shwoFriendFight    
    })
  },

  closeInvite: function () {
    this.data.notEnoughFightNum = 0;
    this.setData({
      notEnoughFightNum: this.data.notEnoughFightNum
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.updateData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  jumpToFight: function () {    
    if (app.getCanFightNum() <= 0) {
      this.data.notEnoughFightNum = 1;
      this.setData({
        notEnoughFightNum: this.data.notEnoughFightNum
      })
      return;
    }
    app.console.log(app.getWinDate())
    app.console.log(util.getYMD())
    if (app.getWinDate() == util.getYMD()) {
      wx.showModal({
        title: '',
        content: '题库已空，请明日再来',
        showCancel: false
      })
      return;
    }
    app.addFightNum();
    var date = new Date();
    wx.request({
      url: app.getServertUrl() + '/get',
      data: {
        key: util.getDayGetDollNumKey(),      
        gameId: constValue.GAME_ID        
      },
      success: function (res) {
        if (res.data) {
          app.setTodayAllGotDollNum(parseInt(res.data));
        }
        wx.redirectTo({
          url: '../answer/answer'
        });
      },
      fail: function (res) {
        app.console.log('decrypt fail........')
      },
      complete: function () {
        app.console.log('decrypt complete.....')
      }
    })    
  },

  clickHonorRank: function () {
    this.data.changeTextIndex = 0;
    this.setData({
      changeTextIndex: this.data.changeTextIndex
    })
  },

  clickWillRank: function () {
    this.data.changeTextIndex = 1;
    this.setData({
      changeTextIndex: this.data.changeTextIndex
    })
  },

  clickDollRank: function () {
    this.data.changeTextIndex = 2;
    this.setData({
      changeTextIndex: this.data.changeTextIndex
    })
  },

  selectFight: function () {
    this.data.selfPage = 1;
    this.setData({
      selfPage: this.data.selfPage
    })
  },

  selectSelfInfo: function () {
    this.data.selfPage = 0;
    this.updateData();
    this.setData({
      selfPage: this.data.selfPage
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '[有人@我]发起挑战，会算1+2=？么....',
      path: '/pages/login/login',
      imageUrl: '../../resources/imgs/main/share.jpg',
      success(res) { 
        var config = app.getConfig();       
        that.data.notEnoughFightNum = 0;
        that.setData({
          notEnoughFightNum: that.data.notEnoughFightNum
        })  
        app.console.log("xxxxxxxxxxxxxxxx2 self share")
        app.console.log(config.showFriendFight);
        app.console.log(that.data.outerVersion)
        if (config.showFriendFight == that.data.outerVersion) { //过审核逻辑用
          app.console.log("xxxxxxxxxxxxxxxx1 self share")
          app.addShareNum();
          wx.showModal({
            title: '',
            content: '分享成功，挑战次数+1',
            showCancel: false
          })
          return;
        }   
        if (!res.shareTickets) {     
         if (config.showFriendFight == that.data.outerVersion) { //过审用
            wx.showModal({
              title: '',
              content: '分享成功',
              showCancel: false
            })  
          } else {
            wx.showModal({
              title: '',
              content: '分享个人无效，请分享到群',
              showCancel: false
            })  
          }         
          return;
        }
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {         
          wx.showModal({
            title: '',
            content: '分享个人无效，请分享到群',
            showCancel: false
          })  
          return false;
        }       
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            app.console.log(encryptedData);
            app.console.log(iv);
            wx.request({
              url: app.getServertUrl() + '/decrypt',
              data: {
                iv: iv,
                encryptedData: encryptedData,
                sessionKey: app.getSessionKey(),
                gameId: constValue.GAME_ID,
                littleGameId: constValue.GAME_ID
              },
              success: function (res) {
                app.console.log('decrypt success.....')
                app.console.log(res.data);
                that.dealShareResult(res.data);
              },
              fail: function (res) {
                app.console.log('decrypt fail........')
              },
              complete: function () {
                app.console.log('decrypt complete.....')
              }
            })
          },
          fail: function (res) {

          },
          complete: function (res) {

          }
        })
      }
    }
  },

  dealShareResult: function (data) {
    var config = app.getConfig(); 
    if (config.showFriendFight == this.data.outerVersion) { //过审核逻辑用
      app.addShareNum();
      wx.showModal({
        title: '',
        content: '分享成功，挑战次数+1',
        showCancel: false
      })
      return; 
    }
    if (data && data['openGId']) {
      var ret = app.dealShareGid(data.openGId);
      if (ret == 0) {
        app.console.log('dealShareResult 11111111')
        wx.showModal({
          title: '',
          content: '分享成功，挑战次数+1',
          showCancel: false
        })
      } else if (ret == -1) {
        wx.showModal({
          title: '',
          content: '每天最多只能获得10次免费机会哦',
          showCancel: false
        })      
      } else {
        if (config.showFriendFight == this.data.outerVersion) { //过审用
          wx.showModal({
            title: '',
            content: '分享成功!',
            showCancel: false
          })      
        } else {
          wx.showModal({
            title: '',
            content: '已经在该群分享过',
            showCancel: false
          })      
        }        
      }
      this.updateData();
    } else {
      app.console.log('dealShareResult 222222222222')
      if (!config.showFriendFight) { //过审用
        wx.showModal({
          title: '',
          content: '分享成功!',
          showCancel: false
        })  
      } else {
        wx.showModal({
          title: '',
          content: '分享个人无效，请分享到群',
          showCancel: false
        })  
      }    
    }
  },

  jumpToOtherProgram: function () {
    wx.navigateToMiniProgram({
      appId: 'wx26f87a3ccbcec389',
      path: 'pages/loading/loading',
      envVersion: 'trial',
      success(res) {
        wx.reportAnalytics('clickline', {
          num: 1
        });
        // 打开成功
        app.console.log("成功分享");
      }
    })
  },
   
  tuibiaoTap: function() {
    this.data.showDiag = 1;
    this.setData({
      showDiag: this.data.showDiag
    })
  },

  closeDiag: function() {
    this.data.showDiag = 0;
    this.setData({
      showDiag: this.data.showDiag
    })
  },

  formSubmit: function(e) {
    this.data.showInput = 0;
    this.setData({
      showInput: this.data.showInput
    })
    app.decDollNum();
    e.detail.value['date'] = util.getYMD();
    wx.request({
      url: app.getServertUrl() + "/hset",
      data: {
        key: "dollUserInfo",
        field: app.getKey() + "_" + Date.now() / 1000,
        gameId: constValue.GAME_ID,
        value: JSON.stringify(e.detail.value)
      }
    })
    app.console.log(e.detail.value);
  },
   
  cancelInput: function() {
    this.data.showInput = 0;
    this.setData({
      showInput: this.data.showInput
    })
  },

  showInput: function() {
    if (app.getDollNum() > 0) {
      this.data.showInput = 1;
      this.setData({
        showInput: this.data.showInput
      })
    } else {
      wx.showModal({
        title: '',
        content: '没有领取娃娃的次数',
        showCancel: false
      })
    }    
  },

  /*
  newOtherProgramButtonAction: function(e) {   
    var id = e.currentTarget.id;
    app.console.log(id);
    var info = app.getOneLittleGameInfo(id);
    app.console.log(info);
    wx.navigateToMiniProgram({
      appId: info.appId,
      path: info.path,
      envVersion: 'trial',
      success(res) {
        wx.reportAnalytics('clickline', {
          num: id
        });
        // 打开成功
        app.console.log("成功分享");
      }
    })
  }*/

  newOtherProgramButtonAction: function () {   
    wx.navigateToMiniProgram({
      appId: "wx26f87a3ccbcec389",
      path: "pages/loading/loading",
      envVersion: 'trial',
      success(res) {
        wx.reportAnalytics('clickline', {
          num: id
        });
        // 打开成功
        app.console.log("成功分享");
      }
    })
  }

})