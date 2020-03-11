<Popover class="{name}">
  <List>
    <ListButton popoverClose popupOpen=".feedback" title="Zpetna vazba" />
    <ListButton popoverClose popupOpen=".error-feedback" title="Hlaseni chyb" />
    <ListButton popoverClose title="Nastaveni" />
    <ListButton popoverClose popupOpen=".about" title="O aplikaci" />
  </List>
</Popover>

<About name="about" />
<Feedback name="feedback" />
<Feedback name="error-feedback" />

<script>
  import {
    Popover, Icon, 
    List, ListButton, 
  } from 'framework7-svelte';
  import Feedback  from './Feedback.svelte';
  import About  from './About.svelte';

  export let name;
</script>

