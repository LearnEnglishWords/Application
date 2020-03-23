<Page name="Settings">

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
          {$_('settings.night_theme')}
        </div>
        {#if enableDarkMode}
          <Toggle on:toggleChange={saveDarkMode} checked color="blue"></Toggle>
        {:else}
          <Toggle on:toggleChange={saveDarkMode} color="blue"></Toggle>
        {/if}
      </ListItem>
    </List>
  </Block>
</Page>

<script>
  import { 
    Page, Link, Navbar,
    Block, BlockTitle, 
    List, ListItem,
    Toggle, Stepper
  } from 'framework7-svelte';
  import { onMount } from 'svelte';
  import Collection from '../js/collection.js';
  import Header from '../components/Header.svelte';
  import { _ } from 'svelte-i18n';
  import { defaultSettingsData } from '../js/utils.js';
  import { settingsData } from '../js/store.js';

  let collection = new Collection();
  let wordsLimit = $settingsData.wordsLimit;
  let enableAutoPlaySound = $settingsData.enableAutoPlaySound;
  let enableDarkMode = $settingsData.enableDarkMode;

  function saveAutoPlaySound() {
    $settingsData.enableAutoPlaySound = !$settingsData.enableAutoPlaySound;
    collection.saveSettings($settingsData);
  }

  function saveDarkMode() {
    $settingsData.enableDarkMode = !$settingsData.enableDarkMode;
    collection.saveSettings($settingsData);
  }

  function saveWordLimit() {
    $settingsData.wordsLimit = wordsLimit;
    collection.saveSettings($settingsData);
  }
</script>

<style>
</style>

