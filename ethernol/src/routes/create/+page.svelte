<script>
	import { onMount } from "svelte";
	import { copy } from 'svelte-copy';
	import { PrismaClient } from "@prisma/client";
	import { fail } from "@sveltejs/kit";

	const prisma = new  PrismaClient()


	let metaMaskButtonString = "";
	let connected = false;

	let account = "";
	let shortname  = ""
	let base_link = window.location.href
	base_link = base_link.replace("create", "contribute"); 
	base_link += "?target="
	let link = ""
	let link_created = false
	let width = 10
	let heigth = 10
	let ppp = 100000000




	onMount(async () => {
		metaMaskButtonString = checkMetaMask();

		function checkMetaMask() {
			if (typeof window.ethereum == 'undefined') {			
				console.log('MetaMask is not installed!');
				return 'MetaMask is not installed.\nClick here to install!';
			}
			return 'Click to login with MetaMask';
		}
		
    });

	async function onMetaMaskButton(){
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		account = accounts[0];
		connected = true;
		setSmartContractInstance();
	}
	
	function createLink(){
		link_created = true
		if (shortname === ""){
			link = base_link + account
		}
		else{
			link = base_link + shortname
		}
	}

	async function getUser(){
		const user = await prisma.user.findFirstOrThrow({
			where: {
				wallet : account
			}
		})
		return user
	}

	async function createImage() {
        try {
            await prisma.image.create({
                data: {
                    name: shortname,
                    creator: getUser(),
                    blockchain_address : "?"
                }
            })
        } catch (err){
            console.log(err)
            return fail(500, {message: "Database error"})
        }
        return {
            status: 201
        }
    }

</script>
<svelte:head>
	<title>Create</title>
	<meta name="description" content="Create" />
</svelte:head>

<section>
	<h1> Create your Image </h1>
		<span class="welcome">
			<div class="center">
				{#if !connected}
				<div class="center">
					<button class="button-22" on:click={onMetaMaskButton}>
						{metaMaskButtonString}
					</button>
				</div>
				{/if}
				{#if connected}
					<h3> Your Wallet:</h3>
					<input type="text" bind:value={account} placeholder={account} readonly>
					<h3> Enter Shortname:</h3>
					<input type="text" bind:value={shortname}>
					<h3> Image width:</h3>
					<input type="text" bind:value={width}>
					<h3> Image heigth:</h3>
					<input type="text" bind:value={heigth}>
					<h3> Price per pixel:</h3>
					<input type="text" bind:value={ppp}>
					
					{#if !link_created}
						<button class="button-22" on:click={createLink}>
							Create Link
						</button>
					{/if}
					{#if link_created}
						<h3> Link:</h3>
						<h2>{link}</h2>
						<button class="button-22" use:copy={link}>
							Copy!
						</button>
					{/if}
				{/if}
			</div>
		</span>
</section>
<div id="clipboard"></div>

