### Clone
- 이 repo를 git clone 합니다.
- `lottery.js` 파일 내부를 수정합니다.
- `npm run start` 명령어로 실행 후 `localhost:3000`에서 확인 할 수 있습니다.

### Create

- `sudo npm install -g create-react-app` 명령어를 상용해 모듈을 설치 합니다.
- 기존의 프로젝트폴더에서 나와 새로운 리엑트 프로젝트를 생성합니다. 명령어는 다음과 같습니다.
- `create-react-app lottery-react`
- 생성된 리엑트 프로젝트는 `npm run start` 명령어로 실행하고 `localhost:3000` 으로 확인 할 수 있습니다.
- `npm install —-save web3@1.0.0-beta.26` 명령어로 web3 를 설치합니다.
- `src` 폴더에 `web3.js` 파일을 생성 후 다음과 같이 코드를 추가합니다.

```react
// src/web3.js
import Web3 from 'web3';
const web3 = new Web3(window.web3.currentProvider);
export default web3;
```

- web3를 설정한 파일을 추가 하기 위해 `src/app.js` 파일을 수정합니다.

```react
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// web3.js를 추가합니다.
import web3 from './web3';

class App extends Component {
    render() {
        // npm run start 후 개발자 도구의 콘솔창에서 web3의 버전이 출력되는지 확인합니다.
        console.log(web3.version);
        // metamask에 있는 주소를 출력합니다.
        web3.eth.getAccounts().then(console.log);
    /*
    생략
    */
```

- abi 와 address 를 사용하기 위해 `src` 에 `lottery.js` 파일을 생성해 다음과 같이 코드를 작성합니다.

```react
// src/lottery.js
import web3 from './web3';

const address = 'Deploy단계에서 저장했던 address를 입력합니다.';
const abi = 'Deploy단계에서 저장했던 interface를 입력합니다.';

export default new web3.eth.Contract(abi, address);
```

- `App.js` 파일에 `lottery.js` 를 추가합니다.

```react
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
// lottery.js를 추가합니다.
import lottery from './lottery';
```

- `App.js` 파일을 다음과 같이 수정 후 결과를 확인합니다.

```react
class App extends Component {
  state = {
    manager: ''
  };
  
  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    this.setState({ manager });
  }

  render() {
    return (
      <div>
        <h2> Lottery Contract </h2>
        <p> 
          This contract is managed by {this.state.manager}
        </p>
      </div>
    );
  }
}
export default App;
```

- 전체 코드

```react
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };
  
  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }
	// enter() 함수를 실행 하는 이벤트를 생성합니다.
  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction success...'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message: 'you have been entered!'});
  };
	// pickWinner() 함수를 실행하는 이벤트를 생성합니다.
  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'waiting on transaction success ...'});

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!'});
  };

  render() {
    return (
      <div>
        <h2> Lottery Contract </h2>
        <p> 
          This contract is managed by {this.state.manager}
          There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
        <hr/>

        <form onSubmit={this.onSubmit}>
          <h4> want to try your luck? </h4>
          <div>
            <label> Abount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({value: event.target.value })} 
            />
          </div>
          <button>Enter</button>
        </form>
        <hr/>
        
        <h4> Ready to pick a winner? </h4>
        <button onClick={this.onClick}>Pick a winner! </button>
        <hr/>

        <h1> {this.state.message}</h1>
      </div>
    );
  }
}

export default App;
```
