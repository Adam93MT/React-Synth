import React, { Component } from 'react';
import Constants from './constants.js'

class PianoKey extends Component {

	constructor() {
		super()
		this.state = {
			pressed: false
		}
	}

	componentDidMount(){

	}

	static getDerivedStateFromProps(nextProps, prevState) {
		// console.log(nextProps.keyPressed, nextProps.textKey.toUpperCase(), nextProps.keyPressed.includes(nextProps.textKey.toUpperCase()))
		return {pressed: nextProps.keyPressed.includes(nextProps.textKey.toUpperCase())}
	}

	hasAccidental(){
		return this.props.note !== 'C' && this.props.note !== 'F'
	}

	render() { return ( <div></div> ) }
}

export class WhiteKey extends PianoKey {
	constructor(props) {
		super(props)
	}

	render() {
		let idx = this.props.index
		return (
			<div className={`key white-key ${this.state.pressed ? 'pressed' : ''}`} id={this.props.note + this.props.octave}>

					{this.hasAccidental() 
						? <BlackKey 
							note={`${this.props.note}b`} 
							octave={this.props.octave} 
							textKey={ Constants.textKeys[0][idx]}
							keyPressed={this.props.keyPressed}
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
			<div className={`key black-key ${this.state.pressed ? 'pressed' : ''}`} id={this.props.note + this.props.octave}>
					{this.props.textKey.toUpperCase()}
			</div>
		)
	}
}