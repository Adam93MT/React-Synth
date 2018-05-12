import React, { Component } from 'react';
import Tone from 'tone'
import { WhiteKey, BlackKey } from './keys.js'
import Constants from './constants.js'

export default class KeyboardController extends Component {
	constructor(){
		super()
		this.Synth = new Tone.PolySynth({
			polyphony: 8,
			volume: -3,
			voice: Tone.Synth
		})
		this.startNote = 'C'
		this.numOctaves = 1 + 6/12
		this.octaveMinMax = [1, 7]
		this.handleKeyDown = this.handleKeyDown.bind(this)
		this.handleKeyUp = this.handleKeyUp.bind(this)
		this.state = {
			keyPressed: [],
			octave: 4
		}
	}

	componentDidMount(){
		window.addEventListener("keydown", this.handleKeyDown, false);
		window.addEventListener("keyup", this.handleKeyUp, false);
		this.Synth.toMaster()
	}
	componentWillUnmount(){
		window.removeEventListener("keydown", this.handleKeyDown, false);
		window.removeEventListener("keyup", this.handleKeyUp, false);
	}

	handleKeyDown(e){
		let thisChar = Constants.keyboardMap[e.keyCode]
    	if (this.isValidKey(thisChar) && !this.state.keyPressed.includes(thisChar)) {
    		this.setState(prevState => ({
    			keyPressed: [...prevState.keyPressed, thisChar]
    		}))
    	} else if (thisChar === 'X') {
    		this.incrementOctave(1)
    	} else if (thisChar === 'Z') {
    		this.incrementOctave(-1)
    	} else {
    		// leave state as is
    	}
  	}

  	handleKeyUp(e){
  		let thisChar = Constants.keyboardMap[e.keyCode]
  		this.setState(prevState => ({
  			keyPressed: this.state.keyPressed.filter((code) => code !== thisChar)
  		}))
  	}

  	incrementOctave(incr){
  		if ((this.state.octave + incr) >= this.octaveMinMax[0]) {
  			if ((this.state.octave + incr) <= this.octaveMinMax[1]) {
  				this.setState(prevState => ({
	    			octave: prevState.octave + incr
	    		}))
  			} else {
  				this.setState(prevState => ({
	    			octave: this.octaveMinMax[1]
	    		}))
  			}
  		} else {
  			this.setState(prevState => ({
    			octave: this.octaveMinMax[0]
    		}))
  		}
  	}

  	isValidKey(key){
  		return Constants.textKeys[0].includes(key.toLowerCase()) || Constants.textKeys[1].includes(key.toLowerCase())
  	}

	setupKeyboardNotes(){
		let keyboard = []
		for (var i = 0; i < this.numOctaves * 12; i++) {
			keyboard.push({
				noteName: Constants.noteNames[i%12], 
				octave: String( this.state.octave + parseInt(i/12, 10)),
			})
		}
		return keyboard
	}

	render() {
		let keyboardNotes = this.setupKeyboardNotes()
		let whiteKeys = keyboardNotes.filter((thisKey) => thisKey.noteName.length <= 1)
		// Every white key has a (flat) black key (except C & F)
		let Keyboard = whiteKeys.map((thisKey, idx) => 
			<KeyContainer 
				note={thisKey.noteName} 
				octave={thisKey.octave} 
				index={idx} 
				keyPressed={this.state.keyPressed}
				Synth={this.Synth}
				key={thisKey.noteName + thisKey.octave}
			/>
		)

		return (
			<div className="keyboard">
				{ Keyboard }
			</div>
		)
	}
}

class KeyContainer extends Component {
	hasAccidental(){
		return this.props.note !== 'C' && this.props.note !== 'F'
	}
	render() {
		return (
			<div className="key-container">
				<WhiteKey 
						note={this.props.note} 
						octave={this.props.octave} 
						textKey={ Constants.textKeys[1][this.props.index]}
						keyPressed={this.props.keyPressed}
						Synth={this.props.Synth}
				/>
				{this.hasAccidental() 
					? <BlackKey 
						note={`${this.props.note}b`} 
						octave={this.props.octave} 
						textKey={ Constants.textKeys[0][this.props.index]}
						keyPressed={this.props.keyPressed}
						Synth={this.props.Synth}
					/> 
					: null
				}
			</div>
		)
	}
}