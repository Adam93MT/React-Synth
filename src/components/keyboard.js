import React, { Component } from 'react';
import { WhiteKey } from './keys.js'
import Constants from './constants.js'

export default class Keyboard extends Component {
	constructor(){
		super()
		this.startNote = 'C'
		this.numOctaves = 1 + 6/12
		this.octave = 4
		this.handleKeyDown = this.handleKeyDown.bind(this)
		this.handleKeyUp = this.handleKeyUp.bind(this)
		this.state = {
			keyPressed: []
		}
	}

	componentWillMount(){
		window.addEventListener("keydown", this.handleKeyDown, false);
		window.addEventListener("keyup", this.handleKeyUp, false);
	}

	handleKeyDown(e){
		let thisChar = Constants.keyboardMap[e.keyCode]
    	if (!this.state.keyPressed.includes(thisChar)) {
    		this.setState(prevState => ({
    			keyPressed: [...prevState.keyPressed, thisChar]
    		}))
    	} else {
    		// leave state
    	}
  	}

  	handleKeyUp(e){
  		let thisChar = Constants.keyboardMap[e.keyCode]
  		this.setState(prevState => ({
  			keyPressed: this.state.keyPressed.filter((code) => code !== thisChar)
  		}))
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
		// console.log(this.state.keyPressed)
		let keyboardNotes = this.setupKeyboardNotes()
		let whiteKeys = keyboardNotes.filter((thisKey) => thisKey.noteName.length <= 1)
		// Every white key has a (flat) black key (except C & F)
		let Keyboard = whiteKeys.map((thisKey, idx) => 
			<WhiteKey 
				note={thisKey.noteName} 
				octave={thisKey.octave} 
				textKey={Constants.textKeys[1][idx]} 
				index={idx} 
				keyPressed={this.state.keyPressed}
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