<Page name="Settings">
  <Navbar backLink title="Nastaveni">
  </Navbar>

  <Block>
    <List>
      <ListItem>
        <div>Defaultni pocet slov:</div>
        <Stepper small round fill value={$settingsData.wordsLimit} min={10} max={100} step={10}
            on:stepperMinusClick={() => { if(wordsLimit > 10) { wordsLimit -= 10 } }}
            on:stepperPlusClick={() => { if(wordsLimit < 100) { wordsLimit += 10 } }} 
            on:stepperChange={saveSettings}
        ></Stepper>
      </ListItem>
      <ListItem>
        <div>
          Automaticke prehravani zvuku:
        </div>
        <Toggle checked color="blue"></Toggle>
      </ListItem>
      <ListItem>
        <div>
          Nocni rezim:
        </div>
        <Toggle checked color="blue"></Toggle>
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

  function saveSettings() {
    $settingsData.wordsLimit = wordsLimit;
    collection.saveSettings($settingsData);
  }
</script>

<style>
</style>

