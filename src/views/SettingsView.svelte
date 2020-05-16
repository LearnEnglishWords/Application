<Page name="Settings">
  <!-- Navbar -->
  <Header>
    <div class="navbar-title title" slot="title">{$_('app_name')}</div>
  </Header>
  <!-- Header -->
  <div class="header statistics empty"></div>
  <div class="view Settings">
    <!-- Title -->
    <div class="page-title">{$_('settings.subtitle')}</div>
    <List class="settings-list">
      <ListItem>
        <div>{$_('settings.words_limit')}</div>
        <Stepper small fill value={$settingsData.wordsLimit} min={10} max={100} step={10}
            on:stepperMinusClick={() => { if(wordsLimit > 10) { wordsLimit -= 10 } }}
            on:stepperPlusClick={() => { if(wordsLimit < 100) { wordsLimit += 10 } }} 
            on:stepperChange={saveWordLimit}
        ></Stepper>
      </ListItem>
        <li class="accordion-item">
          <a href="#" class="item-content item-link">
            <div class="item-inner">
              <div class="item-title">{$_('settings.pronunciation.text')}</div>
            </div>
          </a>
          <div class="accordion-item-content">
              <ListItem>
                <Button class="settings_button" on:click={() => savePronunciation("uk")}>{$_('settings.pronunciation.uk')}</Button>
              </ListItem>
              <ListItem>
                <Button class="settings_button" on:click={() => savePronunciation("us")}>{$_('settings.pronunciation.us')}</Button>
              </ListItem>
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
      <ListItem style="display:none">
        <div>
          {$_('settings.night_theme')}
        </div>
        {#if enableDarkMode}
          <Toggle on:toggleChange={saveDarkMode} checked></Toggle>
        {:else}
          <Toggle on:toggleChange={saveDarkMode}></Toggle>
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
  </div>
</Page>

<script>
  import { 
    Page, Link, Navbar, Button,
    Block, BlockTitle, 
    List, ListItem, 
    Toggle, Stepper,
    Menu, MenuItem, 
    MenuDropdown, MenuDropdownItem
  } from 'framework7-svelte';
  import { onMount } from 'svelte';
  import DS from '../js/storages/data.js';
  import Header from '../components/Header.svelte';
  import { _ } from 'svelte-i18n';
  import { defaultSettingsData } from '../js/utils.js';
  import { settingsData } from '../js/store.js';

  let wordsLimit = $settingsData.wordsLimit;
  let enableAutoPlaySound = $settingsData.enableAutoPlaySound;
  let enableDarkMode = $settingsData.enableDarkMode;
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

  function saveDarkMode() {
    $settingsData.enableDarkMode = !$settingsData.enableDarkMode;
    DS.saveSettings($settingsData);
  }

  function savePronunciation(pronunciation) {
    $settingsData.pronunciation = pronunciation;
    DS.saveSettings($settingsData);
  }

  function saveWordLimit() {
    $settingsData.wordsLimit = wordsLimit;
    DS.saveSettings($settingsData);
  }

  function saveSwiperTransitionSpeed(speed) {
    $settingsData.swiperTransitionSpeed = speed;
    DS.saveSettings($settingsData);
  }
</script>
