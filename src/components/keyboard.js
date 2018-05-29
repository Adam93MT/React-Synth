import React, { Component } from 'react';
import Tone from 'tone'
import { WhiteKey, BlackKey } from './keys.js'
import { UpperControls } from './upper-controls.js'
import { LowerControls } from './lower-controls.js'
import Constants from './constants.js'

// =============================== //
// ===== KEYBOARD CONTROLLER ===== //
// =============================== //

export default class KeyboardController extends Component {
	constructor(){
		super()
		// static
		this.pSynth = new Tone.PolySynth()
		this.Filter = new Tone.Filter(1000, "allpass", -12)
		this.startNote = 'C'
		this.numOctaves = 1 + 6/12
		this.octaveMinMax = [2, 7]
		this.noteDelayTime = 0.01
		this.releaseTimers = []

		// functions
		this.setupSynth = this.setupSynth.bind(this)
		this.handleKeyDown = this.handleKeyDown.bind(this)
		this.handleKeyUp = this.handleKeyUp.bind(this)
		this.incrementOctave = this.incrementOctave.bind(this)
		this.getNoteFromTextKey = this.getNoteFromTextKey.bind(this)
		this.setBend = this.setBend.bind(this)
		this.setWaveform = this.setWaveform.bind(this)
		this.setEnvelope = this.setEnvelope.bind(this)
		this.setFilterType = this.setFilterType.bind(this)
		this.setFilterParams = this.setFilterParams.bind(this)
		this.setupFilter = this.setupFilter.bind(this)
		this.removeFilter = this.removeFilter.bind(this)
		this.triggerAttack = this.triggerAttack.bind(this)
		this.triggerRelease = this.triggerRelease.bind(this)

		// state
		this.state = {
			keysPressed: [],
			currentChord: [],
			octave: 4,
			bend: 0,
			waveform: "sine",
			envelope: {
				attack: 0,
				decay: 2.7,
				sustain: 0.2,
				release: 0.15
			},
			filter: {
				type: "allpass",
				rolloff: -12,
				frequency: 440,
				Q: 1,
				gain: 0
			}
		}
	}

	componentDidMount(){
		window.addEventListener("keydown", this.handleKeyDown, false);
		window.addEventListener("keyup", this.handleKeyUp, false);

		this.setupSynth()
		// this.setupFilter()
		this.pSynth.toMaster()

	}
	componentWillUnmount(){
		window.removeEventListener("keydown", this.handleKeyDown, false);
		window.removeEventListener("keyup", this.handleKeyUp, false);
	}

	setupSynth(){
		this.pSynth.set({
			polyphony: 8,
			volume: -12,
			voice: Tone.MonoSynth,
			oscillator: {
				type: this.state.waveform
			},
			envelope: this.state.envelope
		})
	}

	handleKeyDown(e){
		let thisChar = Constants.keyboardMap[e.keyCode]
    	if (this.isValidKeyPress(thisChar) && !this.state.keysPressed.includes(thisChar)) {

    		// add to keysPressed Array
    		this.setState(prevState => ({
    			keysPressed: [...prevState.keysPressed, thisChar]
    		}))

    		// should we make a sound?
    		if (this.isNoteKeyPress(thisChar)) {
    			let note = this.getNoteFromTextKey(thisChar)
    			if (note) {
					if (this.pSynth.context.state !== 'running') {
						this.pSynth.context.resume().then(() => {
							console.log("Resuming Audio Context")
							this.triggerAttack(note)
						})
					} else {
						this.triggerAttack(note)
					}
    			}
    		} else {
    			switch(thisChar){
    				case 'Z':
	    				this.incrementOctave(-1)
	    				break;
	    			case 'X':
						this.incrementOctave(1)
						break;
					case 'LEFT':
						this.setBend(-20)
						break;
					case 'RIGHT':
						this.setBend(20)
						break;
					default:
						break;
    			}
    		}
    	} else {
    		// leave state as is
    	}
  	}

