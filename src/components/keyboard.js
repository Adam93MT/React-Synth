import React, { Component } from 'react';
import { WhiteKey, BlackKey, SpacerKey } from './keys.js'

export default class Keyboard extends Component {
	constructor(){
		super()
		this.noteNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
		this.startNote = 'C'
		this.numOctaves = 2
		this.octave = 4
	}

	setupKeyboardNotes(){
		let keyboard = []
		for (var i = 0; i < this.numOctaves * 12; i++) {
			keyboard.push(
				[this.noteNames[i%12], String( this.octave + parseInt(i/12))]
			)
		}
		return keyboard
	}

	render() {
		let keyboardNotes = this.setupKeyboardNotes()
		let whiteKeys = keyboardNotes.filter((note) => note[0].length <= 1)
		// Every white key has a (flat) black key (except C & F)
		let Keyboard = whiteKeys.map((note) => <WhiteKey note={note[0]} octave={note[1]} key={note}/>)

		return (
			<div className="keyboard">
				{ Keyboard }
			</div>
		)
	}
}