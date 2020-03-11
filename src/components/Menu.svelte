<Popover class="{name}">
  <List>
    <ListButton popoverClose popupOpen=".feedback" title="Zpetna vazba" />
    <ListButton popoverClose popupOpen=".error-feedback" title="Hlaseni chyb" />
    <ListButton popoverClose popupOpen=".settings" title="Nastaveni" />
    <ListButton popoverClose popupOpen=".about" title="O aplikaci" />
  </List>
</Popover>

<AboutPopup name="about" />
<FeedbackPopup name="feedback" />
<FeedbackPopup name="error-feedback" />
<SettingsPopup name="settings" />

<script>
  import {
    Popover, Icon, 
    List, ListButton, 
  } from 'framework7-svelte';
  import FeedbackPopup  from '../popups/FeedbackPopup.svelte';
  import AboutPopup  from '../popups/AboutPopup.svelte';
  import SettingsPopup  from '../popups/SettingsPopup.svelte';

  export let name;
</script>

