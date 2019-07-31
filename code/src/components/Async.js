import React, { Component } from 'react';
import { connect } from 'react-redux';

class Async extends Component {
	componentDidMount() {
		this.props.dispatch({ type: "request_data"});
	}
	render() {
		const { asyncData } = this.props;
		const aaa = [];
		return (
			<div>				
				<p>这是一个需要进行异步请求的组件</p>
				<div>
					{
						asyncData.map((temp, index) => {
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