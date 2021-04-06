<template>
  <div class="home">
    <div class="font18 fW600">方法</div>
    <el-collapse accordion v-model="activeName" @change="changeCollapse">
      <el-collapse-item title="检查是否安装了Nabox" name="checkNabox">
        <div class="info">
          <div class="fl">
            <pre>
               if (typeof window.nabox !== "undefined") {
                  console.log("nabox is installed!");
                }
            </pre>
          </div>
          <div class="fr">
            <el-button type="primary" size="small" @click="checkNabox">检查是否安装了Nabox</el-button>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="连接Nabox" name="connectionNabox">
        <div class="info">
          <div class="fl">
            <h2>nabox.createSession({chain})</h2>
            <p>参数说明：</p>
            <p>chain：必填，需要连接的链网络 （BSC、Ethereum、Heco、NERVE、NULS）</p>
            <pre>
              let naboxInfo = await nabox.createSession({chain: "NULS"});
              console.log(naboxInfo);
            </pre>
          </div>
          <div class="fr">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
              <el-form-item label="连接Nabox" prop="region">
                <el-select v-model="ruleForm.region" placeholder="授权链">
                  <el-option label="BSC" value="BSC"></el-option>
                  <el-option label="Ethereum" value="Ethereum"></el-option>
                  <el-option label="Heco" value="Heco"></el-option>
                  <el-option label="NERVE" value="NERVE"></el-option>
                  <el-option label="NULS" value="NULS"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">连接Nabox</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="获取公钥" name="getPub">
        <div class="info">
          <div class="fl">
            <h2>nabox.getPub({address})</h2>
            <p>参数说明：</p>
            <p>address：必填，已授权的地址</p>
            <pre>
              let data = {
                address: "tNULSeBaMvH8TmMZUPQKvc19qeLrD7oN643aBL"
              }
              let naboxInfo = await nabox.getPub(data);
              console.log(naboxInfo);
            </pre>
          </div>
          <div class="fr">
            地址:
            <el-input placeholder="" v-model="$store.getters.getAddressInfo.accounts" :disabled="true"></el-input>
            <el-button type="primary" @click="getPub">获取公钥</el-button>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="获取账户余额" name="getBalance">
        <div class="info">
          <div class="fl">
            <h2>nabox.getBalance({})</h2>
            <p>参数说明：</p>
            <p>address：必填，地址</p>
            <p>chain：必填，链</p>
            <p>chainId：必填，链id</p>
            <p>assetId：必填，资产id</p>
            <pre>
              let data = {
                address:"tNULSeBaMvH8TmMZUPQKvc19qeLrD7oN643aBL",
                chain:"NULS",
                chainId:"2",
                assetId:"1",
              }
              let naboxInfo = await nabox.getBalance(data);
              console.log(naboxInfo);
            </pre>
          </div>
          <div class="fr">
            <el-form :model="balanceForm" :rules="balanceRules" ref="balanceForm">
              <el-form-item label="from">
                <el-input v-model="balanceForm.address">
                </el-input>
              </el-form-item>
              <el-form-item label="资产" prop="assets">
                <el-select v-model="balanceForm.assets" placeholder="请选择资产">
                  <el-option v-for="item of assetsList" :label="item.symbol" :key="item.ids" :value="item.ids">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitBalance('balanceForm')">获取余额</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="发送普通交易" name="tradingNabox">
        <div class="info">
          <div class="fl">
            <h2>nabox .sendTransaction(tx)</h2>
            <p>参数说明：</p>
            <p>from 可选(插件当前连接的帐户)</p>
            <p>to：必填，接受地址</p>
            <p>data：必填</p>
            <p>value：必填，转账金额</p>
            <p>assetChainId：必填 链id</p>
            <p>assetId：必填 资产id</p>
            <p>contractAddress：可选(如果是合同资产)</p>
            <pre>
              // On Ethereum Bsc Heco
              let = tx{
                from: "0xbc28Ea04101F03aA7a94C1379bc3AB32E65e62d3",
                to: "0x89D24A7b4cCB1b6fAA2625Fe562bDd9A23260359",
                data: "0x",
                value: "0x00",
              }
              // On NULS NERVE
              const tx = {
                from: "TNVTdTSPVcqUCdfVYWwrbuRtZ1oM6GpSgsgF5",
                to: "TNVTdTSPSSLNLNCQMxksTiWj7BTZccXhMyjXk",
                value: "1",
                assetChainId: 2,
                assetId: 1,
                contractAddress: "", // (if it is a contract asset)
              }
              let resData = await nabox.sendTransaction(tx);
              console.log(resData);
            </pre>
          </div>
          <div class="fl" style="width: 30rem">
            <el-form :model="tradingForm" :rules="tradingRules" ref="tradingForm">
              <el-form-item label="from" prop="from">
                <el-input v-model="tradingForm.from">
                </el-input>
              </el-form-item>
              <el-form-item label="to" prop="to">
                <el-input v-model="tradingForm.to">
                </el-input>
              </el-form-item>
              <el-form-item label="资产" prop="assets">
                <el-select v-model="tradingForm.assets" placeholder="请选择资产">
                  <el-option v-for="item of assetsList" :label="item.symbol" :value="item.symbol">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="金额" prop="amount">
                <el-input v-model="tradingForm.amount">
                </el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" maxlength="200" show-word-limit v-model="tradingForm.remarks">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitTrading('tradingForm')">发送</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="普通交易签名" name="signTransaction">
        <div class="info">
          <div class="fl">
            <h2>nabox .signTransaction(tx)</h2>
            <p>参数说明：</p>
            <p>from 可选(插件当前连接的帐户)</p>
            <p>to：必填，接受地址</p>
            <p>data：必填</p>
            <p>value：必填，转账金额</p>
            <p>assetChainId：必填 链id</p>
            <p>assetId：必填 资产id</p>
            <p>contractAddress：可选(如果是合同资产)</p>
            <pre>
              // On Ethereum Bsc Heco
              let = tx{
                from: "0xbc28Ea04101F03aA7a94C1379bc3AB32E65e62d3",
                to: "0x89D24A7b4cCB1b6fAA2625Fe562bDd9A23260359",
                data: "0x",
                value: "0x00",
              }
              // On NULS NERVE
              const tx = {
                from: "TNVTdTSPVcqUCdfVYWwrbuRtZ1oM6GpSgsgF5",
                to: "TNVTdTSPSSLNLNCQMxksTiWj7BTZccXhMyjXk",
                value: "1",
                assetChainId: 2,
                assetId: 1,
                contractAddress: "", // (if it is a contract asset)
              }
              let resData = await nabox.signTransaction(tx);
              console.log(resData);
            </pre>
          </div>
          <div class="fl" style="width: 30rem">
            <!--<el-form :model="tradingForm" :rules="tradingRules" ref="tradingForm">
              <el-form-item label="from" prop="from">
                <el-input v-model="tradingForm.from">
                </el-input>
              </el-form-item>
              <el-form-item label="to" prop="to">
                <el-input v-model="tradingForm.to">
                </el-input>
              </el-form-item>
              <el-form-item label="资产" prop="assets">
                <el-select v-model="tradingForm.assets" placeholder="请选择资产">
                  <el-option v-for="item of assetsList" :label="item.symbol" :value="item.symbol">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="金额" prop="amount">
                <el-input v-model="tradingForm.amount">
                </el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" maxlength="200" show-word-limit v-model="tradingForm.remarks">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitTrading('tradingForm')">发送</el-button>
              </el-form-item>
            </el-form>-->
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div class="font18 fW600">事件</div>
    <!--<el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          一致性 Consistency<i class="header-icon el-icon-info"></i>
        </template>
        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
      </el-collapse-item>
      <el-collapse-item title="反馈 Feedback">
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
      </el-collapse-item>
      <el-collapse-item title="效率 Efficiency">
        <div>简化流程：设计简洁直观的操作流程；</div>
        <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
        <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
      </el-collapse-item>
      <el-collapse-item title="可控 Controllability">
        <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
        <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
      </el-collapse-item>
    </el-collapse>-->
  </div>
