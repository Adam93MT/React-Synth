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
		if (this.props !== nextProps) {
			this.drawFilterCurve()
			return true
		} else {
			return false
		}
	}

	drawFilterCurve(){
		const canvas = this.refs.canvas
		const ctx = this.refs.canvas.getContext('2d')
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		let maxY = 0
		let minY = canvas.height
		let midY = (minY-maxY)/2
		let yRange = 10 //Math.max(Math.abs(Math.max(...this.props.filterData)) , Math.abs(Math.min(...this.props.filterData))) * 2
		let yStepSize = canvas.height / yRange

		let xStepSize = canvas.width / this.props.filterData.length

		ctx.strokeStyle = 'rgba(14,0,51,1)';
		ctx.lineWidth = 2
		ctx.beginPath();
		ctx.moveTo(0, midY - this.props.filterData[0] * yStepSize)
		
		for (var i = 1; i < this.props.filterData.length; i++) {
			let x = i*xStepSize
			let y = midY - (this.props.filterData[i] * yStepSize)
			y = FilterGraph.avoidVerticalEdges(y, canvas)

			let cpxOffset = xStepSize/2
			let cp1x = (i-1)*xStepSize + cpxOffset
			let cp1y = midY - (this.props.filterData[i-1] * yStepSize)
			cp1y = FilterGraph.avoidVerticalEdges(cp1y, canvas)
			let cp2x = (i)*xStepSize - cpxOffset
			let cp2y = midY - (this.props.filterData[i] * yStepSize)
			cp2y = FilterGraph.avoidVerticalEdges(cp2y, canvas)

			// console.log(this.props.filterData[i])

			if (this.props.filterType === "lowshelf" || this.props.filterType === "highshelf") {
				if (this.props.filterData[i] === 0) {
					cp2y = cp1y
				} else if (this.props.filterData[i-1] === 0) {
					cp1y = cp2y
				}
			}

			ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
		}

	    ctx.stroke()
	}

	static avoidVerticalEdges(y, canvas){
		if (y === 0) {
			return y + 2
		} else if (y === canvas.height) {
			return y - 2
		}
		else return y
	}

	render(){
		let className = this.props.className ? this.props.className : ''

		if(this.refs.canvas){
			this.drawFilterCurve()
		}

		return(
			<div className={`filter-graph-container ${className}`}>
				<canvas ref="canvas" id="filter-graph-canvas"></canvas>
			</div>
		)
	}
}