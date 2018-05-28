import React, { Component } from 'react';
import '../style/Slider.css'

class Slider extends Component{

	constructor(props){
		super(props)
		this.initialCoord = 0
		this.initialValue = 0
		this.elementSize = 0
		this.elementStart = 0
		// State
		this.state = {
			value: props.value,
			isDragging: false
		}

		// Methods
		this.handleClick = this.handleClick.bind(this)
		this.handleDrag = this.handleDrag.bind(this)
		this.setNewValueOnDrag = this.setNewValueOnDrag.bind(this)
		this.handleRelease = this.handleRelease.bind(this)
		this.handleFocus = this.handleFocus.bind(this)
		this.handleBlur = this.handleBlur.bind(this)
		this.handleKeyDown = this.handleKeyDown.bind(this)
		this.getValueAsPercent = this.getValueAsPercent.bind(this)
		this.getMarginString = this.getMarginString.bind(this)
	}

	componentDidUpdate (props, state) {
		if (this.state.isDragging && !state.isDragging) {
			document.addEventListener('mousemove', this.handleDrag)
			document.addEventListener('mouseup', this.handleRelease)
		} else if (!this.state.isDragging && state.isDragging) {
			document.removeEventListener('mousemove', this.handleDrag)
			document.removeEventListener('mouseup', this.handleRelease)
		}
	}

	handleClick(e){
		if (e.button !== 0) return
		else if (this.props.isEnabled === false) return
		this.initialCoord = e[this.EventCoordName]
		this.initialValue = this.state.value
		this.setState({
			isDragging: true
		})

		e.stopPropagation()
    	e.preventDefault() 
	}

	handleDrag(e){
		if (this.state.isDragging){
			this.setNewValueOnDrag(this.initialCoord, e[this.EventCoordName], this.elementStart, this.elementSize)
		}
		e.stopPropagation()
    	e.preventDefault()
	}

	setNewValueOnDrag(initialPoint, cursorPoint, elemStart, elemSize){
		cursorPoint = Slider.limitToRange(cursorPoint, elemStart, elemStart + elemSize)
		let valueRange = this.props.max - this.props.min

		//  Absolute method (has offset errors)
		let valuePct = (cursorPoint - elemStart) / elemSize
		valuePct = this.type === "vertical" ? 1 - valuePct : valuePct

		let newValue = valuePct * valueRange

		if (this.props.scale === "log" || this.props.scale === "logarithmic") {
			// 0 ==========50==========100 -- pct
			// (pct/(100) * (4-1)) + 1 = log
			// 1 ========== 2 ========== 4 -- log(value)
			// 10^(log) = value
			// 10==========??==========10k -- value
			let logMax = Math.log10(this.props.max)
			let logMin = Math.log10(this.props.min)
			let logValue = (valuePct * (logMax-logMin)) + logMin
			newValue = Math.pow(10, logValue)
		}

		// let diff = cursorPoint - initialPoint
		// diff = this.type === "vertical" ? -diff : diff
		// let pctChange = parseFloat(diff) / parseFloat(elemSize)
		// let valueDiff = pctChange * parseFloat(valueRange)
		// let newValue = this.initialValue + valueDiff

		newValue = Slider.limitToRange(newValue, parseFloat(this.props.min), parseFloat(this.props.max))
		newValue = this.props.accuracy ? Slider.roundToAccuracy(newValue, this.props.accuracy) : newValue
		
		this.setState({
			value: newValue
		})
		this.props.onChange(newValue)
	}

	handleRelease(e){
		this.setState({
			isDragging: false
		})
		this.initialValue = this.state.value
		e.stopPropagation()
    	e.preventDefault()
	}

	// --- Accessibility --- //
	handleFocus(e){
		document.addEventListener('keydown', this.handleKeyDown)
	}
	handleBlur(e){
		document.removeEventListener('keydown', this.handleKeyDown)
	}
	handleKeyDown(e){
		if (this.props.isEnabled === false) return
		let keydown = e.key
		let increment = this.props.accuracy ? 1/this.props.accuracy : 0.01
		let newValue = 0
		if (keydown === this.UpKey) {
			newValue = this.limitToRange(this.state.value + increment, this.props.min, this.props.max)
		} else if (keydown === this.DownKey) {
			newValue = this.limitToRange(this.state.value - increment, this.props.min, this.props.max)
		} else return

		newValue = this.roundToAccuracy(newValue)
		this.setState({
			value: newValue
		})
		this.props.onChange(newValue)
	}

	// -------------------- //

	static limitToRange(val, min, max){
		if (val >= min) {
			if (val <= max) {
				return val
			} else {
				return max
			}
		} else {
			return min
		}
	}

	static roundToAccuracy(number, accuracy){
		if (accuracy) {
			return Math.round(number*accuracy)/accuracy
		}
		else {return number}
	}

	getValueAsPercent(){
		let valueRange = (this.props.max - this.props.min)
		if (this.props.scale === "log" || this.props.scale === "logarithmic") {
			let logMax = Math.log10(this.props.max)
			let logMin = Math.log10(this.props.min)
			let logValue = Math.log10(this.state.value)
			// (pct/(100) * (logMax-logMin)) + logMin = value
			// (value - logMin)/(logmax-logmin)*100 = pct
			return (logValue - logMin)/(logMax - logMin) * 100
		}

		return this.state.value/valueRange * 100
	}

