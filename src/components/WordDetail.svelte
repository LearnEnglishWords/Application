
      <List class="detail">
        <div class="block-title">
        <span>{$_('training.sense_title')}</span>
          <span style="float:right;">4/54</span>
        </div>
        {#each word.sense.slice(0,3) as sense, id}
          <ListItem>{sense.toLowerCase()}
            <div class="icon" slot="media">
              <SVGIcon name="translation" size="24"/>
            </div>
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
  import SVGIcon from '../components/SVGIcon.svelte';

  export let word;

  let numbers = ["①", "②", "③", "④", "⑤"];
</script>
