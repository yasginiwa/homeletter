<template>
  <div class="letter-wrapper">
    <div
      class="letter"
      :class="[isRotated ? 'letter-rotation' : '', isRotateBack ? 'letter-unrotation' : '']"
    >
      <div class="logo">
        <div class="coorperation">
          <img src="../assets/images/crown_logo.png" alt />
          <img src="../assets/images/post_logo.png" alt />
        </div>
        <div class="logistics" @click="handleLogistics" v-if="!isEdit">
          <img src="../assets/images/wuliu.png" />
          <span>查看物流</span>
        </div>
      </div>
      <div class="paper-wrapper">
        <div class="paper" :class="isSubmit ? 'paperMove' : ''">
          <div class="paper-1">
            <div class="backside" :class="isSubmit ? 'backFold': ''"></div>
            <div class="cover" :class="isSubmit ? 'coverFold' : ''">
              <img src="../assets/images/paper_1.png" class="paper-1" />
              <div class="sender">
                <div class="title">
                  <div>收</div>
                  <div>件</div>
                  <div>人</div>
                  <div class="modifyinfo" v-show="!isEdit" @click="modifyInfo">
                    <img src="../assets/images/modify.png"/>
                    <i>修改</i>
                  </div>
                </div>
                <div class="info">
                  <div class="name">
                    <span>姓名：</span>
                    <input :disabled="!isEdit" v-model="expressInfo.Receiver.name" />
                  </div>

                  <div class="phone">
                    <span>手机：</span>
                    <input :disabled="!isEdit" v-model="expressInfo.Receiver.phone" />
                  </div>
                </div>

                <div class="address">
                  <span>所在地区：</span>
                  <v-distpicker
                    :disabled="!isEdit"
                    @selected="onRecieverSelected"
                    :province="expressInfo.Receiver.province"
                    :city="expressInfo.Receiver.city"
                    :area="expressInfo.Receiver.district"
                  ></v-distpicker>
                </div>
              </div>
            </div>
          </div>
          <div class="paper-2">
            <img src="../assets/images/paper_2.png" class="paper-2" />
            <div class="poster">
              <div class="detail">
                <span>详细地址：</span>
                <input :disabled="!isEdit" v-model="expressInfo.Receiver.address" />
              </div>

              <div class="title">
                <div>寄</div>
                <div>件</div>
                <div>人</div>
              </div>
              <div class="info">
                <div class="name">
                  <span>姓名：</span>
                  <input :disabled="!isEdit" v-model="expressInfo.Sender.name" />
                </div>

                <div class="phone">
                  <span>手机：</span>
                  <input
                    :disabled="!isEdit"
                    v-bind:readonly="isReadOnly"
                    v-model="expressInfo.Sender.phone"
                    @click="handleSenderPhone"
                  />
                </div>
              </div>

              <div class="address">
                <span>所在地区：</span>
                <v-distpicker
                  @selected="onSenderSelected"
                  :disabled="!isEdit"
                  :province="expressInfo.Sender.province"
                  :city="expressInfo.Sender.city"
                  :area="expressInfo.Sender.district"
                ></v-distpicker>
              </div>

              <div class="detail">
                <span>详细地址：</span>
                <input :disabled="!isEdit" v-model="expressInfo.Sender.address" />
              </div>
            </div>
            <div
              @click="submit"
              @touchstart="touchbegin"
              @touchend="touchend"
              :class="isTouched ? 'active': 'submit'"
              v-if="isEdit ? true : false"
            >提交</div>
          </div>
        </div>
      </div>
      <div class="envelope">
        <img
          src="../assets/images/envelope_upper.png"
          alt
          class="upper"
          :class="isSubmit ? 'envelopeMove' : ''"
        />
        <div class="main">
          <img
            class="back"
            :class="isSubmit ? 'envelopeMove' : ''"
          />
          <img
            class="front"
            src="../assets/images/envelope_front.png"
            :class="isSubmit ? 'envelopeMoveFront' : ''"
          />
          <div
            class="openBtn"
            @click="expand"
            :class="isSubmit ? 'envelopeOpen' : ''"
          >{{ envelopeDesc }}</div>
        </div>
      </div>
      <div class="copyright">
        <span>武汉市玫隆皇冠食品有限公司 倾情出品</span>
      </div>
    </div>

    <div
      class="letter-back"
      :class="[isRotated ? 'letter-back-rotation': '', isRotateBack ? 'letter-back-unrotation' : '']"
    >
      <div class="detail-header">
        <img @click="handleBackToLetter" src="../assets/images/arrow_left.png" alt />
        <span>物流详情</span>
      </div>
      <div class="detail-product">
        <img src="../assets/images/product.png" alt />
        <span class="count">×1</span>
      </div>
      <div class="detail-status">
        <span>订单状态</span>
      </div>
      <timeline v-if="express.length">
        <timeline-item
          class="timeline-item"
          v-for="(item, index) in express"
          :key="index"
          :hollow="Boolean(index)"
        >
          <span class="accept-time">{{ item.acceptdatetime }}</span>
          <span class="accept-station">{{ item.acceptstation }}</span>
        </timeline-item>
      </timeline>
      <div class="no-logistics" v-else>
        <img src="../assets/images/no_logistics.png" alt />
        <span>暂无物流信息~</span>
      </div>
    </div>
  </div>
