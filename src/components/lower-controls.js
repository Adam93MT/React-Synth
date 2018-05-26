import React, { Component } from 'react';
import { PianoKey } from './keys.js'

/* Note about controls:
// Control components that represent a key stroke (ex. Octave & Sustain) do not AFFECT the state of the synth.
// They only reflect the current state of the synth on the screen. 
// (i.e. OctaveKey doesn't do anything other than show what key to press)
//
*/

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