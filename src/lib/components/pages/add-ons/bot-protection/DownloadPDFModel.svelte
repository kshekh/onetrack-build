<script lang="ts">
	import Icon from '$lib/local-packages/Svelte-Icon.svelte';
	import { Icons } from '$lib/resources/IconResources';
	import { closeModal, openModal } from 'svelte-modals';
	// import CheckBox from '$lib/components/layout/CheckBox.svelte';
	// import configrationModal from './configrationModal.svelte';
	import { fly } from 'svelte/transition';
	

	// function handleBack() {
	// 	closeModal();
	// 	openModal(configrationModal, {});
	// }

	export let isOpen: boolean;

    const selectOption = [
        {
            id:'cogs',
            label:'Only missing COGS',
        }, 
        {
            id:'sold',
            label:'Recently sold',
        },
        {
            id:'draft',
            label:'Show draft',
        },
    ]

	const productionCost = [
		{
			icon: Icons.shopifyFill,
			productName: 'Product Name',
			productId: '#HU1244256',
			sellingPrice: '$499',
			itemsQuantity: '1',
			 
		},
        {
			icon: Icons.singleCustomerIcon,
			productName: 'Product Name',
			productId: '#HU1244256',
			sellingPrice: '$499',
			itemsQuantity: '1',
			 
		},
        {
			icon: Icons.shopifyFill,
			productName: 'Product Name',
			productId: '#HU1244256',
			sellingPrice: '$499',
			itemsQuantity: '1',
			 
		},
        {
			icon: Icons.shopifyFill,
			productName: 'Product Name',
			productId: '#HU1244256',
			sellingPrice: '$499',
			itemsQuantity: '1',
			 
		},
        {
			icon: Icons.shopifyFill,
			productName: 'Product Name',
			productId: '#HU1244256',
			sellingPrice: '$499',
			itemsQuantity: '1',
			 
		},
	];

//  if (isOpen){
//     document.body.classList.add('overflow-hidden')
//  }
//  else if (!isOpen) {
//     document.body.classList.remove('overflow-hidden') 
//  }

</script>
 
{#if isOpen}

	<div class="fixed inset-0 z-50 flex p-3 items-center justify-center "
		in:fly={{ y: -50, duration: 500 }}
		out:fly={{ y: -50, duration: 300 }}
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true" >
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="fixed inset-0 bg-black/90 transition-opacity cursor-default" on:click={closeModal} />
		<div class="relative max-h-full flex flex-col rounded-3xl bg-color text-left shadow-xl transition-all sm:my-5 w-full max-w-7xl" >
			<div class="relative max-w-full flex-1 flex flex-col rounded-3xl p-5 xl:p-10" >
				 <div class="flex justify-between gap-5">
					<h3 class="text-3xl font-bold">Bot Protection</h3>
					<Icon
					data={Icons.oneTrackLightGreyFullNameIcon}
					class="lg:h-10 h-7"
					fill="currentColor"
					stroke="currentColor"
				/>
				 </div>

			<div class="rounded-xl overflow-hidden">dssdfds</div>


			</div>
		</div>
	</div>
{/if}
