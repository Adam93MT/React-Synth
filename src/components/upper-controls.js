import React, { Component } from 'react';
// import { PianoKey } from './keys.js'
import { VerticalSlider } from './Sliders.js'
import { WhiteButton } from './Buttons.js'
import { Line } from 'react-chartjsx'

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
				<FilterControls
					filter={this.props.filter}
					setFilterType={this.props.setFilterType}
					setFilterParams={this.props.setFilterParams}
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
					waveType="triangle"
				/>
				<WaveFormButton
					selectedWaveform={this.props.waveform}
					setWaveform={this.props.setWaveform}
					waveType="square"
				/>
				<WaveFormButton
					selectedWaveform={this.props.waveform}
					setWaveform={this.props.setWaveform}
					waveType="sine"
				/>
				<WaveFormButton
					selectedWaveform={this.props.waveform}
					setWaveform={this.props.setWaveform}
					waveType="sawtooth"
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

	handleClick(buttonProps){
		this.props.setWaveform(buttonProps.id)
	}

	render(){
		return (
			<WhiteButton 
				forType="wave"
				id={this.props.waveType}
				selectedID={this.props.selectedWaveform}
				iconLocation={"./icons/"}
				onClick={this.handleClick}
			/>
		)
	}
}

// =========== ENVELOPE =========== //

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

// ============ FILTER ============ //

class FilterControls extends Component {
	constructor(){
		super()
		this.chartOptions = {
			responsive: false,
			animation: {
				duration: 0
			},

			events: [],

			legend: {
				display: false
			},

			scales: {
				yAxes: [{
					display: false,
					ticks: {
						min: -5.5,
						max: 5.5
					}
				}],
				xAxes: [{
					display: false
				}]
			}
		}
		this.state = {
			data:  {
				labels: [0, 1, 2, 3, 4],
				datasets: [{ 
					data: [1, -1, 0, -1, 1],
					borderColor: 'rgba(14,0,51,1)',
					borderWidth: 2,
					fill: false,
					pointRadius: 0
				}]
			}
		}
		this.filterTypes = [
			"lowpass",
			"highpass",
			"bandpass",
			"highshelf",
			"lowshelf",
		]
	}

	static getDerivedStateFromProps(nextProps, nextState){
		let newData = [0,0,0,0,0]
		let Q = nextProps.filter.Q

		switch(nextProps.filter.type){
			case "lowpass":
				newData = [0,0,0,Q,-5]
				break;
			case "highpass":
				newData = [-5,Q,0,0,0]
				break;
			case "bandpass":
				newData = [-5, -5, Q, -5, -5]
				break;
			case "lowshelf":
				newData = [Q, Q, 0, -5, -5]
				break;
			case "highshelf":
				newData = [-5, -5, 0, Q, Q]
				break;
			default:
				newData = [0,0,0,0,0]
				break
		}

		return {data: {
				labels: [0, 1, 2, 3, 4],
				datasets: [{
					data: newData,
					borderColor: 'rgba(14,0,51,1)',
					borderWidth: 2,
					fill: false,
					pointRadius: 0
				}]
			}
		}
	}

	render(){
		let FilterButtons = this.filterTypes.map((type) => 
			<FilterTypeButton
				selectedFilter={this.props.filter.type}
				setFilterType={this.props.setFilterType}
				filterType={type}
				key={type}
			/>
		)
		return(
			<div className="ctrl-container" id="filter-controls">
				<div id="filter-type-select">
					{FilterButtons}
				</div>
				<div id="filter-graph">
					<Line 
						data={this.state.data}
						options={this.chartOptions}
						width={"160px"}
						height={"auto"}
						redraw={true}
					/>
				</div>
			</div>
		)
	}
}

// Combine this with WaveFormButton eventually
class FilterTypeButton extends Component {

	constructor(){
		super()
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(buttonProps){
		this.props.setFilterType(buttonProps.id)
	}

	render(){
		return (

			<WhiteButton 
				forType="filter"
				id={this.props.filterType}
				selectedID={this.props.selectedFilter}
				iconLocation={"./icons/"}
				onClick={this.handleClick}
			/>
		)
	}
}