  	handleKeyUp(e){
  		let thisChar = Constants.keyboardMap[e.keyCode]
  		// remove this char from the state array
  		this.setState(prevState => ({
  			keysPressed: this.state.keysPressed.filter((code) => code !== thisChar)
  		}))

  		//
  		// TODO : Press key -> change octave -> release key does not release the note
  		//
  		
  		if (this.isValidKeyPress(thisChar)) {
	  		if (this.isNoteKeyPress(thisChar)) {
	  			if (this.isSustaining()) {} 
	  			else {
					let note = this.getNoteFromTextKey(thisChar)
					if (note) {
						this.triggerRelease(note)	
					}
	  			}
	  		} else {
	  			switch(thisChar){
	  				case ' ':
	  					let notesToHold = this.state.keysPressed.map((k) => this.getNoteFromTextKey(k))
	  					// remove all notes from the current chord when user releases spacebar
			  			for (let note of this.state.currentChord){
			  				note = note.note
			  				if (!notesToHold.includes(note)) {
			  					this.triggerRelease(note)
			  				}
			  			}
			  			break;
			  		case 'LEFT':
			  			if (!this.state.keysPressed.includes('RIGHT')) {
			  				this.setBend(0)
			  			}
			  			break;
			  		case 'RIGHT':
			  			if (!this.state.keysPressed.includes('LEFT')) {
			  				this.setBend(0)
			  			}
			  			break;
			  		default:
			  			break;
	  			}
	  		}
	  	}
  	}

	getNoteFromTextKey(textKey){
		let naturals = Constants.noteNames.filter((note) => note.length <= 1)	// extract just the natural notes
		// merge the first 2 keyboard rows into one array
		let allTextKeys = Constants.textKeys[0].map((v,i) => [v, Constants.textKeys[1][i]] ).reduce((a,b) => a.concat(b));
		let noteMap = allTextKeys.map((v) => 								// iterate over all the possible text keys
			Constants.textKeys[1].includes(v)								// if the current value is in the second row
			? naturals[Constants.textKeys[1].indexOf(v)%naturals.length] 	// set the note value to the corresponding natural note
			: null															// otherwise set it to null (for now)
		)
		noteMap = noteMap.map((note,i) =>										// iterate over the map we just made
			note 																// if the value is not null
			? note 																// just return the value
			: (																	// otherwise...
				(noteMap[i+1] && noteMap[i+1] !== 'C' && noteMap[i+1] !== 'F') 	// if the natural note just sharp of this value isn't C or F
				? noteMap[i+1] + 'b'											// then we return that note, flattened
				: null															// otherwise the note does not exist
			)
		)
		let keyIDX = allTextKeys.indexOf(textKey)
		let note = noteMap[keyIDX] 											// now we get our note
		let allTextKeysReduced = allTextKeys.filter((v,i) => noteMap[i] )	// remove null elements from allTextKeys array
		let octave = parseInt(allTextKeysReduced.indexOf(textKey)/12, 10) + this.state.octave // get the desired octave
		return note ? note + octave : null
	}

	triggerAttack(note){
		// console.log("Attacking", note)
		// console.log("Envelope:", this.pSynth.get("envelope").envelope)

		this.pSynth.triggerAttack(note, `+${this.noteDelayTime}`)
		let attackTime = Tone.now()

		// if the note we're going to play is currently ringing, we just reset the attack time in state
		let noteInChord = this.state.currentChord.find((n) => n.note === note)
		if (noteInChord){
			let noteIDX = this.state.currentChord.indexOf(noteInChord)
			let newChord = this.state.currentChord.slice()
			newChord[noteIDX] = {note: noteInChord.note, attackTime: attackTime}

			this.setState(prevState => ({
				currentChord: newChord
			}))

		} 
		// otherwise, add it to the state array 
		else {
			this.setState(prevState => ({
				currentChord: [...prevState.currentChord, {note: note, attackTime: attackTime}]
			}))
		}
	}

