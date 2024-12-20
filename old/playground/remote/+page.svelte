<script lang="ts">


	let data = $props()
	console.log($state.snapshot(data))
</script>

<style>
	.progress-container {
		width: 100%;
		height: 20px;
		background-color: #e0e0e0;
		overflow: hidden;
	}
	.progress-bar {
		height: 100%;
		background-color: theme('colors.orange.400');
		text-align: center;
		white-space: nowrap;
		transition: width 0.1s ease;
	}
</style>
