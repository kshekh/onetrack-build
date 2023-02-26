<script>
	import { onMount } from 'svelte';
	let ApexCharts;
	import { dispatchResize } from '$lib/helpers/MiscHelpers';
	export let id;
	export let height;
	export let type;
	export let showGrid;
	export let showScales;
	export let series;
	export let border = '0 0 1rem 1rem';
	export let sparkLine = false;
	export let showTooltip = true;
	onMount(async () => {
		ApexCharts = (await import('../../../lib/local-packages/apexCharts/apexcharts')).default;
		InitChart();
	});
	async function InitChart() {
		let options = getOptions();
		let chartElm = document.querySelector(`#${id}`);
		let chart = new ApexCharts(chartElm, options);
		if (!chartElm || !options || !chart) {
			return;
		}
		chart.render().then(() => {
			setTimeout(dispatchResize, 1000);
			setTimeout(dispatchResize, 3000);
		});
	}

	function getOptions() {
		let options = {
			chart: {
				type: type,
				toolbar: false,
				height: height
			},
			dataLabels: {
				enabled: false
			},
			series: series,
			colors: ['#46A6FF', '#C663F7', '#61F5DB', '#8804C9'],
			fill: {
				type: 'gradient',
				gradient: {
					shadeIntensity: 1,
					opacityFrom: 0.85,
					opacityTo: 0.9,
					stops: [0, 90, 100]
				}
			},
			grid: {
				show: false,
				position: 'back',
				padding: {
					bottom: 0
				},
				xaxis: {
					lines: {
						show: false
					}
				},
				yaxis: {
					lines: {
						show: false
					}
				}
			},
			onDatasetHover: {
				highlightDataSeries: true
			},
			markers: {
				size: 0
			},
			xaxis: {
				show: false,
				type: 'datetime'
			},
			yaxis: {
				show: false
			}
		};
		options.tooltip = {
			enabled: showTooltip,
			theme: 'dark',
			x: {
				show: showTooltip,
				format: 'dd MMM yyyy'
			},
			y: {
				show: showTooltip
			}
		};
		if (sparkLine) {
			options.chart.sparkline = {
				enabled: true
			};
			options.plotOptions = {
				pie: {
					expandOnClick: false
				}
			};
			return options;
		}
		if (showScales) {
			options.xaxis = {
				show: true,
				labels: {
					style: {
						cssClass: 'apexcharts-scales-label'
					}
				}
			};
			options.yaxis = {
				show: true,
				labels: {
					style: {
						cssClass: 'apexcharts-scales-label'
					}
				}
			};
		}
		if (showGrid) {
			options.grid = {
				position: 'back',
				show: true,

				xaxis: {
					lines: {
						show: true
					}
				},
				yaxis: {
					lines: {
						show: true
					}
				}
			};
		}

		return options;
	}
</script>

<div {id} style="border-radius:{border};" />
