import React, { Component } from 'react';
import { PianoKey } from './keys.js'

/* Note about controls:
// Control components that represent a key stroke (ex. Octave & Sustain) do not AFFECT the state of the synth.
// They only reflect the current state of the synth on the screen. 
// (i.e. OctaveKey doesn't do anything other than show what key to press)
//
*/

// ========================================================================================== //
// ===================================== UPPER CONTROLS ===================================== //
// ========================================================================================== //

export class UpperControls extends Component {
	render(){
		return (
			<div className="controls" id="upper-controls">
				<WaveFormControls
					waveform={this.props.waveform}
					setWaveform={this.props.setWaveform}
				/>
				<EnvelopeControls

				/>
			</div>
		)
	}
}

// ========== WAVE FORM ========== //

class WaveFormControls extends Component {
	render(){
		return (
			<div className="ctrl-container" id="wave-controls">
				<span className="ctrl-label">WAVEFORM</span> 
				<WaveFormButton
					selectedWaveform={this.props.waveform}
					setWaveform={this.props.setWaveform}
					type="triangle"
				/>
				<WaveFormButton
					selectedWaveform={this.props.waveform}
					setWaveform={this.props.setWaveform}
					type="square"
				/>
				<WaveFormButton
					selectedWaveform={this.props.waveform}
					setWaveform={this.props.setWaveform}
					type="sine"
				/>
				<WaveFormButton
					selectedWaveform={this.props.waveform}
					setWaveform={this.props.setWaveform}
					type="sawtooth"
				/>
			</div>
		)
	}
}

class WaveFormButton extends Component {

	constructor(){
		super()
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(){
		this.props.setWaveform(this.props.type)
	}

	render(){
		return (
			<div 
				className={`ctrl-key wave-key ${this.props.selectedWaveform === this.props.type ? 'selected' : ''}`} 
				id={`${this.props.type}-wave`}
				onClick={this.handleClick}>
					<img 
						src={`./icons/${this.props.type}.png`}
						alt={this.props.type}	
					/>
			</div>
		)
	}
}

// ========== ENVELOPE ========== //

class EnvelopeControls extends Component {
	render(){
		return (
			<div className="ctrl-container" id="envelope-controls">
			</div>
		)
	}
}

class EnvelopeSlider extends Component {
	render(){
		return (
			<div className="ctrl-slider" id={`${this.props.type}-slider`}>
			</div>
		)
	}
}

// ========================================================================================== //
// ===================================== LOWER CONTROLS ===================================== //
// ========================================================================================== //

export class LowerControls extends Component {
	render(){
		return (
			<div className="controls" id="lower-controls">
				<OctaveControls 
					octave={this.props.octave}
					keysPressed={this.props.keysPressed}
				/>
				<SustainControl 
					keysPressed={this.props.keysPressed}
				/>
				<BendControl
					bend={this.props.bend}
					keysPressed={this.props.keysPressed}
				/>
			</div>
		)
	}
}

// ========== OCTAVE ========== //

class OctaveControls extends Component {
	render(){
		return (
			<div className="ctrl-container" id="octave-controls">
				<span className="ctrl-label">OCTAVE: {this.props.octave}</span> 
				<OctaveKey
					textKey={"z"}
					direction={"down"}
					keysPressed={this.props.keysPressed}
				/>
				<OctaveKey
					textKey={"x"}
					direction={"up"}
					keysPressed={this.props.keysPressed}
				/>
			</div>
		)
	}
}

class OctaveKey extends PianoKey {
	render(){
		return (
			<div 
				className={`ctrl-key key octave-key ${this.hasPressedClass()}`} 
				id={`octave-${this.props.direction}`}
				onMouseDown={this.handleClickDown}
				onMouseUp={this.handleClickUp}
				onMouseOut={this.handleClickUp}>
					<div className="key-text">
						{this.props.textKey.toUpperCase()}
					</div>
					<div className="control-command">
						{this.props.direction === "up" ? "+" : "-"}	
					</div>
			</div>
		)
	}
}

// ========== SUSTAIN ========== //

class SustainControl extends Component {
	render(){
		return (
			<div className="ctrl-container" id="sustain-controls">
				<SustainKey
					textKey={" "}
					displayKey={"␣"}
					keysPressed={this.props.keysPressed}
				/>
			</div>
		)
	}
}

class SustainKey extends PianoKey {
	render() {
		return (
			<div 
				className={`ctrl-key key ${this.hasPressedClass()}`} 
				id="sustain-key"
				onMouseDown={this.handleClickDown}
				onMouseUp={this.handleClickUp}
				onMouseOut={this.handleClickUp}>
					<div className="key-text">	
						{this.props.displayKey}
					</div>
					<div className="control-command">
						Sustain
					</div>
			</div>
		)
	}
}

// ========== BEND ========== //


class BendControl extends Component {
	render(){
		return (
			<div className="ctrl-container" id="bend-controls">
				<span className="ctrl-label">PITCH BEND: {this.props.bend}</span> 
				<BendKey
					textKey={"LEFT"}
					displayKey={"←"}
					keysPressed={this.props.keysPressed}
				/>
				<BendKey
					textKey={"RIGHT"}
					displayKey={"→"}
					keysPressed={this.props.keysPressed}
				/>
			</div>
		)
	}
}

class BendKey extends PianoKey {
	render() {
		return (
			<div 
				className={`ctrl-key key ${this.hasPressedClass()}`} 
				id="bend-key"
				onMouseDown={this.handleClickDown}
				onMouseUp={this.handleClickUp}
				onMouseOut={this.handleClickUp}>
					<div className="key-text">	
						{this.props.displayKey}
					</div>
			</div>
		)
	}
}