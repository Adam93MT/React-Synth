import React, { Component } from 'react';

export class WhiteButton extends Component {
	constructor(){
		super()
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(){
		this.props.onClick(this.props)
	}

	render(){
		return (
			<div 
				className={`ctrl-button ${this.props.forType}-button ${this.props.selectedID === this.props.id ? 'selected' : ''}`}
				id={`${this.props.id}-${this.props.forType}`}
				onClick={this.handleClick}>
					<img 
						src={`${this.props.iconLocation}${this.props.id}.png`}
						alt={this.props.id}	
					/>
			</div>
		)
	}
}