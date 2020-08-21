{#if saveWord !== null}
  <SaveWordButtons {f7router} saveWord={saveWord} />
{:else}
  {#if $collectionData.id === Collections.PERSONAL.id}
    <PersonalButtons {f7router} on:continueClick on:editClick />
  {:else}
    <ContinueButton on:click={() => dispatch('continueClick')} />
  {/if}
{/if}

<script>
  import { Button, Col, Row } from 'framework7-svelte';
  import { collectionData, categoryData } from '../../js/store.js';
  import { Collections } from '../../js/utils.js';
  import PersonalButtons from './PersonalButtons.svelte';
  import SaveWordButtons from './SaveWordButtons.svelte';
  import CreateButton from './CreateButton.svelte';
  import ContinueButton from '../ContinueButton.svelte';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  export let f7router;
  export let saveWord;

  const dispatch = createEventDispatcher();
</script>
