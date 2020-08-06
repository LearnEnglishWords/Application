<List class="list-container list-categories list-pronunciation">
  {#each word.sense.slice(0,4) as sense, id}
    <ListItem class="list-item" title={sense.toLowerCase()}>
      <div slot="media" class="item-media">
        <SVGIcon name="translation" size="24" />
      </div>
    </ListItem>
  {/each}
</List>

<script>
  import { List, ListItem } from 'framework7-svelte';
  import SVGIcon from '../SVGIcon.svelte';

  export let word;
</script>
