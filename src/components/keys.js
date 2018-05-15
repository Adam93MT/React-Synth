import React, { Component } from 'react';
import Constants from './constants.js'

export class PianoKey extends Component {

	constructor() {
		super()
		this.getFullNoteName = this.getFullNoteName.bind(this)
		this.handleClickDown = this.handleClickDown.bind(this)
		this.handleClickUp = this.handleClickUp.bind(this)
		this.state = {
			pressed: false
		}
	}

	componentDidMount(){

	}

	static getDerivedStateFromProps(nextProps, prevState) {
		// console.log(nextProps.keysPressed, nextProps.textKey.toUpperCase(), nextProps.keysPressed.includes(nextProps.textKey.toUpperCase()))
		return {pressed: nextProps.keysPressed.includes(nextProps.textKey.toUpperCase())}
	}

	handleClickDown(){
		this.setState({
			pressed: true
		})
	}

	handleClickUp(){
		this.setState({
			pressed: false
		})
	}

	getFullNoteName(){
		return this.props.note + this.props.octave
	}

	isNoteKeyPress(key){
  		return Constants.textKeys[0].includes(key.toLowerCase()) || Constants.textKeys[1].includes(key.toLowerCase())
  	}

  	hasPressedClass() {
  		return this.state.pressed ? 'pressed' : ''
  	}

	// placeholder render function
	render() { return ( <div></div> ) }
}

export class WhiteKey extends PianoKey {
	render() {
		return (
			<div 
				className={`key white-key ${this.hasPressedClass()}`} 
				id={this.props.note + this.props.octave}
				onMouseDown={this.handleClickDown}
				onMouseUp={this.handleClickUp}
				onMouseOut={this.handleClickUp}>
					<span className="key-text">{this.props.textKey.toUpperCase()}</span>
			</div>
		)
	}
}

export class BlackKey extends PianoKey {
	render() {
		return (
			<div 
				className={`key black-key ${this.hasPressedClass()}`} 
				id={this.props.note + this.props.octave}
				onMouseDown={this.handleClickDown}
				onMouseUp={this.handleClickUp}
				onMouseOut={this.handleClickUp}>
					<span className="key-text">{this.props.textKey.toUpperCase()}</span>
			</div>
		)
	}
}