import React, { Component } from 'react';
import '../style/VerticalSlider.css'

export default class VerticalSlider extends Component {
	constructor(props){
		super(props)
		this.initialY = 0
		this.initialValue = 0
		this.elementHeight = 0
		this.elementTop = 0
		this.state = {
			value: props.value,
			isDragging: false
		}
		this.handleClick = this.handleClick.bind(this)
		this.handleDrag = this.handleDrag.bind(this)
		this.handleRelease = this.handleRelease.bind(this)
	}



	componentDidMount() {
		console.log(this.refs)
	 	this.elementHeight = this.refs[this.props.id].clientHeight
	 	this.elementTop = this.refs[this.props.id].offsetTop
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
			
			if (this.props.accuracy) {
				newValue = Math.round(newValue*this.props.accuracy)/this.props.accuracy
			}
			// console.log(pageY, yDiff, pctChange, valueDiff, newValue)
			this.setState({
				value: newValue
			})
			this.props.onChange(newValue)
	 	}

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

	render(){
		let pct = this.state.value/(this.props.max - this.props.min) * 100
		// console.log(pct, this.state.value, this.props.max, this.props.min)
		return (
			<div 
				className={`vertical-slider ${this.props.className}`} 
				id={this.props.id}
				ref={this.props.id}>
				<div className="min-track" style={{height: pct+'%'}}/>
				<span 
					className="slider-thumb"
					style={{bottom: pct+'%'}} 
					onMouseDown={this.handleClick} 
					// onMouseMove={this.handleDrag} 
					// onMouseUp={this.handleRelease} 
				></span>
			</div>
		)
	}
}