	getMarginString(){
		let num_args = this.props.margin ? this.props.margin.length : 0
		// if there's a blank array index set it to either thumbWidth or thumbHeight depending on the index
		if (num_args > 0) {
			let marginArr = this.props.margin.slice()
			let margin = ''
			for (var i = 0; i < this.props.margin.length; i++) {
				if (this.props.margin[i] === '' || this.props.margin[i] === 'default' || this.props.margin[i] === null) {
					marginArr[i] = i%2 === 0 ? this.props.thumbHeight : this.props.thumbWidth
				}
			}
			switch(num_args){
				case 1:
					margin = `${marginArr[0]}px`
					break;
				case 2:
					margin = `${marginArr[0]}px ${marginArr[1]}px`
					break;
				case 4:
					margin = `${marginArr[0]}px ${marginArr[1]}px ${marginArr[2]}px ${marginArr[3]}px`
					break;
				default:
					margin = `${this.props.thumbHeight}px ${this.props.thumbWidth}px`
					break;
			}
			return margin
		}
		else {
			return `${this.props.thumbHeight}px ${this.props.thumbWidth}px`
		}
	}
}

Slider.defaultProps = {
	isEnabled: true,
	scale: 'linear'
}

// ================================================================ //
// =========================== VERTICAL =========================== //
// ================================================================ //

export class VerticalSlider extends Slider {
	constructor(props){
		super(props)
		this.type = "vertical"
		this.EventCoordName = "pageY"
		this.UpKey = "ArrowUp"
		this.DownKey = "ArrowDown"
	}

	componentDidMount() {
	 	this.elementSize = this.refs[this.props.id].clientHeight
	 	let elem = this.refs[this.props.id]
	 	do {
	        this.elementStart += elem.offsetTop || 0;
	        elem = elem.offsetParent;
	    } while(elem);
	}

	render(){
		let pct = this.getValueAsPercent()
		let margin = this.getMarginString()
		let isEnabledClass = this.props.isEnabled === true ? 'enabled' : 'disabled'

		let trackStyle = {
			height: this.props.trackHeight,
			width: this.props.trackWidth,
			transform: `translateX(${-this.props.trackWidth/2}px)`,
			margin: margin
		}

		let thumbStyle = {
			bottom: pct+'%',
			width: this.props.thumbWidth,
			height: this.props.thumbHeight,
			transform: `translateX(-50%) translateX(${this.props.trackWidth/2}px) translateY(50%)`
		}

		return (
			<div className="slider-relative-container">
				<div 
					className={`slider vertical-slider ${this.props.className} ${isEnabledClass}`} 
					id={this.props.id}
					ref={this.props.id}
					style={trackStyle}
				>
					<div 
						className="min-track" 
						style={{height: pct+'%'}}/>
					<span 
						className="slider-thumb"
						style={thumbStyle} 
						onMouseDown={this.handleClick} 
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}
						tabIndex="0"
					></span>
				</div>
			</div>
		)
	}
}

VerticalSlider.defaultProps = {
	isEnabled: true,
	scale: 'linear',
	trackHeight: 56,
	trackWidth: 2,
	thumbHeight: 16,
	thumbWidth: 24
}

// ================================================================ //
// ========================== HORIZONTAL ========================== //
// ================================================================ //


export class HorizontalSlider extends Slider {
	constructor(props){
		super(props)
		this.type = "horizontal"
		this.EventCoordName = "pageX"
		this.UpKey = "ArrowRight"
		this.DownKey = "ArrowLeft"
	}

	componentDidMount() {
	 	this.elementSize = this.refs[this.props.id].clientWidth
	 	let elem = this.refs[this.props.id]
	 	do {
	        this.elementStart += elem.offsetLeft || 0;
	        elem = elem.offsetParent;
	    } while(elem);
	}

	render(){
		let pct = this.getValueAsPercent()
		let margin = this.getMarginString()
		let isEnabledClass = this.props.isEnabled ? 'enabled' : 'disabled'

		let trackStyle = {
			height: this.props.trackHeight,
			width: this.props.trackWidth,
			transform: `translateY(${-this.props.trackHeight/2}px)`,
			margin: margin
		}

		let thumbStyle = {
			left: pct+'%',
			width: this.props.thumbWidth,
			height: this.props.thumbHeight,
			transform: `translateY(-50%) translateY(${this.props.trackHeight/2}px) translateX(-50%)`
		}

		return (
			<div 
				className={`slider horizontal-slider ${this.props.className} ${isEnabledClass}`} 
				id={this.props.id}
				ref={this.props.id}
				style={trackStyle}
			>
				<div 
					className="min-track" 
					style={{width: pct+'%'}}/>
				<span 
					className="slider-thumb"
					style={thumbStyle} 
					onMouseDown={this.handleClick} 
					onFocus={this.handleFocus}
					onBlur={this.handleBlur}
					tabIndex="0"
				></span>
			</div>
		)
	}
}

HorizontalSlider.defaultProps = {
	isEnabled: true,
	scale: 'linear',
	trackHeight: 2,
	trackWidth: 56,
	thumbHeight: 24,
	thumbWidth: 16
}