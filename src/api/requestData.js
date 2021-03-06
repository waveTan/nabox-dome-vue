import {post} from './https'
import {Plus} from './util'
import {API_CHAIN_ID} from '@/config'

/**
 * 计算手续费
 * @param tx
 * @param signatrueCount 签名数量，默认为1
 **/
export function countFee(tx, signatrueCount) {
  let txSize = tx.txSerialize().length;
  txSize += signatrueCount * 110;
  return 100000 * Math.ceil(txSize / 1024);
}

/**
 * 计算跨链交易手续费
 * @param tx
 * @param signatrueCount 签名数量，默认为1
 **/
export function countCtxFee(tx, signatrueCount) {
  let txSize = tx.txSerialize().length;
  txSize += signatrueCount * 110;
  return 1000000 * Math.ceil(txSize / 1024);
}

/**
 * 获取inputs and outputs
 * @param transferInfo
 * @param balanceInfo
 * @param type
 * @returns {*}
 **/
export async function inputsOrOutputs(transferInfo, balanceInfo, type) {
  let newAmount = Number(Plus(transferInfo.amount, transferInfo.fee));
  let newLocked = 0;
  let newNonce = balanceInfo.nonce;
  let newoutputAmount = transferInfo.amount;
  let newLockTime = 0;
  if (balanceInfo.balance < newAmount) {
    return {success: false, data: "Your balance is not enough."}
  }
  if (type === 4) {
    newLockTime = -1;
  } else if (type === 5) {
    newLockTime = -1;
  } else if (type === 6) {
    newAmount = transferInfo.amount;
    newLocked = -1;
    newNonce = transferInfo.depositHash.substring(transferInfo.depositHash.length - 16);
    newoutputAmount = transferInfo.amount - transferInfo.fee;
  } else if (type === 9) {
    newAmount = transferInfo.amount;
    newLocked = -1;
    newNonce = transferInfo.depositHash.substring(transferInfo.depositHash.length - 16);
    newoutputAmount = transferInfo.amount - transferInfo.fee;
    //锁定三天
    newLockTime = (new Date()).valueOf() + 3600000 * 72;
  } else {
    //return {success: false, data: "No transaction type"}
  }

  let inputs = [{
    address: transferInfo.fromAddress,
    assetsChainId: transferInfo.assetsChainId,
    assetsId: transferInfo.assetsId,
    amount: newAmount,
    locked: newLocked,
    nonce: newNonce
  }];

  if (type === 2 && transferInfo.assetsChainId !== API_CHAIN_ID) {
    inputs[0].amount = transferInfo.amount;
    //账户转出资产余额
    if (balanceInfo.balance < 100000) {
      return {success: false, data: "Your balance is not enough."}
    }
    inputs.push({
      address: transferInfo.fromAddress,
      assetsChainId: API_CHAIN_ID,
      assetsId: transferInfo.assetsId,
      amount: 100000,
      locked: newLocked,
      nonce: balanceInfo.nonce
    })
  }
  let outputs = [];
  if (type === 15) {
    return {success: true, data: {inputs: inputs, outputs: outputs}};
  }
  if (type === 16) {
    if (!transferInfo.toAddress) {
      return {success: true, data: {inputs: inputs, outputs: outputs}};
    } else {
      newoutputAmount = transferInfo.value;
    }
  }
  if (type === 17) {
    return {success: true, data: {inputs: inputs, outputs: outputs}};
  }

  outputs = [{
    address: transferInfo.toAddress ? transferInfo.toAddress : transferInfo.fromAddress,
    assetsChainId: transferInfo.assetsChainId,
    assetsId: transferInfo.assetsId,
    amount: newoutputAmount,
    lockTime: newLockTime
  }];
  return {success: true, data: {inputs: inputs, outputs: outputs}};
}

/**
 * 获取地址信息根据地址
 * @param address
 * @returns {Promise<any>}
 */
export async function getAddressInfoByAddress(address) {
  return await post('/', 'getAccount', [address])
    .then((response) => {
      //console.log(response);
      if (response.hasOwnProperty("result")) {
        return {success: true, data: response.result}
      } else {
        return {success: false, data: response}
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 获取地址信息根据地址
 * @param address
 * @returns {Promise<any>}
 */
export async function getContract(address) {
  return await post('/', 'getContract', [address])
    .then((response) => {
      //console.log(response);
      if (response.hasOwnProperty("result")) {
        return {success: true, data: response.result}
      } else {
        return {success: false, data: response}
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 获取地址的余额及nonce根据地址
 * @param  address
 * @param  assetId
 * @returns {Promise<any>}
 */
export async function getBalanceOrNonceByAddress(chainId, assetId, address) {
  return await post('/', 'getAccountBalance', [chainId, assetId, address])
    .then((response) => {
      //console.log(response);
      if (response.hasOwnProperty("result")) {
        let accountInfo = JSON.parse(localStorage.getItem('accountInfo'));
        if (accountInfo.balance !== response.result.balance) {
          accountInfo.balance = response.result.balance;
          localStorage.setItem('accountInfo', JSON.stringify(accountInfo))
        }
        return {success: true, data: {balance: response.result.balance, nonce: response.result.nonce}}
      } else {
        return {success: false, data: response}
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 验证交易
 * @param txHex
 * @returns {Promise<any>}
 **/
export async function validateTx(txHex) {
  return await post('/', 'validateTx', [txHex])
    .then((response) => {
      if (response.hasOwnProperty("result")) {
        return {success: true, data: response.result};
      } else {
        return {success: false, data: response.error};
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 广播交易
 * @param txHex
 * @returns {Promise<any>}
 **/
export async function broadcastTx(txHex) {
  return await post('/', 'broadcastTx', [txHex])
    .then((response) => {
      if (response.hasOwnProperty("result")) {
        return {success: true, data: response.result};
      } else {
        return {success: false, data: response.error};
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 验证交易并广播
 * @param txHex
 * @returns {Promise<any>}
 **/
export async function validateAndBroadcast(txHex) {
  return await post('/', 'validateTx', [txHex])
    .then((response) => {
      //console.log(response);
      //console.log("---------------------");
      if (response.hasOwnProperty("result")) {
        let newHash = response.result.value;
        return post('/', 'broadcastTx', [txHex])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              return {success: true, hash: newHash};
            } else {
              return {success: false, data: response.error};
            }
          })
          .catch((error) => {
            //console.log(error);
            return {success: false, data: error};
          });
      } else {
        return {success: false, data: response.error};
      }
    })
    .catch((error) => {
      //console.log(error);
      return {success: false, data: error};
    });
}

/**
 * 获取节点的委托列表
 * @param agentHash
 * @returns {Promise<any>}
 **/
export async function agentDeposistList(agentHash) {
  return await post('/', 'getConsensusDeposit', [1, 100, agentHash])
    .then((response) => {
      return response.result;
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}

/**
 * 获取合约代码构造函数
 * @param contractCodeHex
 * @returns {Promise<any>}
 */
export async function getContractConstructor(contractCodeHex) {
  return await post('/', 'getContractConstructor', [contractCodeHex])
    .then((response) => {
      //console.log(response);
      if (response.hasOwnProperty("result")) {
        return {success: true, data: response.result.constructor};
      } else {
        return {success: false, data: response.error};
      }
    })
    .catch((error) => {
      return {success: false, data: error};
    });
}
