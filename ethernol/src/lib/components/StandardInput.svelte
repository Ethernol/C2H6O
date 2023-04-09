<script lang="ts">
    export let type = 'text';
    export let value: string | number = '';
    export let placeholder = value as string;
    export let id = '';
    export let readonly = false;
    export let label = '';
    export let hidden = false;
</script>

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
