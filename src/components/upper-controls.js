import React, { Component } from 'react';
// import { PianoKey } from './keys.js'
import { VerticalSlider, HorizontalSlider } from './Sliders.js'
import { WhiteButton } from './Buttons.js'
// import { Line } from 'react-chartjsx'
// import { Line } from './chart.js'
import FilterGraph from './FilterGraph.js'

// import Chart from 'chart.js';

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
				{
				<FilterControls
					filter={this.props.filter}
					setFilterType={this.props.setFilterType}
					setFilterParams={this.props.setFilterParams}
				/>
				}
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
		// console.log(newValue)
	}

	render(){
		return (
			<div className="ctrl-slider-container" id={`${this.props.type}-slider-container`}>
				<span className="ctrl-label">{this.props.type.toUpperCase()}</span> 
				<VerticalSlider
					className="ctrl-slider"
					id={`${this.props.type}-slider`}
					min={0}
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

			autoskip: true,

			legend: {
				display: false
			},

			scales: {
				yAxes: [{
					type: "linear",
					// display: false,
					ticks: {
						min: -6,
						max: 6,
						stepSize: 1
					}
				}],
				xAxes: [{
					type: "logarithmic",
					// display: false,
					ticks: {
						min: 20,
						max: 20000,
					}
				}]
			}
		}
		this.state = {}
		this.filterTypes = [
			"allpass",
			"lowpass",
			"highpass",
			"bandpass",
			"notch",
			"highshelf",
			"lowshelf",
		]

		// Methods
		this.updateQ = this.updateQ.bind(this)
		this.updateFreq = this.updateFreq.bind(this)
	}

	updateQ(newValue){
		this.props.setFilterParams({
			Q: newValue
		})
	}
	updateFreq(newValue){
		this.props.setFilterParams({
			frequency: newValue
		})
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

		let filterValuesIndicator = this.props.filter.type === "allpass" 
		? (
			<div className="filterValues">
			</div>
		) 
		: (
			<div className="filterValues">
				<div>Q: {this.props.filter.Q}</div>
				<div>f: {parseInt(this.props.filter.frequency, 10)} Hz</div>
			</div>
		)

		return(
			<div className="ctrl-container" id="filter-controls">
				<div id="filter-type-select" ref="filter-buttons">
					{FilterButtons}
				</div>
				<div 
					id="filter-graph"
				>
					{filterValuesIndicator}
					<VerticalSlider
						className="ctrl-slider"
						id={`Q-slider`}
						isEnabled={this.props.filter.type !== "allpass"}
						min={0}
						max={5}
						trackHeight={84}
						thumbWidth={12}
						thumbHeight={12}
						margin={[8, 'default', 0, 'default']}
						value={this.props.filter.Q}
						accuracy={10}
						onChange={this.updateQ}
					/>

					<FilterGraph 
						className="fill"
						filterType={this.props.filter.type}
						frequency={this.props.filter.frequency}
						Q={this.props.filter.Q}
					/>

					<HorizontalSlider
						className="ctrl-slider"
						id={`freq-slider`}
						isEnabled={this.props.filter.type !== "allpass"}
						min={20}
						max={20000}
						scale={"log"}
						accuracy={100}
						value={this.props.filter.frequency}
						trackWidth={144}
						thumbWidth={12}
						thumbHeight={12}
						margin={['default', 8, 'default', 28]}
						onChange={this.updateFreq}
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