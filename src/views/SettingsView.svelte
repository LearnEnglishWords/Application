<Page name="Settings">
  <Navbar backLink title={$_('settings.title')}>
  </Navbar>

  <Block>
    <List>
      <ListItem>
        <div>{$_('settings.words_limit')}</div>
        <Stepper small round fill value={$settingsData.wordsLimit} min={10} max={100} step={10}
            on:stepperMinusClick={() => { if(wordsLimit > 10) { wordsLimit -= 10 } }}
            on:stepperPlusClick={() => { if(wordsLimit < 100) { wordsLimit += 10 } }} 
            on:stepperChange={saveWordLimit}
        ></Stepper>
      </ListItem>

      <ListItem>
        <div>
          {$_('settings.auto_sound')}
        </div>
        {#if enableAutoPlaySound}
          <Toggle on:toggleChange={saveAutoPlaySound} checked color="blue"></Toggle>
        {:else}
          <Toggle on:toggleChange={saveAutoPlaySound} color="blue"></Toggle>
        {/if}
      </ListItem>

      <ListItem>
        <div>
          {$_('settings.pronunciation.text')}
        </div>
        <div class="pronunciation-menu">
        <Menu>
          <MenuItem text={pronunciations[$settingsData.pronunciation]} dropdown>
            <MenuDropdown right>
              <MenuDropdownItem on:click={() => savePronunciation("uk")} text={$_('settings.pronunciation.uk')} />
              <MenuDropdownItem on:click={() => savePronunciation("us")} text={$_('settings.pronunciation.us')} />
            </MenuDropdown>
          </MenuItem>
        </Menu>
        </div>
      </ListItem>
      <!--
      <ListItem>
        <div>
          {$_('settings.night_theme')}
        </div>
        {#if enableDarkMode}
          <Toggle on:toggleChange={saveDarkMode} checked color="blue"></Toggle>
        {:else}
          <Toggle on:toggleChange={saveDarkMode} color="blue"></Toggle>
        {/if}
      </ListItem>
      -->
    </List>
  </Block>
</Page>

<script>
  import { 
    Page, Link, Navbar,
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
</script>

<style>
  .pronunciation-menu {
    --f7-menu-bg-color: #007aff;
  }
</style>

