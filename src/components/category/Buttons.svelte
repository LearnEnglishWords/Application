{#if $collectionData.id === Collections.PERSONAL.id}
  <PersonalButtons on:continueClick on:editClick />
{:else}
  <div class="footer-container footer-singular">
    <div class="footer-content">
      <Button class="page-button button-next" on:click={() => dispatch('continueClick')}>{$_('category_list.buttons.continue')}</Button>
    </div>
  </div>
{/if}

<script>
  import { Button } from 'framework7-svelte';
  import { collectionData } from '../../js/store.js';
  import { Collections } from '../../js/utils.js';
  import PersonalButtons from './PersonalButtons.svelte';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  export let f7router;

  const dispatch = createEventDispatcher();
</script>
