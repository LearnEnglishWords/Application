
      <List class="detail">
        {#each word.sense.slice(0,3) as sense, id}
          <ListItem>{sense.toLowerCase()}
             <i slot="media" class="material-icons">translate</i>
          </ListItem>
        {/each}
      </List>

<script>
  import { 
    Block, List, ListItem,
    Row, Col, Button
  } from 'framework7-svelte';
  import { _ } from 'svelte-i18n';
  import { trainingData } from '../js/store.js';

  export let word;

  let numbers = ["①", "②", "③", "④", "⑤"];
</script>
