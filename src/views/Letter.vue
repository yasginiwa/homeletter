<template>
  <div class="letter">
    <div class="logo">
      <img src="../assets/images/crown_logo.png" alt />
      <img src="../assets/images/post_logo.png" alt="">
    </div>
    <div class="paper-wrapper">
      <div class="paper" :class="isSubmit === true ? 'paperMove' : ''">
        <div class="paper-1" :class="isSubmit === true ? 'paper1Fold' : ''">
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
                <input :disabled=!isEdit v-model="expressInfo.reciever.name" />
              </div>

              <div class="phone">
                <span>电话：</span>
                <input :disabled=!isEdit v-model.number="expressInfo.reciever.phone" />
              </div>
            </div>

            <div class="address">
              <span>所在地区：</span>
              <v-distpicker :disabled=!isEdit @selected="onRecieverSelected" :province="expressInfo.reciever.province" :city="expressInfo.reciever.city" :area="expressInfo.reciever.area"></v-distpicker>
            </div>

          </div>
        </div>
        <div class="paper-2">
          <img src="../assets/images/paper_2.png" alt class="paper-2" />
          <div class="poster">
            <div class="detail">
              <span>详细地址：</span>
              <input :disabled=!isEdit v-model="expressInfo.reciever.detail" />
            </div>

            <div class="title">
              <div>寄</div>
              <div>件</div>
              <div>人</div>
            </div>
            <div class="info">
              <div class="name">
                <span>姓名：</span>
                <input :disabled=!isEdit v-model="expressInfo.sender.name" />
              </div>

              <div class="phone">
                <span>电话：</span>
                <input :disabled=!isEdit v-model.number="expressInfo.sender.phone" />
              </div>
            </div>

            <div class="address">
              <span>所在地区：</span>
              <v-distpicker @selected="onSenderSelected" :disabled=!isEdit :province="expressInfo.sender.province" :city="expressInfo.sender.city" :area="expressInfo.sender.area"></v-distpicker>
            </div>

            <div class="detail">
              <span>详细地址：</span>
              <input :disabled=!isEdit v-model="expressInfo.sender.detail" />
            </div>
          </div>
          <div
            @click="submit"
            @touchstart="touchbegin"
            @touchend="touchend"
            :class="isTouched === true? 'active': 'submit'"
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
        <div class="openBtn" @click="expand" :class="isSubmit === true ? 'envelopeOpen' : ''">展开</div>
      </div>
    </div>
    <div class="copyright">
      <span>武汉市玫隆皇冠食品有限公司 倾情出品</span>
    </div>
  </div>
</template>

<script>
import VDistpicker from "v-distpicker";

export default {
  components: {
    VDistpicker
  },
  data() {
    return {
      isTouched: false,
      isSubmit: false,
      isEdit: true,
      expressInfo: {
        reciever: {
          name: "",
          phone: "",
          province: "",
          city: "",
          area: "",
          detail: ""
        },
        sender: {
          name: "",
          phone: "",
          province: "",
          city: "",
          area: "",
          detail: ""
        }
      }
    };
  },
  methods: {
    submit(e) {
      console.log(e);
      this.isSubmit = true;
    },
    touchbegin() {
      this.isTouched = true;
    },
    touchend() {
      this.isTouched = false;
    },
    expand() {
      this.isSubmit = false;
    },
    onRecieverSelected(data) {
      console.log(data)
      let { province, city, area } = data
      this.expressInfo.reciever.province = province.value
      this.expressInfo.reciever.city = city.value
      this.expressInfo.reciever.area = area.value
    },
    onSenderSelected(data) {
      let { province, city, area } = data
      this.expressInfo.sender.province = province.value
      this.expressInfo.sender.city = city.value
      this.expressInfo.sender.area = area.value
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
  height: 100px;
  position: relative;
}

.logo img {
  margin: 30px;
  position: absolute;
}

.logo img:nth-child(1) {
  width: 100px;
  height: 100px;
  right: 135px;
}

.logo img:nth-child(2) {
  width: 105px;
  height: 100px;
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
  transform-style: preserve-3d;
  perspective: 1500px;
  position: absolute;
  bottom: 220px;
  left: calc((100vw - 660px) * 0.5);
  z-index: 30;
}

.paper-1 {
  width: 660px;
  height: 483px;
  transform-origin: center bottom;
  position: relative;
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
  width: 150px;
  border-radius: 0;
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

.sender>.address {
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

.paper1Fold {
  animation: paper1Fold 1s 1s linear forwards;
}

@keyframes paper1Fold {
  100% {
    transform: rotateX(-179deg);
    transform-origin: 0 100%;
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
  opacity: 0;
}

.open {
  animation: open 0.5s 4s linear forwards;
}

@keyframes open {
  100% {
    opacity: 1;
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
    opacity: 0;
  }
  100% {
    transform: translateZ(220px) translateY(-120px);
    opacity: 1;
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