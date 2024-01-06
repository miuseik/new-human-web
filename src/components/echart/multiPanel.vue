<template>
	<div class="echarts-box">
	<div id="myEcharts" :style="{'width': width,'height': height }"></div>
	</div>
</template>

<script setup>
import * as echarts from "echarts";
import {
	onMounted,
	onUnmounted
}                   from "vue";

const props   = defineProps({
	modelValue: {
		type   : [String, Number],
		default: 0,
	},
	width     : {
		type   : [String, Number],
		default: 100,
	},
	height    : {
		type   : [String, Number],
		default: 100,
	},
});
let myEcharts = echarts;

onMounted(() => {
	initChart();
});

onUnmounted(() => {
	myEcharts.dispose;
});

const gaugeData = [
	{
		value : 20,
		name  : 'Good',
		title : {
			offsetCenter: ['-40%', '80%']
		},
		detail: {
			offsetCenter: ['-40%', '95%']
		}
	},
	{
		value : 40,
		name  : 'Better',
		title : {
			offsetCenter: ['0%', '80%']
		},
		detail: {
			offsetCenter: ['0%', '95%']
		}
	},
	{
		value : 60,
		name  : 'Perfect',
		title : {
			offsetCenter: ['40%', '80%']
		},
		detail: {
			offsetCenter: ['40%', '95%']
		}
	}
];
var option      = {
	series: [
		{
			type    : 'gauge',
			anchor  : {
				show     : true,
				showAbove: true,
				size     : 18,
				itemStyle: {
					color: '#FAC858'
				}
			},
			pointer : {
				icon        : 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
				width       : 8,
				length      : '80%',
				offsetCenter: [0, '8%']
			},
			progress: {
				show    : true,
				overlap : true,
				roundCap: true
			},
			axisLine: {
				roundCap: true
			},
			data    : gaugeData,
			title   : {
				fontSize: 14
			},
			detail  : {
				width          : 40,
				height         : 14,
				fontSize       : 14,
				color          : '#ffffff',
				backgroundColor: 'inherit',
				borderRadius   : 3,
				formatter      : '{value}%'
			}
		}
	]
};
const initChart = () => {
	let chart = myEcharts.init(document.getElementById("myEcharts"), "purple-passion");
	setInterval(function () {
		gaugeData[0].value = +(Math.random() * 100).toFixed(2);
		gaugeData[1].value = +(Math.random() * 100).toFixed(2);
		gaugeData[2].value = +(Math.random() * 100).toFixed(2);
		chart.setOption({
			series: [
				{
					data: gaugeData
				}
			]
		});
	}, 2000);
	chart.setOption(option);
	
	window.onresize = function () {
		chart.resize();
	};
}

</script>