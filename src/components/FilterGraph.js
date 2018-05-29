import React, { Component } from 'react';
import '../style/Graph.css'

// frequencyBins = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000]
const frequencyBins = [16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000]
export default class FilterGraph extends Component {

	constructor(){
		super()
		
		this.drawFilterCurve = this.drawFilterCurve.bind(this)
		// this.drawFilterCurve()
		this.state = {}
	}

	static getDerivedStateFromProps(nextProps, nextState){
		let newData = frequencyBins.slice()
		newData.fill(0)
		let filterPattern = [0,0,0]
		// Pattern: [before f, at f, after f]
		let Q = nextProps.Q
		let f = nextProps.frequency
		let min = -5

		switch(nextProps.filterType){
			case "allpass": 
				filterPattern = [Q, Q, Q]
				break;
			case "lowpass":
				filterPattern = [0, Q, min]
				break;
			case "highpass":
				filterPattern = [min, Q, 0]
				break;
			case "bandpass":
				filterPattern = [0, Q, 0]
				break;
			case "notch":
				filterPattern = [0, -Q, 0]
				break;
			case "lowshelf":
				filterPattern = [Q, 0, min]
				break;
			case "highshelf":
				filterPattern = [min, 0, Q]
				break;
			default:
				filterPattern = [0,0,0]
				break
		}

		f = FilterGraph.roundToValues(f, frequencyBins)
		// let f_bin = frequencyBins.indexOf(f)
		// console.log(f,f_bin)

		for (var i = 0; i < newData.length; i++) {
			if (frequencyBins[i] === f) {
				newData[i] = filterPattern[1]
			} 
			else if (frequencyBins[i+1] === f) {
				newData[i] = filterPattern[0] + Math.abs(filterPattern[1] - filterPattern[0])/2
			}
			else if (frequencyBins[i-1] === f) {
				newData[i] = filterPattern[1] - Math.abs(filterPattern[2] - filterPattern[1])/2
			}
			else if (frequencyBins[i] < f) {
				newData[i] = filterPattern[0]
			}
			else if (frequencyBins[i] > f) {
				newData[i] = filterPattern[2]
			}
		}

		return {data: newData}
	}

	static roundToValues(num, array){
		let last_idx = array.length
		let mp_idx = parseInt(last_idx/2, 10)

		if (last_idx <= 1){
			return (array[1] - num) <= (array[0] - num) ? array[1] : array[0]
		}
		else if (num > array[mp_idx]){
			return FilterGraph.roundToValues(num, array.slice(mp_idx, last_idx))
		} else if (num < array[mp_idx]) {
			return FilterGraph.roundToValues(num, array.slice(0, mp_idx))
		}

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
		let midY = (minY-maxY) / 2
		let yRange = 10 //Math.max(Math.abs(Math.max(...this.state.data)) , Math.abs(Math.min(...this.state.data))) * 2
		let yStepSize = canvas.height / yRange
		let xStepSize = canvas.width / this.state.data.length

		ctx.strokeStyle = 'rgba(14,0,51,1)';
		ctx.lineWidth = 2
		ctx.beginPath();
		ctx.moveTo(0, FilterGraph.avoidVerticalEdges(midY - this.state.data[0] * yStepSize, canvas))

		let f = FilterGraph.roundToValues(this.props.frequency, frequencyBins)
		let graphPoints = [
			0,								// start
			frequencyBins.indexOf(f) - 2, 	// before the bump
			frequencyBins.indexOf(f), 		// the bump
			frequencyBins.indexOf(f) + 2,	// after the bump
			frequencyBins.length - 1		// end
		]

		
		for (var i = 1; i < this.state.data.length; i++) {

			if (!graphPoints.includes(i)) {
				continue
			}
			if (this.props.filterType === "lowshelf" || this.props.filterType === "highshelf"){
				if (frequencyBins[i] === f){
					continue;
				}
			}

			let last_idx = graphPoints.includes(i-1) ? i-1 : i-2
			let x = i*xStepSize
			let y = midY - (this.state.data[i] * yStepSize)
			y = FilterGraph.avoidVerticalEdges(y, canvas)

			let cpxOffset = xStepSize

			let cp1x = (last_idx)*xStepSize + cpxOffset
			let cp1y = midY - (this.state.data[last_idx] * yStepSize)
			cp1y = FilterGraph.avoidVerticalEdges(cp1y, canvas)

			let cp2x = (i)*xStepSize - cpxOffset
			let cp2y = midY - (this.state.data[i] * yStepSize)
			cp2y = FilterGraph.avoidVerticalEdges(cp2y, canvas)

			ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
		}

	    ctx.stroke()
	}

	static avoidVerticalEdges(y, canvas){
		if (y <= 0) {
			return canvas.getContext('2d').lineWidth
		} else if (y >= canvas.height) {
			return canvas.height - canvas.getContext('2d').lineWidth
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