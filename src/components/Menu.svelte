<Popover class="{name}">
  <List class="menu-list">
    <ListButton popoverClose popupOpen=".feedback" title="{$_('menu.feedback')}" />
    <ListButton popoverClose popupOpen=".error-feedback" title="{$_('menu.error_feedback')}" />
    <ListButton popoverClose href="/Settings" title="{$_('menu.settings')}" />
    <ListButton popoverClose popupOpen=".about" title="{$_('menu.about')}" />
  </List>
</Popover>

<AboutPopup name="about" />
<FeedbackPopup name="feedback" />
<FeedbackPopup name="error-feedback" />

<script>
  import {
    Popover, Icon, 
    List, ListButton, 
  } from 'framework7-svelte';
  import FeedbackPopup  from '../popups/FeedbackPopup.svelte';
  import AboutPopup  from '../popups/AboutPopup.svelte';
  import { _ } from 'svelte-i18n';

  export let name;
</script>

