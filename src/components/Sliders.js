import React, { Component } from 'react';
import '../style/Slider.css'

class Slider extends Component{

	constructor(props){
		super(props)
		// State
		this.state = {
			value: props.value,
			isDragging: false
		}

		// Methods
		this.handleClick = this.handleClick.bind(this)
		this.handleDrag = this.handleDrag.bind(this)
		this.handleRelease = this.handleRelease.bind(this)
		this.handleFocus = this.handleFocus.bind(this)
		this.handleBlur = this.handleBlur.bind(this)
		this.handleKeyDown = this.handleKeyDown.bind(this)
		this.limitToRange = this.limitToRange.bind(this)
		this.roundToAccuracy = this.roundToAccuracy.bind(this)
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
		//will be overwritten
		e.stopPropagation()
    	e.preventDefault() 
	}

	handleDrag(e){
		// will be overwritten
		e.stopPropagation()
    	e.preventDefault()
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
		// will be overwritten
		e.stopPropagation()
    	e.preventDefault()
	}

	// -------------------- //

	limitToRange(val, min, max){
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

	roundToAccuracy(number){
		if (this.props.accuracy) {
			return Math.round(number*this.props.accuracy)/this.props.accuracy
		}
		else {return number}
	}
}

// ================================================================ //
// =========================== VERTICAL =========================== //
// ================================================================ //

export class VerticalSlider extends Slider {
	constructor(props){
		super(props)
		this.initialY = 0
		this.initialValue = 0
		this.elementHeight = 0
		this.elementTop = 0
	}

	componentDidMount() {
		// console.log(this.refs)
	 	this.elementHeight = this.refs[this.props.id].clientHeight
	 	this.elementTop = this.refs[this.props.id].offsetTop
	}

	handleClick(e){
		if (e.button !== 0) return
		this.initialY = e.pageY
		this.initialValue = this.state.value
		this.setState({
			isDragging: true
		})
		e.stopPropagation()
    	e.preventDefault() 
	}

	handleDrag(e){
		if (this.state.isDragging){
			let pageY = e.pageY
			pageY = this.limitToRange(pageY, this.elementTop, this.elementTop + this.elementHeight)

			let yDiff = this.initialY - pageY
			let pctChange = parseFloat(yDiff) / parseFloat(this.elementHeight)
			let valueDiff = pctChange * parseFloat(this.props.max - this.props.min)
			let newValue = this.limitToRange(this.initialValue + valueDiff, parseFloat(this.props.min), parseFloat(this.props.max))
			
			newValue = this.roundToAccuracy(newValue)
			// console.log(pageY, yDiff, pctChange, valueDiff, newValue)
			this.setState({
				value: newValue
			})
			this.props.onChange(newValue)
	 	}
	 	e.stopPropagation()
    	e.preventDefault()
	}

	handleKeyDown(e){
		let keydown = e.key
		let increment = this.props.accuracy ? 1/this.props.accuracy : 0.01
		let newValue = 0
		if (keydown === "ArrowUp") {
			newValue = this.limitToRange(this.state.value + increment, this.props.min, this.props.max)
		} else if (keydown === "ArrowDown") {
			newValue = this.limitToRange(this.state.value - increment, this.props.min, this.props.max)
		} else return

		newValue = this.roundToAccuracy(newValue)
		this.setState({
			value: newValue
		})
		this.props.onChange(newValue)
	}

	render(){
		let pct = this.state.value/(this.props.max - this.props.min) * 100
		let trackStyle = {
			height: this.props.trackHeight,
			width: this.props.trackWidth,
			transform: `translateX(${-this.props.trackWidth/2}px)`,
			margin: `${this.props.thumbHeight}px ${this.props.thumbWidth}px ${this.props.thumbHeight}px ${this.props.thumbWidth}px`
		}

		let thumbStyle = {
			bottom: pct+'%',
			width: this.props.thumbWidth,
			height: this.props.thumbHeight,
			transform: `translateX(-50%) translateX(${this.props.trackWidth/2}px) translateY(50%)`
		}

		return (
			<div 
				className={`slider vertical-slider ${this.props.className}`} 
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
		)
	}
}

VerticalSlider.defaultProps = {
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
		this.initialX = 0
		this.initialValue = 0
		this.elementWidth = 0
		this.elementTop = 0
	}

	componentDidMount() {
		console.log(this.refs)
	 	this.elementWidth = this.refs[this.props.id].clientWidth
	 	this.elementLeft = this.refs[this.props.id].offsetLeft
	}

	handleClick(e){
		if (e.button !== 0) return
		this.initialX = e.pageX
		this.initialValue = this.state.value
		this.setState({
			isDragging: true
		})
		e.stopPropagation()
    	e.preventDefault() 
	}

	handleDrag(e){
		if (this.state.isDragging){
			let pageX = e.pageX
			pageX = this.limitToRange(pageX, this.elementLeft, this.elementLeft + this.elementWidth)

			let xDiff = pageX - this.initialX
			let pctChange = parseFloat(xDiff) / parseFloat(this.elementWidth)
			let valueDiff = pctChange * parseFloat(this.props.max - this.props.min)
			let newValue = this.limitToRange(this.initialValue + valueDiff, parseFloat(this.props.min), parseFloat(this.props.max))
			
			newValue = this.roundToAccuracy(newValue)

			this.setState({
				value: newValue
			})
			this.props.onChange(newValue)
	 	}
	 	e.stopPropagation()
    	e.preventDefault()
	}

	handleKeyDown(e){
		let keydown = e.key
		let increment = this.props.accuracy ? 1/this.props.accuracy : 0.01
		let newValue = 0
		if (keydown === "ArrowRight") {
			newValue = this.limitToRange(this.state.value + increment, this.props.min, this.props.max)
		} else if (keydown === "ArrowLeft") {
			newValue = this.limitToRange(this.state.value - increment, this.props.min, this.props.max)
		} else return

		newValue = this.roundToAccuracy(newValue)
		this.setState({
			value: newValue
		})
		this.props.onChange(newValue)
	}

	render(){
		let pct = this.state.value/(this.props.max - this.props.min) * 100
		let trackStyle = {
			height: this.props.trackHeight,
			width: this.props.trackWidth,
			transform: `translateY(${-this.props.trackHeight/2}px)`,
			margin: `${this.props.thumbHeight}px ${this.props.thumbWidth}px ${this.props.thumbHeight}px ${this.props.thumbWidth}px`
		}

		let thumbStyle = {
			left: pct+'%',
			width: this.props.thumbWidth,
			height: this.props.thumbHeight,
			transform: `translateY(-50%) translateY(${this.props.trackHeight/2}px) translateX(-50%)`
		}

		return (
			<div 
				className={`slider horizontal-slider ${this.props.className}`} 
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
		)
	}
}

HorizontalSlider.defaultProps = {
	trackHeight: 2,
	trackWidth: 56,
	thumbHeight: 24,
	thumbWidth: 16
}