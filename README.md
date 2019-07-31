# 基于create-react-app引入redux-saga的脚手架搭建
## 一、背景介绍
使用了redux的react项目中，数据的请求一般都不会写在组件的声明周期中，而是写在中间件中进行数据的请求，redux-saga就是一个专门用来进行异步操作的中间件，有了redux-saga就可以将react的的同步操作与异步操作区分开来，以便于后期的管理与维护。
## 二、向`react`项目中添加`redux-saga`的步骤


### 1、创建一个简单的react项目


在保存项目的文件夹中，在文件夹空白处按住`shirf`t键`+`鼠标右键弹出一个菜单，接着点击打开**此处打开命令窗口**，在窗口中输入指令
	

	create-react-app react-redux-demo	


空格之后的指令值得就是项目名称，此时项目的名称为`react-redux-demo`，然后按`enter`执行，之后就会自动创建一个简单的`react`项目。
创建完成之后，项目的文件结构如下：

	
	├── node_modules                  // 模块安装依赖包
	├── public                        //公共文件，可以不用管
	│   ├── favicon.ico               //图标
	│   ├── index.html                //入口html
	│   ├── manifest.json             //manifest配置文件，指定应用名称、图标等信息
	├── src 						  //编写自己代码的存放文件
	│   ├── App.css                   //app的引用css文件
	│   ├── App.js					  //组件js文件
	│   ├── App.test.js               //测试文件
	│   ├── index.css                 //idnex引用的css文件
	│   └── index.js				  //页面入口文件
	│   ├── logo.svg                  //页面图片
	│   ├── serviceWorker.js          //加速程序运行文件
	├──.gitignore                     //提交到远程代码库时要忽略的文件
	├──package.json                   //用来声明项目的各种模块安装信息，脚本信息等
	├──package-lock.json              //用来锁定模块安装版本的，确保安装的模块版本一致
	├──README.md					  //盛放关于这个项目的说明文件
	

### 2、打开新建的`react`项目


进入`react-redux-demo`这个项目的文件夹之中，打开命令窗口，输入

	npm start

运行一下项目，测试一下是否运行正常。如果正常运行就会自动在浏览器窗口中打开这个项目，效果如下：