</template>

<script>

  export default {
    data() {
      return {
        activeName: 'checkNabox',
        ruleForm: {
          region: '',
        },
        rules: {
          region: [
            {required: true, message: '请选择授权链', trigger: 'change'}
          ]
        },

        balanceForm: {
          address: "",
          assets: '',
        },
        balanceRules: {
          assets: [
            {required: true, message: '请选择资产', trigger: 'change'}
          ]
        },

        tradingForm: {
          from: "",
          to: 'tNULSeBaMvH8TmMZUPQKvc19qeLrD7oN643aBL',
          assets: '',
          amount: '2',
          remarks: 'remarks.....'
        },
        tradingRules: {
          from: [
            {required: true, message: '请选择发送地址', trigger: 'change'}
          ],
          to: [
            {required: true, message: '请输入接受地址', trigger: 'change'}
          ],
          assets: [
            {required: true, message: '请选择资产', trigger: 'change'}
          ],
          amount: [
            {required: true, message: '请输入金额', trigger: 'change'}
          ]
        },
        assetsList: [],//资产列表
      };
    },
    created() {
    },
    mounted() {
    },
    methods: {

      //切换
      async changeCollapse(e) {
        if (e === 'tradingNabox' || e === 'getBalance') {
          this.tradingForm.from = this.$store.getters.getAddressInfo.accounts;
          this.balanceForm.address = this.$store.getters.getAddressInfo.accounts;
          let data = {address: this.$store.getters.getAddressInfo.accounts, chain: "NULS"};
          //console.log(data);
          let resData = await nabox.assetsList(data);
          //console.log(resData);
          if (resData.length !== 0) {
            resData.map(item => {
              item.ids = item.chainId.toString() + item.assetId.toString();
            });
            this.assetsList = resData
          }
        }
      },

      //checkN检查是否安装了
      checkNabox() {
        console.log(window.nabox);
        console.log(typeof window.nabox);
      },

      //连接Nabox
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let naboxInfo = await nabox.createSession({chain: this.ruleForm.region});
            console.log(naboxInfo);
            this.$store.commit("setAddressInfo", {accounts: naboxInfo});
          } else {
            return false;
          }
        });
      },

      //获取公钥
      async getPub() {
        let resData = await nabox.getPub({address: this.$store.getters.getAddressInfo.accounts});
        console.log(resData);
      },

      //获取账户资产余额
      submitBalance(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            //console.log(this.balanceForm);
            let assetsInfo = this.assetsList.filter(obj => obj.ids === this.balanceForm.assets)[0];
            let data = {
              address: this.$store.getters.getAddressInfo.accounts,
              chain: assetsInfo.chain,
              chainId: assetsInfo.chainId,
              assetId: assetsInfo.assetId,
            };
            let resData = await nabox.getBalance(data);
            console.log(resData);
          }
        });
      },

      //发送普通交易
      async submitTrading(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            //console.log(this.tradingForm);
            let tx = {
              from: this.tradingForm.from,
              to: this.tradingForm.to,
              remarks: this.tradingForm.remarks,
            };
            if (this.tradingForm.assets === 'NULS' || this.tradingForm.assets === 'NERVE') {
              tx.value = this.tradingForm.amount;
              let assetInfo = this.assetsList.filter(obj => obj.symbol === this.tradingForm.assets)[0];
              console.log(assetInfo);
              tx.assetChainId = assetInfo.chainId;
              tx.assetId = assetInfo.assetId;
              tx.contractAddress = assetInfo.contractAddress ? assetInfo.contractAddress : "";
            } else {

            }
            console.log(tx, "tx");
            let resData = await nabox.sendTransaction(tx);
            console.log(resData);
          } else {
            return false;
          }
        });
      },

    }
  }
</script>

<style lang="less">
  .home {
    width: 1200px;
    height: 50rem;
    margin: 0 auto;
    .font18 {
      margin: 2rem;
    }
    .info {
      .fl {
        width: 40%;
        font-size: 12px;
        color: #82848a;
        h2, p {
          color: #17202e;
        }
      }
      .fr {
        width: 55%;
      }
    }
  }

</style>
