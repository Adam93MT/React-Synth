import React, { Component } from 'react';
import { PianoKey } from './keys.js'
import VerticalSlider from './VerticalSlider.js'

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
					envelope={this.props.envelope}
					setEnvelope={this.props.setEnvelope}
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
				<EnvelopeSlider
					type="attack"
					setEnvelope={this.props.setEnvelope}
					value={this.props.envelope.attack}
					maxValue="2"
				/>
				<EnvelopeSlider
					type="decay"
					setEnvelope={this.props.setEnvelope}
					value={this.props.envelope.decay}
					maxValue="10"
				/>
				<EnvelopeSlider
					type="sustain"
					setEnvelope={this.props.setEnvelope}
					value={this.props.envelope.sustain}
					maxValue="1"
				/>
				<EnvelopeSlider
					type="release"
					setEnvelope={this.props.setEnvelope}
					value={this.props.envelope.release}
					maxValue="5"
				/>
			</div>
		)
	}
}

class EnvelopeSlider extends Component {
	constructor(props){
		super(props)
		this.handleSlide = this.handleSlide.bind(this)
		this.state = {
			value: props.value
		}
	}


	handleSlide(newValue){
		let newEnvelope = {}
		newEnvelope[this.props.type] = newValue
		this.props.setEnvelope(newEnvelope)
		this.setState({
			value: newValue
		})
		console.log(newValue)
	}

	render(){
		return (
			<div className="ctrl-slider-container" id={`${this.props.type}-slider-container`}>
				<span className="ctrl-label">{this.props.type.toUpperCase()}</span> 
				<VerticalSlider
					className="ctrl-slider"
					id={`${this.props.type}-slider`}
					min="0"
					max={this.props.maxValue}
					value={this.state.value}
					accuracy={10}
					onChange={this.handleSlide}
				/>
				<span className="ctrl-label">{this.state.value}</span> 
			</div>
		)
	}
}
/*
<input 
	className="vertical-slider"
	type="range" 
	orient="vertical"
	min="0" 
	max={this.props.maxValue} 
	value={this.state.value}
	step={this.props.maxValue/100}
	onChange={this.handleSlide}
/> */

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