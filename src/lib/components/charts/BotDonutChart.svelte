<script lang="ts">
	import { onMount } from 'svelte';
	import { dispatchResize } from '$lib/helpers/MiscHelpers';

	let ApexCharts: any;

	export let id;
	export let series;
	export let labels;
	export let showLegend = false;
	export let legendPosition = 'right';

	onMount(async () => {
		ApexCharts = (await import('../../local-packages/apexCharts/apexcharts')).default;
		InitChart();
	});

	async function InitChart() {
		let options = {
			series: series,
			chart: {
				type: 'donut',
				height: 240,
				width: 240,
				sparkline: {
					enabled: true
				}
			},
			// legend: {
            // show:true,
			// 	fontFamily: 'Montserrat, Arial'
			// },

            legend: {
                show:true,
                floating: false,
                fontSize: '16x',
                position: 'top',
                horizontalAlign: 'center', 
                fontFamily: 'Montserrat, Arial',
                colors:'#fff',
          formatter: function(val, opts) {
            return val + " - " + opts.w.globals.series[opts.seriesIndex]
          },
          labels: {
          colors: '#fff',
          useSeriesColors: false
      },
        },


			labels: labels,
			colors: ['#22DFBD', '#E14343', '#BD1616', '#0EBF9F', '#61F5DB', '#8804C9'],
			fill: {
				type: 'gradient',
				gradient: {
                    shade: 'dark' , 
					shadeIntensity: 0.35, 
					opacityFrom:205,
					opacityTo: 155,
					 
				}
			},
           
			stroke: {
				show: true,
				curve: 'smooth',
				lineCap: 'butt',
				colors: ['#94EADB','#F67A7A', ],
				width: 1,
				dashArray: 0
			},
			dataLabels: {
				enabled: false
			},
			tooltip: {
				enabled: true,

				style: {
					fontSize: '12px',
					fontFamily: 'Montserrat'
				}
			},
      

			plotOptions: {
				pie: {
					expandOnClick: false
				}
			}
		};
		if (showLegend) {
			options.chart.sparkline.enabled = false;
			options.legend = {
				show: true,
				position: legendPosition,
				labels: {
					colors: ['#fff']
				}
			};
		}
		let chartElm = document.querySelector(`#${id}`);
		if (!chartElm || !options || !series) {
			return;
		}
		let chart = new ApexCharts(chartElm, options);

		chart.render().then(() => {
			setTimeout(dispatchResize, 1000);
			setTimeout(dispatchResize, 3000);
		});
	}
</script>

<div {id} />