![markdown](https://github.com/Lishengzuo/react-router-demo/raw/master/docimages/runresult.png "cnd")


### 3、在新建的`react`项目中安装`redux-saga`

由于redux-saga是一个中间件，所以redux-saga是基于redux框架运行的，所一我们要使用redux-saga就必须保证react项目中已经搭建好了react-redux框架，所以我们首先要安装redux。先在命令窗口终止项目的运行，然后输入指令

	npm install redux --save-dev

安装redux的依赖包，这主要是为了使用`createStore`这个用来创建`store`的工厂函数和applyMiddleware方法来引入中间件。
接着安装react-redux，在命令窗口中输入

	npm install react-redux --save-dev

安装react-redux的依赖包。
然后安装saga中间件redux-saga，在命令窗口中输入

	npm install redux-saga --save-dev

由于这个项目需要发起数据请求我们还需要引入axios，操作如下

	npm install axios --save-dev

到此就完成了框架环境的搭建。

## 三、在项目中使用redux-saga

## 1、创建一个自定义的组件
在`src`文件夹中创建一个`components`文件夹，用来存放自定义的组件。现在在`components`中新建一个需要请求数据的一个组件Async.js，在componentDidMount中dispatch一个action，并用connect方法让它和store树进行连接，并把store树的初始值展示在组建之中，它的代码如下
	
	import React, { Component } from 'react';
	import { connect } from 'react-redux';

	class Async extends Component {
		componentDidMount() {
			this.props.dispatch({ action: "request_data"});
		}
		render() {
			return (
				<div>
					<p>我是一个需要进行异步请求的组件</p>
					<div>
						{
							asyncData.map((temp, index) => {;
								return (<p key= {index} >{ temp }</p>);
							})
						}
					</div>
				</div>
			);
		}
	}
	const mapStateToProps = (state) => {
		return ({
			asyncData: state.name
		});
	}
	export default connect( mapStateToProps )(Async);

## 2、编写saga.js
在使用saga的项目中，组件触发的action，最先接受到这个action的就是saga，所以我们就先编写saga.js。

在src中创建一个saga文件夹，在其中新建一个saga.js的文件，用来专门编写saga代码。在saga.js我们要编写有两种功能的generator的方法，它们的叫法一般为workersaga和watchsaga，watchsaga是用来监听相应的action的，workersaga就是当watchsaga监听到相应的action的时候要执行的方法，所以具体代码如下

	import Axios from 'axios';
	import { takeEvery, call, put } from 'redux-saga/effects';
	
	function* getAsyncData() {
		const data = yield call(Axios.get, "https://jsonplaceholder.typicode.com/users");
		const arrData = data.data;
		const arrUserName = [];
		for(let obj of arrData) {
			for(let key in obj) {
				if(key === "name") {
					arrUserName.push(obj[key]);
				}
			}
		}
		yield put({ type: "request_success", data: arrUserName });
	}
	function* watchSaga() {
		yield takeEvery("request_data", getAsyncData);
	}	
	export default watchSaga;

在这段代码中，当页面组件触发一个`{type: "request_data"}`的`action`时候，`watchSaga`监听到了这个`action`，就调用`getAsyncData`方法，就发起了一个异步请求，再把请求回来的数据存放到第二个`action{type: "request_success", data: data.data[0].name}`中，然后通过`put`方法把这个`action`发送给`reducer`。

## 3、编写reducer
在`src`中新建一个`reducers`文件夹，再新建一个`reducer.js`的文件，就在这个`reducer.js`文件中编写`reducer`，用来接收action传来的数据，具体代码如下

	const initalAsyncData = {
		name: ""
	}
	function asyncData(state = initalAsyncData, action) {
		switch(action.type) {
			case "request_success":
				return Object.assign({}, state, { name: action.data });
			default:
				return state;
		}
	}
	export default asyncData;	

在这对代码中，当这个reduer就收到一个{type: "request_success"}的action的时候，就会把发送过来的action中的data属性的值赋值给了state对象中的name属性中。最终redcer返回的新的state，又会传给store，从而生成一个store树。

## 4、创建store并引入中间件
在入口文件引入`createStore`、createSagaMiddleware和applyMiddleware方法，然后使用它们创建一个`store`和一个saga中间件,再把`reducer`当作参数传给createStore方法使之生成store树。

	const store = createStore(reducer);
	const sagaMiddleware = createSagaMiddleware();

把saga中间件当做参数传给applyMiddleware方法就会在redux中注册一个saga中间件。最后再把applyMiddleware方法当做参数传给createStore方法。所以完整代码如下

	import React from 'react';
	import ReactDOM from 'react-dom';
	
	import { createStore, applyMiddleware } from 'redux';
	import Reducer from './reducers/reducer.js';
	import { Provider } from 'react-redux';
	import Async from './components/Async.js';
	import createSagaMiddleware from "redux-saga";
	import saga from './saga/saga.js';
	
	const sagaMiddleware = createSagaMiddleware();
	const store = createStore(
		Reducer,
		applyMiddleware(sagaMiddleware)
	);
	sagaMiddleware.run(saga);
	ReactDOM.render(
		<Provider store={ store }>
			<Async />
		</Provider>, 
		document.getElementById('root')
	);

最后把`store`赋值给`Provider`组件中的`store`属性，并调用一下saga中间件sagaMiddleware的run方法

	sagaMiddleware.run(saga);

用来启动watchSaga的监听。到此就完成了在react项目中引入redux-saga的脚手架搭建。

运行效果如下


![markdown](https://github.com/Lishengzuo/react-redux-saga-demo/raw/master/docimages/result.png "result")