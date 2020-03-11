<Popup class={name} animate={true} >
  <Header type="popup" popupName={name} {title}/>

  <Block inset>
    <BlockTitle medium>Nastaveni:</BlockTitle>
    <List>
      <ListItem>
        List item
      </ListItem>
      <ListItem>
        Another list item
      </ListItem>
    </List>
  </Block>
</Popup>

<script>
  import { 
    Popup, Link,
    Block, BlockTitle, 
    Navbar, Subnavbar,
    List, ListItem
  } from 'framework7-svelte';
  import { categoryData, categoryDetailData } from '../js/store.js';
  import Header from '../components/Header.svelte';
  import { _ } from 'svelte-i18n';

  export let name;
  export let title = "Nastaveni";

</script>

<style>
</style>

