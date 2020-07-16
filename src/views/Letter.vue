<template>
  <div class="letter">
    <div class="logo">
      <img src="../assets/images/crown_logo.png" alt />
      <img src="../assets/images/post_logo.png" alt />
    </div>
    <div class="paper-wrapper">
      <div class="paper" :class="isSubmit ? 'paperMove' : ''">
        <div class="paper-1">
          <div class="backside" :class="isSubmit ? 'backFold': ''"></div>
          <div class="cover" :class="isSubmit ? 'coverFold' : ''">
            <img src="../assets/images/paper_1.png" alt class="paper-1" />
            <div class="sender">
              <div class="title">
                <div>收</div>
                <div>件</div>
                <div>人</div>
              </div>
              <div class="info">
                <div class="name">
                  <span>姓名：</span>
                  <input :disabled="!isEdit" v-model="expressInfo.Receiver.name" />
                </div>

                <div class="phone">
                  <span>电话：</span>
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
          <img src="../assets/images/paper_2.png" alt class="paper-2" />
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
                <span>电话：</span>
                <input :disabled="!isEdit" v-model="expressInfo.Sender.phone" />
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
            :class="isTouched === true? 'active': 'submit'"
            v-if="isEdit === true ? true : false"
          >提交</div>
        </div>
      </div>
    </div>
    <div class="envelope">
      <img
        src="../assets/images/envelope_upper.png"
        alt
        class="upper"
        :class="isSubmit === true ? 'envelopeMove' : ''"
      />
      <div class="main">
        <img
          class="back"
          src="../assets/images/envelope_back.png"
          :class="isSubmit === true ? 'envelopeMove' : ''"
        />
        <img
          class="front"
          src="../assets/images/envelope_front.png"
          :class="isSubmit === true ? 'envelopeMoveFront' : ''"
        />
        <div
          class="openBtn"
          @click="expand"
          :class="isSubmit === true ? 'envelopeOpen' : ''"
        >{{ envelopeDesc }}</div>
      </div>
    </div>
    <div class="copyright">
      <span>武汉市玫隆皇冠食品有限公司 倾情出品</span>
    </div>
  </div>
</template>

<script>
import VDistpicker from "v-distpicker";
import { request } from "@/network/request";

export default {
  components: {
    VDistpicker
  },

  props: ["postid"],

  data() {
    return {
      isTouched: false,
      isSubmit: false,
      isEdit: true,
      isExpand: true,
      envelopeDesc: "",
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
      }
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

  methods: {
    queryPostinfo(postid) {
      request({
        url: "/postinfoquery",
        method: "POST",
        data: {
          postid
        }
      }).then(res => {
        //  隐藏加载框
        this.$loading.hide();

        //  解构请求结果
        let { result } = res.data.data;

        //  ExpressState状态为0时 postid尚未使用 直接返回 可填写
        if (result.Sender.name == "") return;

        //  将结果给expressInfo赋值
        this.expressInfo = result;

        //  禁用form表单
        this.isEdit = false;

        this.envelopeDesc = "折叠";
      });
    },

    submit(e) {
      this.$confirm({
        title: "提示",
        content: "是否已核对所有邮寄信息？"
      })
        .then(res => {
          /**
           * 判断邮寄信息是否填写完整
           * 完整 提交 网络请求
           * 不完整 弹框提示
           */
          let { Receiver: receiver, Sender: sender } = this.expressInfo;
          let data = {
            postid: this.postid,
            receiver,
            sender
          };

          if (
            this.objHasAllValues(Object.values(receiver)) &&
            this.objHasAllValues(Object.values(sender)) &&
            receiver.phone.length == 11 &&
            sender.phone.length == 11
          ) {
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
                // 请求成功
                if (!res) {
                  console.log("失败");
                  this.$loading.hide();
                  this.$toast("手机网络不给力...");
                } else {
                  this.$loading.hide();
                  this.$toast("提交成功，谢谢惠顾！");
                  this.isSubmit = true;
                  this.isEdit = false;
                  this.envelopeDesc = "展开";
                }
              })
              .catch(err => {
                console.log("失败");
                this.$loading.hide();
                this.$toast("手机网络不给力...");
              });
          } else {
            this.$toast("请填写完整邮寄信息！");
          }
        })
        .catch(err => {
          //请求失败
          // console.log(err);
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
    }
  }
};
</script>

<style scoped>
.letter {
  background: #004e92;
  width: 100%;
  height: 100%;
  position: relative;
}

.logo {
  width: 100%;
  height: 130px;
  position: relative;
}

.logo img {
  margin: 30px 44px;
  position: absolute;
}

.logo img:nth-child(1) {
  width: 80px;
  height: 80px;
  right: 105px;
}

.logo img:nth-child(2) {
  width: 84px;
  height: 80px;
  right: 0;
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
  padding: 0 1px;
  outline-style: none;
  background: transparent;
  height: 36px;
  line-height: 40px;
  border: 1px #004e92 solid;
  width: 120px;
  font-size: 20px;
  margin-right: 5px;
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
    transform: translateY(-130px) scale(0.6) translateZ(80px);
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
    transform: translateY(-120px) translateZ(100px);
  }
}

.envelope .openBtn {
  position: absolute;
  width: 50px;
  height: 50px;
  /* background: pink; */
  color: #fff;
  bottom: 228px;
  z-index: 999;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  line-height: 50px;
  text-shadow: 0 0 10px #000;
}

.open {
  animation: open 0.5s 4s linear forwards;
}

@keyframes open {
  100% {
    transform: translateZ(200px);
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
    transform: translateZ(220px) translateY(-120px);
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
  justify-content: center;
  letter-spacing: 3px;
}
</style>