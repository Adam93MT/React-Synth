import React, { Component } from 'react';
import Constants from './constants.js'

class PianoKey extends Component {

	constructor() {
		super()
		this.getFullNoteName = this.getFullNoteName.bind(this)
		this.state = {
			pressed: false
		}

	}

	static getDerivedStateFromProps(nextProps, prevState) {
		// console.log(nextProps.keyPressed, nextProps.textKey.toUpperCase(), nextProps.keyPressed.includes(nextProps.textKey.toUpperCase()))
		return {pressed: nextProps.keyPressed.includes(nextProps.textKey.toUpperCase())}
	}

	componentDidUpdate(prevProps, prevState){
		if (this.state.pressed !== prevState.pressed) {
			if (this.state.pressed) {
				this.props.Synth.triggerAttack(this.getFullNoteName())
			}
			else {
				this.props.Synth.triggerRelease(this.getFullNoteName())
			}
		}
	}

	getFullNoteName(){
		return this.props.note + this.props.octave
	}

	// placeholder render function
	render() { return ( <div></div> ) }
}

export class WhiteKey extends PianoKey {
	render() {
		return (
			<div className={`key white-key ${this.state.pressed ? 'pressed' : ''}`} id={this.props.note + this.props.octave}>
				<span className="note-text">{this.props.textKey.toUpperCase()}</span>
			</div>
		)
	}
}

export class BlackKey extends PianoKey {
	render() {
		return (
			<div className={`key black-key ${this.state.pressed ? 'pressed' : ''}`} id={this.props.note + this.props.octave}>
				<span className="note-text">{this.props.textKey.toUpperCase()}</span>
			</div>
		)
	}
}