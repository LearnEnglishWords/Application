{#if !edit}
  <List class="list-container list-categories list-pronunciation">
    {#each word.sense.slice(0,4) as sense, id}
      <ListItem class="list-item" title={sense.toLowerCase()}>
        <div slot="media" class="item-media">
          <SVGIcon name="translation" size="24" />
        </div>
      </ListItem>
    {/each}
  </List>
{:else}
  <List class="list-container list-categories list-pronunciation">
    {#each word.sense.slice(0,4) as sense, id}
      <ListItem class="list-item">
        <div slot="media" class="item-media">
          <SVGIcon name="translation" size="24" />
        </div>
        <input class="edit-input" bind:value={word.sense[id]}/>
        <div class="delete-icon" on:click={() => deleteSense(id)}>
          <SVGIcon name="delete-forever" size="16" />
        </div>
      </ListItem>
    {/each}
    {#if word.sense.length < 4}
      <Button class="word-button button-next" on:click={addSense}>
        {$_('buttons.add_word_sense')}
      </Button>
    {/if}
  </List>
{/if}

<script>
  import { List, ListItem, Button } from 'framework7-svelte';
  import SVGIcon from '../SVGIcon.svelte';
  import { _ } from 'svelte-i18n';

  export let word;
  export let edit;

  function deleteSense(id) {
    word.sense.splice(id, 1);
    word.sense = [...word.sense];
  }

  function addSense() {
    word.sense.push("");
    word.sense = [...word.sense];
  }
</script>
