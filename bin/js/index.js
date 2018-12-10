/**
 * 开放作用域入口，用于初始化程序，加载资源等
 */

const Loader = laya.net.Loader;
const Handler = laya.utils.Handler;
const WebGL = laya.webgl.WebGL;
const Sprite = Laya.Sprite;
const Text = Laya.Text;
const List = Laya.List;
var Button = Laya.Button;

Laya.MiniAdpter.init(true, true);//初始化微信小游戏
/* start 初始化舞台*/
var height = Laya.Browser.clientHeight;
var width = Laya.Browser.clientWidth;
Laya.init(width, height);
var SELF_STAGE = new Laya.Sprite();
SELF_STAGE.width = 700;
SELF_STAGE.height = 850;
Laya.stage.addChild(SELF_STAGE);
Laya.stage.bgColor = null;
SELF_STAGE.scale(width / 700, height / 850);
SELF_STAGE.pos(0, 0);
/* end 初始化舞台*/

/**
 * 列表元素
 */

class ListItem extends Laya.Button {
    constructor() {
        super('sourses/listdi3.png');
        this.stateNum = 1;
        this.sizeGrid = "34,34,34,34,1";
        this.height = 152
        this.width = 678
    }
}

function initList() {
    //列表
    var listContain = new Laya.List();
    /* start加载资源 */
    var sourses = [
        { url: 'sourses/listdi3.png', type: Laya.Loader.IMAGE },
    ];
    Laya.loader.load(sourses, Laya.Handler.create(this, soursesLoadedHandle, null, false));
    /* end 加载资源 */
    //资源加载完事件
    function soursesLoadedHandle() {

        function rankDetailItem() {
            rankDetailItem.__super.call(this);
            //申请位置并不渲染
            this.item = new Laya.Sprite();
            this.item.width = 678;
            this.item.height = 152;
            this.addChild(this.item);
            this.setData = function (data, index) {
                this.item.removeChildren();
                this.rankDetai = new ListItem();
                this.rankDetai.height = 152
                this.rankDetai.width = 680;
                this.item.addChild(this.rankDetai)
                //index
                indexText = new Text();
                indexText.changeText(index + 1)
                indexText.width = 100;
                indexText.height = 45;
                indexText.align = "center";
                indexText.valign = "middle";
                indexText.color = "#ffffff";
                indexText.pos(0, 50);
                indexText.wordWrap = true;
                indexText.fontSize = 45;
                indexText.stroke = 4;
                indexText.strokeColor = "#666666";
                this.rankDetai.addChild(indexText);
                //user
                var userIcon = new Laya.Sprite();
                var userIconUrl = data.avatarUrl;
                userIcon.loadImage(userIconUrl, 0, 0, 118, 118);
                var cMask = new Sprite();
                cMask.graphics.drawCircle(59, 59, 59, "#ffffff");
                userIcon.mask = cMask;
                userIcon.pos(118, 18);
                this.rankDetai.addChild(userIcon);
                //用户名称
                var userNameText = new Text();
                userNameText.text = data.nickname;
                userNameText.width = 200;
                userNameText.height = 152;
                userNameText.align = "left";
                userNameText.valign = "middle";
                userNameText.color = "#ffffff";
                userNameText.pos(248, 0);
                userNameText.wordWrap = true;
                userNameText.fontSize = 36;
                this.rankDetai.addChild(userNameText)
                //money
                var moneyLeftext = new Text();
                moneyLeftext.text = (data.KVDataList[0] ? (data.KVDataList[0].value / 100) : 0) + "元";
                moneyLeftext.width = 220;
                moneyLeftext.height = 40;
                moneyLeftext.align = "right";
                moneyLeftext.valign = "middle";
                moneyLeftext.color = "#ffffff";
                moneyLeftext.pos(432, 32);
                moneyLeftext.wordWrap = true;
                moneyLeftext.fontSize = 36;
                this.rankDetai.addChild(moneyLeftext)
                //money
                var timetext = new Text();
                timetext.text = (data.KVDataList[1] ? data.KVDataList[1].value : 0) + "吨";
                timetext.width = 220;
                timetext.height = 36;
                timetext.align = "right";
                timetext.valign = "middle";
                timetext.color = "#ffffff";
                timetext.pos(432, 90);
                timetext.wordWrap = true;
                timetext.fontSize = 40;
                this.rankDetai.addChild(timetext)
                this.rankDetai.pos(0, 0);
                this.item.addChild(this.rankDetai);
            }
        }
        Laya.class(rankDetailItem, "rankDetailItem", Laya.Box);
        listContain.itemRender = rankDetailItem;
        listContain.repeatX = 1;
        listContain.width = 700;
        listContain.height = 850;
        listContain.pos(10, 20);//440
        // 使用但隐藏滚动条
        listContain.vScrollBarSkin = "";
        listContain.selectEnable = true;
        listContain.spaceY = 15;
        listContain.selectHandler = new Handler(this, onSelect);
        listContain.renderHandler = new Handler(this, updateItem);
        function updateItem(cell, index) {
            cell.setData(cell.dataSource, index);
        }
        function onSelect(index) {
            console.log("当前选择的索引：" + index);
        }
    }
    return listContain;
}
function initErr() {
    var errText = new Laya.Sprite();
    var errText1 = new Text();
    errText1.text = "分享到群";
    errText1.width = 678;
    errText1.height = 40;
    errText1.align = "center";
    errText1.valign = "middle";
    errText1.color = "#054E78";
    errText1.pos(0, 338);
    errText1.wordWrap = true;
    errText1.fontSize = 40;
    errText.addChild(errText1);

    var errText2 = new Text();
    errText2.text = "即可查看该群内排名";
    errText2.width = 678;
    errText2.height = 40;
    errText2.align = "center";
    errText2.valign = "middle";
    errText2.color = "#054E78";
    errText2.pos(0, 392);
    errText2.wordWrap = true;
    errText2.fontSize = 40;
    errText.addChild(errText2);

    return errText;
}
//初始化数据
wx.getFriendCloudStorage({
    keyList: ["money", "weight"],
    success: res => {
        let data = res.data
        var listContain = initList();
        listContain.array = data.sort(function (a, b) {
            return b.KVDataList[0].value - a.KVDataList[0].value;
        });
        SELF_STAGE.removeChildren();
        SELF_STAGE.addChild(listContain);
    },
    fail: err => {
        console.log("err=====>>>>>>>>", err);
    }
})
//更新数据
wx.onMessage(data => {
    console.log("wx.onMessage(data =>", data);
    if (data !== "Group") {
        wx.getGroupCloudStorage({
            keyList: ["money", "weight"],
            success: res => {
                let data = res.data
                var listContain = initList();
                listContain.array = data.sort(function (a, b) {
                    return b.KVDataList[0].value - a.KVDataList[0].value;
                });
                SELF_STAGE.removeChildren();
                SELF_STAGE.addChild(listContain);
            },
            fail: err => {
                SELF_STAGE.removeChildren();
                var errtext = initErr();
                SELF_STAGE.addChild(errtext);
            }
        })
    } else {
        wx.getFriendCloudStorage({
            keyList: ["money", "weight"],
            success: res => {
                console.log("success: res => {", res.data);
                let data = res.data
                var listContain = initList();
                listContain.array = data.sort(function (a, b) {
                    return b.KVDataList[0].value - a.KVDataList[0].value;
                });
                SELF_STAGE.removeChildren();
                SELF_STAGE.addChild(listContain);
            },
            fail: err => {
                console.log("err=====>>>>>>>>", err);
            }
        })

    }
})