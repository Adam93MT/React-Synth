import React, { Component } from 'react';
import { PianoKey } from './keys.js'

/* Note about controls:
// Control components that represent a key stroke (ex. Octave & Sustain) do not AFFECT the state of the synth.
// They only reflect the current state of the synth on the screen. 
// (i.e. OctaveKey doesn't do anything other than show what key to press)
//
*/

// ============================== //
// ======= UPPER CONTROLS ======= //
// ============================== //

export class UpperControls extends Component {
	render(){
		return (
			<div className="controls" id="upper-controls"></div>
		)
	}
}

// ============================== //
// ======= LOWER CONTROLS ======= //
// ============================== //

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
			</div>
		)
	}
}

// ========== OCTAVE ========== //

class OctaveControls extends Component {
	render(){
		return (
			<div className="ctrl-container" id="octave-controls">
				<span className="control-label">Octave: {this.props.octave}</span> 
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
						␣
					</div>
					<div className="control-command">
						Sustain
					</div>
			</div>
		)
	}
}

