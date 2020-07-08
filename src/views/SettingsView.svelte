<Page name="Settings">
  <!-- Navbar -->
  <Header {f7router} />

  <!-- Header -->
  <div class="header statistics empty"></div>
  <div class="view Settings">
    <!-- Title -->
    <div class="page-title">{$_('settings.subtitle')}</div>
    <List class="settings-list">
        <li class="accordion-item">
          <a href="#" class="item-content item-link">
            <div class="item-inner">
              <div class="item-title">{$_('settings.pronunciation.text')}:  {pronunciations[$settingsData.pronunciation]}</div>
            </div>
          </a>
          <div class="accordion-item-content" on:click={() => f7.accordion.close(".accordion-item")}>
            <div on:click={() => savePronunciation("uk")}>
              <ListItem>
                <Button class="settings_button">{$_('settings.pronunciation.uk')}</Button>
              </ListItem>
            </div>
            <div on:click={() => savePronunciation("us")}>
              <ListItem>
                <Button class="settings_button">{$_('settings.pronunciation.us')}</Button>
              </ListItem>
            </div>
          </div>
        </li>
      <ListItem>
        <div>
          {$_('settings.auto_sound')}
        </div>
        {#if enableAutoPlaySound}
          <Toggle on:toggleChange={saveAutoPlaySound} checked></Toggle>
        {:else}
          <Toggle on:toggleChange={saveAutoPlaySound}></Toggle>
        {/if}
      </ListItem>
      <ListItem>
        <div>
          {$_('settings.swiper_transition')}
        </div>
        {#if swiperTransitionSpeed}
          <Toggle on:toggleChange={() => saveSwiperTransitionSpeed(0)} checked color="blue"></Toggle>
        {:else}
          <Toggle on:toggleChange={() => saveSwiperTransitionSpeed(300)} color="blue"></Toggle>
        {/if}
      </ListItem>
    </List>
    <Footer />
  </div>
</Page>

<script>
  import { 
    f7, Page, Button,
    Block, BlockTitle, 
    List, ListItem, 
    Toggle
  } from 'framework7-svelte';
  import DS from '../js/storages/data.js';
  import Header from '../components/Header.svelte';
  import Footer  from '../components/Footer.svelte';
  import { _ } from 'svelte-i18n';
  import { defaultSettingsData } from '../js/utils.js';
  import { settingsData } from '../js/store.js';

  export let f7router;

  let enableAutoPlaySound = $settingsData.enableAutoPlaySound;
  let pronunciation = $settingsData.pronunciation;
  let swiperTransitionSpeed = $settingsData.swiperTransitionSpeed;

  const pronunciations = {
    "uk": $_('settings.pronunciation.uk'),
    "us": $_('settings.pronunciation.us')
  }


  function saveAutoPlaySound() {
    $settingsData.enableAutoPlaySound = !$settingsData.enableAutoPlaySound;
    DS.saveSettings($settingsData);
  }

  function savePronunciation(pronunciation) {
    $settingsData.pronunciation = pronunciation;
    DS.saveSettings($settingsData);
  }

  function saveSwiperTransitionSpeed(speed) {
    $settingsData.swiperTransitionSpeed = speed;
    DS.saveSettings($settingsData);
  }
</script>
