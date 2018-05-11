import React, { Component } from 'react';
import { WhiteKey } from './keys.js'
import Constants from './constants.js'

export default class Keyboard extends Component {
	constructor(){
		super()
		this.startNote = 'C'
		this.numOctaves = 1 + 6/12
		this.octave = 4
		this.handleKeyStroke = this.handleKeyStroke.bind(this)
		this.handleKeyUp = this.handleKeyUp.bind(this)
		this.state = {
			charPressed: null
		}
	}

	componentWillMount(){
		window.addEventListener("keypress", this.handleKeyStroke, false);
		window.addEventListener("keyup", this.handleKeyUp, false);
	}

	handleKeyStroke(e){
    	console.log('Key press', e.keyCode, String.fromCharCode(e.keyCode))
    	this.setState({
    		charPressed: String.fromCharCode(e.keyCode)
    	})
  	}

  	handleKeyUp(e){
  		this.setState({
  			charPressed: null
  		})
  	}

	setupKeyboardNotes(){
		let keyboard = []
		for (var i = 0; i < this.numOctaves * 12; i++) {
			keyboard.push({
				noteName: Constants.noteNames[i%12], 
				octave: String( this.octave + parseInt(i/12, 10)),
			})
		}
		return keyboard
	}

	render() {
		let keyboardNotes = this.setupKeyboardNotes()
		let whiteKeys = keyboardNotes.filter((thisKey) => thisKey.noteName.length <= 1)
		// Every white key has a (flat) black key (except C & F)
		let Keyboard = whiteKeys.map((thisKey, idx) => 
			<WhiteKey 
				note={thisKey.noteName} 
				octave={thisKey.octave} 
				textKey={Constants.textKeys[1][idx]} 
				index={idx} 
				charPressed={this.state.charPressed}
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

//  # #   # # #   # # 
// c d e f g a b c d e f