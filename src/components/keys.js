import React, { Component } from 'react';

export class WhiteKey extends Component {
	constructor(props) {
		super(props)
	}

	hasFlatKey(){
		console.log(this.props.note)
		return this.props.note !== 'C' && this.props.note !== 'F'
	}

	render() {
		return (
			<div className="key white-key" id={this.props.note + this.props.octave}>
				{this.hasFlatKey() ? <BlackKey note={`${this.props.note}b`} octave={this.props.octave}/> : ''}
				<span className="note-text">{this.props.note}</span>
			</div>
		)
	}
}

export class BlackKey extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="key black-key" id={this.props.note + this.props.octave}>
				{this.props.note}
			</div>
		)
	}
}