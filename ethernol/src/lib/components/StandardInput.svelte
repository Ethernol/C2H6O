<script lang="ts">
    export let type = 'text';
    export let value: string | number | boolean = '';
    export let placeholder = value as string;
    export let id = '';
    export let readonly = false;
    export let label = '';
    export let hidden = false;
    export let checked = false;
</script>

{#if type === 'checkbox'}
    <div class="flex items-center">
        <label
            class="text-left block text-gray-700 text-sm font-bold my-2 mr-5"
            for={id}
        >
            {label}
        </label>
        <input class="form-checkbox h-5 w-5" {type} {value} {id} {checked} />
    </div>
{:else if type === 'color'}
    <div class="flex items-center">
        <label
            class="text-left block text-gray-700 text-sm font-bold my-2 mr-5"
            for={id}>{label}</label
        >
        <input
            class="bg-white border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            {type}
            {id}
        />
    </div>
{:else}
    <label
        class="text-left block text-gray-700 text-sm font-bold mt-2 mb-2"
        for={id}>{label}</label
    >
    <input
        {type}
        {placeholder}
        {value}
        {id}
        class="shadow appearance-none border 
                rounded w-full py-2 px-3 text-gray-700
                leading-tight
                focus:outline-none focus:shadow-outline"
        {readonly}
        {hidden}
    />
{/if}
