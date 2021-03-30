<template>
  <div class="header bg-white">
    <div class="w1200">
      <div class="logo fl">
        <img class="clicks" @click="toUrl('home')" :src="logoSvg">
      </div>
      <div class="nav fr">
        <div class="fl" v-show="false"> {{height}}</div>

        <div class="fl">
          <div v-if="accountInfo.accounts" class="click font14" @click="showAccount"> {{ superLong(accountInfo.accounts)
            }}
          </div>
          <div v-else class="on-link click font14" @click="onLink">{{$t('set.set10')}}</div>
        </div>

        <div class="language fr font14 click" @click="selectLanguage">{{lang === 'en' ? '简体中文':'English' }}</div>
      </div>
    </div>
    <div class="cb"></div>

    <el-dialog :title="$t('set.set11')" :visible.sync="connectDialog" class="connect-dialog" width="420px">
      <div class="list">
        <div class="lis" @click="connectTo('nabox')">
          <span>Nabox</span>
          <img src="./../assets/img/logo.svg"/>
        </div>
        <div class="lis" @click="connectTo('walletConnect')">
          <span>WalletConnect</span>
          <img src="./../assets/img/logo.svg"/>
        </div>
        <div class="lis" @click="connectTo('metaMask')">
          <span>MetaMask</span>
          <img src="./../assets/img/logo.svg"/>
        </div>
      </div>
    </el-dialog>

    <el-dialog :title="$t('projects.projects111')" :visible.sync="walletDialog" class="wallet-dialog" width="525px">
      <div class="account-info">
        <h6>{{$t('set.set12')}}Nabox</h6>
        <h1>{{accountInfo.accounts}}</h1>
        <span class="clicks" @click="copy(accountInfo.accounts)">{{$t('set.set13')}}</span>
        <span class="clicks" @click="toUrl(accountInfo.accounts,'url')">{{$t('set.set14')}}</span>
      </div>
      <div class="break">
        <el-button type="warning" round @click="offLink(accountInfo.accounts)">{{$t('set.set15')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import logo from '@/assets/img/logo.svg'
  import {
    superLong
  } from "@/api/util";

  export default {
    data() {
      return {
        logoSvg: logo,
        lang: 'cn',
        accountInfo: {},//账户信息
        connectDialog: false,//连接钱包弹框
        walletDialog: false,//账户信息弹框
      };
    },
    created() {
      console.log(window.nabox, "created");
      if (typeof window.nabox !== "undefined") {

        if (window.nabox.connected) {
          this.$store.commit("setAccount", window.nabox);
          this.accountInfo = window.nabox;
        } else {
          this.$store.commit("setAccount", {});
          this.accountInfo = {};
        }
        //3、启动监听事件
        this.naboxAccount();

        /*
        nabox.on("changeAllowSites", (error, payload) => {
          console.log(error, payload, "changeAllowSites");
        });

        nabox.on("accountsChanged", (error, payload) => {
          console.log(error, payload, "accountsChanged");
        });

        nabox.on("networkChanged", (error, payload) => {
          console.log(error, payload, "networkChanged");
        });

        nabox.on("connect", (error, payload) => {
          console.log(error, payload, "connect");
        });

        nabox.on("session_update", (error, payload) => {
          console.log(error, payload, "session_update");
        });

        nabox.on("disconnect", (error, payload) => {
          console.log(error, payload, "disconnect");
        });
        */

      }
    },
    async mounted() {


    },
    watch: {},
    components: {},
    methods: {

      /**
       * 语言切换
       */
      selectLanguage() {
        if (this.lang === 'en') {
          this.lang = 'cn'
        } else {
          this.lang = 'en'
        }
        sessionStorage.setItem('lang', this.lang);
        this.$i18n.locale = this.lang;
      },

      superLong(str, len = 8) {
        return superLong(str, len);
      },

      //连接钱包
      onLink() {
        this.connectDialog = true;
      },

      /**
       * @disc: 连接到插件
       * @params: wallet name
       * @date: 2021-03-10 13:52
       * @author: Wave
       */
      connectTo(walletName) {
        //console.log(walletName);
        if (walletName === 'nabox') {
          if (typeof window.nabox !== "undefined") {
            this.getConnect();
          } else {
            this.$message({message: this.$t('set.set16'), type: 'error', duration: 3000});
          }
        } else {
          this.$message({
            message: this.$t('set.set17') + walletName + this.$t('set.set18'),
            type: 'error',
            duration: 3000
          });
        }
      },

      //显示账户信息
      showAccount() {
        this.walletDialog = true;
      },

      //断开连接钱包
      async offLink(address) {
        //console.log(address);
        this.accountInfo = {};
        localStorage.removeItem('accountInfo');
        this.walletDialog = false;
        await nabox.offLink({address: address, chain: "NULS"});
      },

      //连接nabox 并获取地址信息
      async getConnect() {
        let naboxInfo = await nabox.createSession({chain: "NULS"});
        console.log(naboxInfo);
        if (naboxInfo) {
          let newAddressInfo = {address: naboxInfo};
          console.log(newAddressInfo);
          this.$store.commit("setAccount", newAddressInfo);
          console.log(this.$store.state.addressInfo);
          this.naboxAccount();
          this.connectDialog = false;
          //this.toUrl('home');
        } else {
          this.$message({message: this.$t('set.set19'), type: 'error', duration: 3000});
        }
      },

      //监听插件账户变化
      naboxAccount() {
        //console.log("监听插件账户变化");
        nabox.on("session_update", (error, payload) => {
          console.log(error, payload);
          if (error) {
            throw error;
          }
          if (payload.params[0].isAccredit) {
            this.$store.commit("setAccount", window.nabox);
            this.accountInfo = window.nabox;
          } else {
            this.$store.commit("setAccount", {});
            this.accountInfo = {};
          }
        });
      },

      /**
       * url 连接
       * @param name
       * @param url
       */
      toUrl(name, url) {
        console.log(name, url);
        this.$router.push({
          name: name,
        })
      }
    }
  }
</script>

<style lang="less">
  @import "./../assets/css/style";

  .header {
    border-bottom: 1px solid #EBEEF5;
    height: 100px;
    line-height: 100px;
    .w1200 {
      .logo {
        width: 5rem;
        img {
          width: 5rem;
        }
      }
      .nav {
        margin: 40px 0 0 0;
        .on-link {

        }
        .language {
          margin: 0 0 0 20px;
        }
      }
    }
    .connect-dialog {
      .el-dialog__header {
        flex-flow: row nowrap;
        padding: 1rem;
        font-weight: 500;
        color: inherit;
        line-height: 0;
      }
      .el-dialog__body {
        padding: 0;
        .list {
          background-color: rgb(247, 248, 250);
          padding: 2rem;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
          .lis {
            background-color: rgb(247, 248, 250);
            outline: none;
            border: 1px solid rgb(237, 238, 242);
            border-radius: 12px;
            display: flex;
            flex-direction: row;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: justify;
            justify-content: space-between;
            padding: 1rem;
            opacity: 1;
            height: 80px;
            margin-bottom: 1rem;
            cursor: pointer;
            &:hover {
              border-color: #53b8a9;
            }
            span {
              flex-flow: row nowrap;
              color: rgb(0, 0, 0);
              font-size: 1rem;
              font-weight: 500;
            }
            img {
              width: 50px;
              float: right;
            }
          }
        }
      }
    }

    .wallet-dialog {
      .el-dialog__header {
        flex-flow: row nowrap;
        padding: 1rem;
        font-weight: 500;
        color: inherit;
        line-height: 0;
      }
      .el-dialog__body {
        padding: 1rem 2rem 2rem;
        .account-info {
          line-height: 20px;
          padding: 0 0 2rem 0;
          font-size: 14px;
          h6 {
            height: 40px;
          }
          h1 {
            font-size: 16px;
            height: 40px;
          }
          span {
            display: block;
            float: left;
            height: 40px;
            padding: 0 3rem 0 0;
            color: #608FFF;
          }
        }
        .break {
          line-height: 30px;
          margin-left: -2rem;
          .el-button {
            span {
              color: #fff;
            }
          }
        }
      }
    }
  }

</style>
