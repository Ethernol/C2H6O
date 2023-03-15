<script>
	import Header from "../Header.svelte";
	import { page } from '$app/stores';
	let address = ""
    const target = $page.url.searchParams.has('target');
	if (target === true){
		address = $page.url.searchParams.get('target');
	}
</script>


<svelte:head>
	<title>Send</title>
	<meta name="description" content="About this app" />
</svelte:head>

<Header />

<div class="text-column">
	<h1>Send </h1>

	{#if target}
		<p>This is {address}</p>
	{:else}
		<p>No target defined.</p>
	{/if}
	
</div>
