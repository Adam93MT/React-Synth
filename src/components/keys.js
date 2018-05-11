import React, { Component } from 'react';
import Constants from './constants.js'

class PianoKey extends Component {

	constructor() {
		super()
		this.isPressed = this.isPressed.bind(this)
	}

	componentDidMount(){

	}

	isPressed(){
		return this.props.textKey === this.props.charPressed
	}

	render() {
		return (
			<div></div>
		)
	}
}

export class WhiteKey extends PianoKey {
	constructor(props) {
		super(props)
	}

	hasAccidental(){
		// console.log(this.props.note)
		return this.props.note !== 'C' && this.props.note !== 'F'
	}

	render() {
		let idx = this.props.index
		return (
			<div className={`key white-key ${this.isPressed() ? 'pressed' : ''}`} id={this.props.note + this.props.octave}>

					{this.hasAccidental() 
						? <BlackKey 
							note={`${this.props.note}b`} 
							octave={this.props.octave} 
							textKey={ Constants.textKeys[0][idx]}
							charPressed={this.props.charPressed}
						/> 
						: null
					}

					<span className="note-text">{this.props.textKey.toUpperCase()}</span>
			</div>
		)
	}
}

export class BlackKey extends PianoKey {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className={`key black-key ${this.isPressed() ? 'pressed' : ''}`} id={this.props.note + this.props.octave}>
					{this.props.textKey.toUpperCase()}
			</div>
		)
	}
}