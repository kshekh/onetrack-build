<script>
	export let field;
	export let value;
	export let period;
</script>

<div class="glass header-card">
	<p>{field}</p>
	<div class="centered">
		<p>{value}</p>
		<p>{period}</p>
	</div>
</div>

<style lang="scss">
		.glass {
		border-radius: 1rem;
		backdrop-filter: blur(100px);
		-webkit-backdrop-filter: blur(100px);
		background: linear-gradient(
			116.02deg,
			rgba(255, 255, 255, 0.05) 0%,
			rgba(255, 255, 255, 0.02) 100%
		);
		box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1), inset -0.5px -0.5px 1px rgba(255, 255, 255, 0.1),
			inset 0.5px 0.5px 1px rgba(0, 0, 0, 0.1);
	}
	.header-card {
		display: grid;
		grid-template-rows: 1fr 4fr;
		align-items: center;
		min-width: 180px;
		p {
			font-weight: bold;
		}
		& :nth-child(1) {
			font-size: 18px;
			font-family: 'Montserrat';
			padding-left: 0.4rem;
			line-height: 20px;
			width: 100%;
			font-weight: 600;
			padding: 5px;
			padding-left: 10px;

			grid-area: 1 / 1 / 2 / 2;
		}
		& .centered {
			grid-area: 2 / 1 / 3 / 2;
			& :nth-child(1) {
				font-family: 'Montserrat';
				font-size: 40px;
				font-style: normal;
				line-height: 20px;
				font-weight: 700;
				text-align: center;
			}
			& :nth-child(2) {
				margin-top: 0.6rem;
				font-family: 'Montserrat';
				font-size: 16px;
				line-height: 20px;
				font-weight: 700;
				text-align: center;
			}
		}
	}
	@media (max-width: 767px) {
		.header-card {
			height: 35vw;
			width: 43vw;
			padding: 0.3rem;
		}
		.centered {
			& :nth-child(1) {
				font-size: 30px !important;
			}
		}
	}

	@media (min-width: 768px) and (max-width: 992px) {
		.header-card {
			height: 19vw;
			width: 28vw;
			padding: 0.3rem;
		}
	}
	@media (min-width: 1200px) {
		.header-card {
			flex-grow: 1;
			flex-shrink: 1;
			flex-basis: 0;
		}
	}
</style>