</template>

<script>
import VDistpicker from "v-distpicker";
import { Timeline, TimelineItem, TimelineTitle } from "vue-cute-timeline";
import { request } from "@/network/request";

export default {
  components: {
    VDistpicker,
    Timeline,
    TimelineItem,
    TimelineTitle
  },

  props: ["postid"],

  data() {
    return {
      isTouched: false,
      isSubmit: false,
      isEdit: true,
      isExpand: true,
      envelopeDesc: "",
      isReadOnly: false,
      // true 整体旋转 看到物流详情
      isRotated: false,
      //  true 整体旋转回来到 信封页面
      isRotateBack: false,
      expressInfo: {
        Sender: {
          name: "",
          phone: "",
          province: "",
          city: "",
          district: "",
          address: ""
        },
        Receiver: {
          name: "",
          phone: "",
          province: "",
          city: "",
          district: "",
          address: ""
        }
      },
      express: []
    };
  },

  mounted() {
    //  兼容安卓界面被输入工具栏顶起问题
    var height = document.documentElement.clientHeight; //获取当前可视区域的高度存到hrt变量
    window.onload = function() {
      //在页面整体加载完毕时
      document.querySelector(".letter").style.height = height + "px"; //把获取到的高度赋值给根div
    };

    this.$watch("postid", (newVal, oldVal) => {
      this.$loading.show("加载中...");
      this.queryPostinfo(newVal);
    });
  },

  destroyed() {
    //  清除本地缓存
    localStorage.clear();
  },

  methods: {
    queryPostinfo(postid) {
      request({
        url: "/postinfoquery",
        method: "POST",
        data: {
          postid
        }
      })
        .then(res => {
          //  隐藏加载框
          this.$loading.hide();

          //  解构请求结果
          let { result } = res.data.data;

          //  ExpressState状态为0时 postid尚未使用 直接返回 可填写
          if (result.Sender.name == "") return;

          //  将结果给expressInfo赋值
          this.expressInfo = result;

          this.express = result.express;

          //  将结果存储到本地
          localStorage.setItem("lExpressInfo", JSON.stringify(result));

          //  禁用form表单
          this.isEdit = false;

          //  折叠-展开按钮显示 "折叠" 文字
          this.envelopeDesc = "折叠";
        })
        .catch(err => {
          this.$toast("手机网络不给力，请点击右上角“刷新”页面！", {
            duration: 2000
          });
        });
    },

    submit(e) {
      this.$confirm({
        title: "提示",
        content: "请仔细核对邮寄信息是否准确无误?"
      })
        .then(res => {
          /**
           * 判断邮寄信息是否填写完整
           * 完整 提交 网络请求
           * 不完整 弹框提示
           */
          let { Receiver: receiver, Sender: sender } = this.expressInfo;

          //  请求到的town字段暂时无用 为了判断是否有值 用 - 代替
          receiver.town = "-";
          sender.town = "-";

          let phoneReg = /^[1][3, 4, 5, 7, 8][0-9]{9}$/
          let recPhone = receiver.phone
          let sendPhone = sender.phone
          if (
            this.objHasAllValues(Object.values(receiver)) &&
            this.objHasAllValues(Object.values(sender))
          ) {
            if (recPhone.length !== 11 || sendPhone.length !== 11) {
              this.$toast('手机号码应为11位！')
              return
            }

            if (!phoneReg.test(recPhone) || !phoneReg.test(sendPhone)) {
              this.$toast('手机号码格式不正确！')
              return
            }
            this.$loading.show("提交中...");
            request({
              url: "/postinfoupdate",
              method: "POST",
              data: {
                postid: this.postid,
                receiver,
                sender
              }
            })
              .then(res => {
                if (!res) {
                  //  请求失败
                  console.log("失败");
                  this.$loading.hide();
                  this.$toast("手机网络不给力，请点击右上角“刷新”页面！", {
                    duration: 2000
                  });
                } else {
                  //  请求成功
                  let { result } = res.data.data;
                  //请求失败 code "15210", "邮件已提交快递，不允许再更新"
                  if (result.code === 15210) {
                    //  弹出"邮件已提交快递，不允许再更新"toast
                    this.$toast(result.msg, {
                      duration: 2500
                    });
                    //  由于不可更改 从本地取回快递信息 赋值给expressInfo模型
                    let lExpressInfo = JSON.parse(
                      localStorage.getItem("lExpressInfo")
                    );
                    this.expressInfo = lExpressInfo;

                    //  修改为form禁用
                    this.isEdit = false;

                    //  隐藏loading框
                    this.$loading.hide();

                    return;
                  } else {
                    this.$loading.hide();
                    this.$toast("提交成功，谢谢惠顾！");
                    this.isSubmit = true;
                    this.isEdit = false;
                    this.envelopeDesc = "展开";
                  }
                }
              })
              .catch(err => {
                console.log("失败");
                this.$loading.hide();
                this.$toast("手机网络不给力，请点击右上角“刷新”页面！", {
                  duration: 2000
                });
              });
          } else {
            this.$toast("请填写完整邮寄信息！");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    /**
     * 判断对象所有属性是否有值
     * 判断用户是否完整填写所有快递信息
     */
    objHasAllValues(obj) {
      obj = obj || {};
      for (const v of obj) {
        if (v.trim().length == "") {
          return false;
        }
      }
      return true;
    },

    //  提交按钮 hover 状态 class 改变
    touchbegin() {
      this.isTouched = true;
    },
    touchend() {
      this.isTouched = false;
    },
    expand() {
      this.isSubmit = !this.isSubmit;
      if (this.isSubmit) {
        this.isExpand = false;
        this.envelopeDesc = "展开";
      } else {
        this.isExpand = true;
        this.envelopeDesc = "折叠";
      }
    },
    onRecieverSelected(data) {
      let { province, city, area } = data;
      this.expressInfo.Receiver.province = province.value;
      this.expressInfo.Receiver.city = city.value;
      this.expressInfo.Receiver.district = area.value;
    },
    onSenderSelected(data) {
      let { province, city, area } = data;
      this.expressInfo.Sender.province = province.value;
      this.expressInfo.Sender.city = city.value;
      this.expressInfo.Sender.district = area.value;
    },

    //  修改邮寄信息
    modifyInfo() {
      this.isEdit = true;
      //  设置寄件人电话为只读
      this.isReadOnly = true;
    },

    handleSenderPhone() {
      if (this.isReadOnly)
        this.$toast("寄件人电话不可更改，请核对寄件人信息是否为本人！", {
          duration: 4000
        });
    },

    //  点击查看物流信息
    handleLogistics() {
      this.isRotated = true;
      this.isRotateBack = false;
    },

    //  点击回到信封页
    handleBackToLetter() {
      this.isRotateBack = true;
      this.isRotated = false;
    }
  }
};
</script>

<style scoped>
.letter-wrapper {
  width: 100vw;
  height: 100vh;
  position: relative;
  perspective: 1200px;
  background: #576574;
}

.letter {
  background: #004e92;
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
}

.logo {
  width: 100%;
  height: 130px;
  position: relative;
  display: flex;
  align-items: center;
}

.logo .coorperation {
  position: absolute;
  left: 45px;
}

.logo .coorperation img {
  margin-right: 20px;
}

.logo .coorperation img:nth-child(1) {
  width: 80px;
  height: 80px;
}

.logo .coorperation img:nth-child(2) {
  width: 84px;
  height: 80px;
}

 .logistics {
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px;
  border-radius: 5px;
  font-size: 24px;
  position: absolute;
  right: 45px;
  box-shadow: 2px 2px 4px rgba(33, 33, 33, .5);
}

.logistics img {
  width: 26px;
  height: 26px;
  margin-right: 10px;
}

.paper-wrapper {
  width: 100%;
  height: calc(100vh - 589px);
}

.paper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 240px;
  left: calc((100vw - 660px) * 0.5);
  z-index: 30;
}

.paper-1 {
  width: 660px;
  height: 483px;
  position: relative;
  perspective: 1300px;
  z-index: 30;
}

.cover,
.backside {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-origin: center bottom;
}

.cover {
  transform: rotateX(0deg);
  backface-visibility: hidden;
}

.backside {
  background-color: #e3d9d0;
  transform: rotateY(0deg);
}

.paper-1 img {
  width: 100%;
  height: 100%;
}

.paper-1 .sender {
  width: 530px;
  height: 150px;
  border: 1px dashed #004e92;
  position: absolute;
  left: 65px;
  top: 333px;
  border-bottom: none;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 20px;
  padding-left: 10px;
  z-index: 31;
}

.title {
  display: flex;
  justify-content: flex-start;
}

.title div {
  background: #004e92;
  width: 30px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-right: 10px;
}

.title .modifyinfo {
  background: #aaa;
  width: 90px;
  height: 36px;
  line-height: 36px;
  border-radius: 5px;
  position: absolute;
  right: 0px;
  top: 10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.modifyinfo img {
  width: 24px;
  height: 24px;
}

.modifyinfo i {
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
}

.info {
  display: flex;
  color: #004e92;
  align-items: center;
}

.info div {
  margin-right: 30px;
}

.info input {
  outline-style: none;
  background: transparent;
  border: none;
  border-bottom: 1px solid #004e92;
  border-radius: 0;
}

input:disabled {
  color: #666;
}

.name input {
  width: 130px;
}

.phone input {
  width: 180px;
}

.address {
  display: flex;
  align-items: center;
  color: #004e92;
}

.address >>> .distpicker-address-wrapper {
  color: #004e92;
  display: inline-block;
}

.address >>> .distpicker-address-wrapper select {
  appearance: none;
  outline-style: none;
  background: transparent;
  height: 40px;
  border: 1px #004e92 solid;
  width: 120px;
  font-size: 20px;
  margin-right: 5px;
  -webkit-text-fill-color: #000;
  color: #000;
  opacity: 1;
  padding: 0 2%;
  margin: 0;
}

.address >>> .distpicker-address-wrapper select:disabled {
  -webkit-text-fill-color: #666;
  color: #666;
  opacity: 1;
}

input:disabled {
  -webkit-text-fill-color: #666;
  color: #666;
  opacity: 1;
}

.sender > .address {
  margin-bottom: -10px;
}

.detail {
  color: #004e92;
}

.detail input {
  outline-style: none;
  background: transparent;
  border: none;
  border-bottom: 1px solid #004e92;
  width: 380px;
  border-radius: 0;
}

.paper-2 {
  width: 660px;
  height: 483px;
  position: relative;
}

.paper-2 img {
  width: 100%;
  height: 100%;
}

.paper-2 .poster {
  width: 530px;
  height: 243px;
  border: 1px dashed #004e92;
  position: absolute;
  left: 65px;
  bottom: 233px;
  border-top: none;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  font-size: 20px;
  padding-left: 10px;
}

.paper-2 .submit {
  width: 200px;
  height: 60px;
  background: #004e92;
  border-radius: 8px;
  position: absolute;
  bottom: 160px;
  left: 230px;
  color: #fff;
  line-height: 60px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 10px;
}

.active {
  width: 200px;
  height: 60px;
  background: #003a6d;
  border-radius: 5px;
  position: absolute;
  bottom: 160px;
  left: 230px;
  color: #fff;
  line-height: 60px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 10px;
}

.envelope {
  /* background: pink; */
  width: 100%;
  height: 589px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 60px;
}

.envelope .upper {
  width: 700px;
  height: 251px;
  z-index: 20;
}

.envelope .main {
  width: 700px;
  height: 338px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.main .back {
  width: 100%;
  height: 100%;
  z-index: 10;
  background: #fbf9f4;
}

.main .front {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 40;
}

.paperMove {
  animation: paperMove 1s linear forwards, paperMoveDown 1s 3s linear forwards;
}

@keyframes paperMove {
  100% {
    transform: translateY(-130px) scale(0.6);
  }
}

@keyframes paperMoveDown {
  0% {
    /* transform: translateY(-130px) scale(0.6) translateZ(80px); */
    transform: translateY(-130px) scale(0.6);
  }
  100% {
    transform: translateY(40px) scale(0.6);
  }
}

.coverFold {
  animation: coverFold 1s 1s linear forwards;
}

@keyframes coverFold {
  100% {
    transform: rotateX(-180deg);
  }
}

.backFold {
  animation: backFold 1s 1s linear forwards;
}

@keyframes backFold {
  100% {
    transform: rotateX(-180deg);
  }
}

.envelopeMove {
  animation: envelopeMove 1s 2s linear forwards;
}

@keyframes envelopeMove {
  100% {
    transform: translateY(-120px);
  }
}

.envelopeMoveFront {
  animation: envelopeMoveFront 1s 2s linear forwards;
}

@keyframes envelopeMoveFront {
  100% {
    /* transform: translateY(-120px) translateZ(100px); */
    transform: translateY(-120px);
  }
}

.envelope .openBtn {
  position: absolute;
  width: 100px;
  height: 100px;
  /* background: pink; */
  color: #fff;
  bottom: 202px;
  z-index: 999;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  line-height: 100px;
  text-shadow: 0 0 10px #000;
}

.open {
  animation: open 0.5s 4s linear forwards;
}

@keyframes open {
  100% {
    /* transform: translateZ(200px); */
  }
}

.envelopeOpen {
  animation: envelopeMove 1s 2s linear forwards,
    envelopeOpen 0.5s 4s linear forwards;
}

@keyframes envelopeOpen {
  0% {
    transform: translateY(-120px);
  }
  100% {
    /* transform: translateZ(220px) translateY(-120px); */
    transform: translateY(-120px);
  }
}

.copyright {
  width: 100%;
  height: 60px;
  font-size: 20px;
  color: #fff;
  display: flex;
  align-items: center;
  line-height: 20px;
  position: absolute;
  bottom: 0;
  padding: 5px;
  display: flex;
  justify-content: space-evenly;
  letter-spacing: 3px;
}

.letter-back {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotateY(-180deg);
  background: #fff;
  backface-visibility: hidden;
}

.letter-back .detail-header {
  width: 100%;
  box-shadow: 0 2px 4px rgba(189, 195, 199, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  font-weight: bolder;
}

.detail-header img {
  width: 44px;
  height: 44px;
  position: absolute;
  left: 20px;
}

.detail-product {
  display: flex;
  align-items: center;
  padding: 30px;
}

.detail-product img {
  width: 150px;
  height: 150px;
  box-shadow: 0 0 4px rgba(189, 195, 199, 0.5);
}

.detail-product .count {
  letter-spacing: 6px;
  margin-left: 30px;
  color: #333;
  -webkit-font-smoothing: antialiased;
}

.detail-status {
  padding: 20px;
  font-size: 28px;
  color: #333;
}

/* 从信封页旋转到物流页 */
.letter-rotation {
  animation: letter-rotation 1s ease-in-out forwards;
}

@keyframes letter-rotation {
  100% {
    transform: rotateY(180deg);
  }
}

.letter-back-rotation {
  animation: letter-back-rotation 1s ease-in-out forwards;
}

@keyframes letter-back-rotation {
  100% {
    transform: rotateY(0deg);
  }
}

/* 从物流页旋转到信封页 */
.letter-unrotation {
  animation: letter-unrotation 1s ease-in-out forwards;
}

@keyframes letter-unrotation {
  0% {
    transform: rotateY(180deg);
  }

  100% {
    transform: rotateY(0);
  }
}

.letter-back-unrotation {
  animation: letter-back-unrotation 1s ease-in-out forwards;
}

@keyframes letter-back-unrotation {
  0% {
    transform: rotateY(0);
  }

  100% {
    transform: rotateY(-180deg);
  }
}

.timeline-item {
  font-size: 24px;
}

.timeline-item .accept-time {
  display: block;
}

.timeline-item .accept-station {
  display: block;
  padding: 10px 0;
  line-height: 40px;
}

.no-logistics {
  display: flex;
  flex-direction: column;
  color: #c5c5c5;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 70%);
}

.no-logistics img {
  width: 150px;
  height: 150px;
}

.no-logistics span {
  display: block;
  font-size: 24px;
  padding: 40px;
}
</style>