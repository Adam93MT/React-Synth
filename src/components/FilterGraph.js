import React, { Component } from 'react';
import '../style/Graph.css'


export default class FilterGraph extends Component {

	constructor(){
		super()

		this.drawFilterCurve = this.drawFilterCurve.bind(this)
		// this.drawFilterCurve()
	}

	componentDidMount(){
		this.drawFilterCurve()
		// this.ctx.fillStyle = 'green';
		// this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	shouldComponentUpdate(nextProps, nextState){
		if (this.props.filterData !== nextProps.filterData) {
			this.drawFilterCurve()
			return true
		}
		return false
	}

	drawFilterCurve(){

		// console.log(this.props.filterData)
		const canvas = this.refs.canvas
		const ctx = this.refs.canvas.getContext('2d')
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		let maxY = 0
		let minY = canvas.height
		let midY = (minY-maxY)/2
		let yRange = Math.max(Math.abs(Math.max(...this.props.filterData)) , Math.abs(Math.min(...this.props.filterData))) * 2
		let yStepSize = canvas.height / yRange

		let minX = 0
		let maxX = canvas.width 
		// let midX = (maxX-minX)/2
		let xStepSize = canvas.width / this.props.filterData.length
		// TODO make this logarithmic

		ctx.strokeStyle = 'rgba(14,0,51,1)';
		ctx.lineWidth = 2
		ctx.beginPath();
		ctx.moveTo(0, midY - this.props.filterData[0] * yStepSize)

		// console.log(this.props.filterData)
		
		for (var i = 1; i < this.props.filterData.length; i++) {
			let x = i*xStepSize
			let y = midY - (this.props.filterData[i] * yStepSize)
			let cpxOffset = xStepSize/2

			let cp1x = (i-1)*xStepSize + cpxOffset
			let cp1y = midY - (this.props.filterData[i-1] * yStepSize)
			let cp2x = (i)*xStepSize - cpxOffset
			let cp2y = midY - (this.props.filterData[i] * yStepSize)

			// ctx.fillStyle = 'red';
			// ctx.fillRect(cp1x, cp1y, 2, 2);
			// ctx.fillStyle = 'orange';
			// ctx.fillRect(cp2x, cp2y, 2, 2);

			ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
		}

	    ctx.stroke()
	}

	render(){
		let className = this.props.className ? this.props.className : ''

		// this.drawFilterCurve()

		return(
			<div className={`filter-graph-container ${className}`}>
				<canvas ref="canvas" id="filter-graph-canvas"></canvas>
			</div>
		)
	}
}