	triggerRelease(note){
		if (this.state.currentChord.find((n) => n.note === note)) {
			let currentTime = Tone.now()
			let noteInfo = this.state.currentChord.filter((n) => n.note === note)[0]
			let noteAttackTime = noteInfo.attackTime ? noteInfo.attackTime : 0
			let timeSinceAttack = currentTime - noteAttackTime
			let envelopeAttack = this.pSynth.get("envelope.attack").envelope.attack
			let delayReleaseTime = timeSinceAttack < envelopeAttack ? (envelopeAttack - timeSinceAttack) + 0.1 : 0.1

			// console.log(currentTime, noteAttackTime, timeSinceAttack, envelopeAttack)
			// console.log(note, "delayRelease", delayReleaseTime)

			this.pSynth.triggerRelease(note, `+${delayReleaseTime}`)
			this.setState(prevState => ({
				currentChord: this.state.currentChord.filter((n) => n.note !== note)
			}))
		}
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

	setBend(bend){
		this.setState(prevState => ({
			bend: bend
		}))
		this.pSynth.set({
			detune: bend
		})
	}

	setWaveform(type){
		this.setState({
			waveform: type
		})
		this.pSynth.set({
			oscillator: {
				type: type
			}
		})
	}

	setEnvelope({attack, decay, sustain, release}){
		attack = parseFloat(attack) || this.state.envelope.attack
		decay = parseFloat(decay) || this.state.envelope.decay
		sustain = parseFloat(sustain) || this.state.envelope.sustain
		release = parseFloat(release) || this.state.envelope.release

		// console.log("setEnvelope", attack, decay, sustain, release)

		this.setState({
			envelope: {
				attack: attack,
				decay: decay,
				sustain: sustain,
				release: release
			}
		})

		this.pSynth.set({
			envelope: {
				attack: attack,
				decay: decay,
				sustain: sustain,
				release: release
			}
		})
	}

	setFilterType(type){
		let newFilter = this.state.filter
		newFilter.type = type

		this.setState(prevState => ({
			filter: newFilter
		}))

		this.setupFilter()
	}

	setFilterParams({frequency, rolloff, Q}){
		let newFilter = this.state.filter
		if (frequency !== this.state.frequency){
			newFilter.frequency = frequency
		}
		if (rolloff !== this.state.rolloff) {
			newFilter.rolloff = rolloff
		}
		if (Q !== this.state.Q) {
			newFilter.Q = Q
		}

		this.setState({
			filter: newFilter
		})

		this.setupFilter()
		
	}

	setupFilter(){
		// this.Filter.dispose()
		// this.Filter = new Tone.Filter(this.state.filter.frequency, this.state.filter.type, this.state.filter.rolloff)
		this.Filter.type = this.state.filter.type
		this.Filter.frequency.value = this.state.filter.frequency
		// this.Filter.rolloff.value = this.state.filter.rolloff
		this.Filter.Q.value = this.state.filter.Q
		this.pSynth.disconnect()
		this.pSynth.connect(this.Filter)
		this.Filter.toMaster()
	}
	removeFilter(){
		this.Filter.disconnect()
		this.pSynth.disconnect()
		this.pSynth.toMaster()
	}

  	isSustaining(){
  		return this.state.keysPressed.includes(' ')
  	}
  	isNoteKeyPress(key){
  		return Constants.textKeys[0].includes(key) || Constants.textKeys[1].includes(key)
  	}
  	isValidKeyPress(key){
  		return this.isNoteKeyPress(key) || Constants.textKeys[2].includes(key)
  	}

	render() {
		// console.log(this.pSynth)
		return (
			<div className="keyboard-container">
				<UpperControls 
					waveform={this.state.waveform}
					setWaveform={this.setWaveform}
					envelope={this.state.envelope}
					setEnvelope={this.setEnvelope}
					filter={this.state.filter}
					setFilterType={this.setFilterType}
					setFilterParams={this.setFilterParams}
				/>
				<KeyboardContainer 
					numOctaves={this.numOctaves} 
					octave={this.state.octave} 
					keysPressed={this.state.keysPressed}
				/>
				<LowerControls
					octave={this.state.octave}
					bend={this.state.bend}
					keysPressed={this.state.keysPressed}
				/>
			</div>
		)
	}
}
/*

*/

// ============================== //
// ===== KEYBOARD CONTAINER ===== //
// ============================== //

class KeyboardContainer extends Component {
	setupKeyboardNotes(){
		let keyboard = []
		for (var i = 0; i < this.props.numOctaves * 12; i++) {
			keyboard.push({
				noteName: Constants.noteNames[i%12], 
				octave: String( this.props.octave + parseInt(i/12, 10)),
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
				keysPressed={this.props.keysPressed}
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

// ============================== //
// ======= KEY CONTAINER ======== //
// ============================== //

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
						keysPressed={this.props.keysPressed}
				/>
				{this.hasAccidental() 
					? <BlackKey 
						note={`${this.props.note}b`} 
						octave={this.props.octave} 
						textKey={ Constants.textKeys[0][this.props.index]}
						keysPressed={this.props.keysPressed}
					/> 
					: null
				}
			</div>
		)
	}
}