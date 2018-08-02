// src/lottery.js
import web3 from './web3';

const address = 'Deploy단계에서 저장했던 address를 입력합니다.';
const abi = 'Deploy단계에서 저장했던 interface를 입력합니다.';

export default new web3.eth.Contract(abi, address);