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
const frequencyBins = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000]

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
			"highshelf",
			"lowshelf",
		]

		// Methods
		this.updateQ = this.updateQ.bind(this)
		this.updateFreq = this.updateFreq.bind(this)
	}

	static getDerivedStateFromProps(nextProps, nextState){
		let newData = [0,0,0,0,0,0,0,0,0,0]
		let filterPattern = ["before", "at", "after"]
		let Q = nextProps.filter.Q
		let f = nextProps.filter.frequency
		let min = -5
		// Pattern: [before f, at f, after f]

		switch(nextProps.filter.type){
			case "allpass": 
				filterPattern = [Q, Q, Q]
				break;
			case "lowpass":
				filterPattern = [0, Q, min]
				break;
			case "highpass":
				filterPattern = [min, Q, 0]
				break;
			case "bandpass":
				filterPattern = [min, Q, min]
				break;
			case "lowshelf":
				filterPattern = [Q, 0, min]
				break;
			case "highshelf":
				filterPattern = [min, 0, Q]
				break;
			default:
				filterPattern = [0,0,0]
				break
		}

		f = FilterControls.roundToValues(f, frequencyBins)
		let f_idx = frequencyBins.indexOf(f)

		for (var i = 0; i < newData.length; i++) {
			if (i < f_idx) {
				newData[i] = filterPattern[0]
			}
			else if (i === f_idx) {
				newData[i] = filterPattern[1]
			}
			else if (i > f_idx) {
				newData[i] = filterPattern[2]
			}
		}

		// console.log(nextProps.filter.type, filterPattern, newData)
		// console.log(newData)
		// return FilterControls.formatData(newData)
		return {data: newData}
	}

	// static formatData(newData){
	// 	return {
	// 		data: {
	// 			labels: this.frequencyBins,
	// 			datasets: [{
	// 				data: newData,
	// 				borderColor: 'rgba(14,0,51,1)',
	// 				borderWidth: 1,
	// 				fill: true,
	// 				pointRadius: 1
	// 			}]
	// 		}
	// 	}
	// }

	static roundToValues(num, array){
		let last_idx = array.length
		let mp_idx = parseInt(last_idx/2, 10)

		if (last_idx <= 1){
			return (array[1] - num) <= (array[0] - num) ? array[1] : array[0]
		}
		else if (num > array[mp_idx]){
			return FilterControls.roundToValues(num, array.slice(mp_idx, last_idx))
		} else if (num < array[mp_idx]) {
			return FilterControls.roundToValues(num, array.slice(0, mp_idx))
		}

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

		return(
			<div className="ctrl-container" id="filter-controls">
				<div id="filter-type-select">
					{FilterButtons}
				</div>
				<div id="filter-graph">
					<VerticalSlider
						className="ctrl-slider"
						id={`Q-slider`}
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
						filterData={this.state.data}
					/>

					<HorizontalSlider
						className="ctrl-slider"
						id={`freq-slider`}
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