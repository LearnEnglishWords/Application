<Page name="Settings">
  <!-- Navbar -->
  <Header {f7router} />

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

      <li class="accordion-item accordion-pronunciation-item">
        <a href="#" class="item-content item-link">
          <div class="item-inner">
            <div class="item-title">{$_('settings.pronunciation.text')}:  {pronunciations[$settingsData.pronunciation]}</div>
          </div>
        </a>
        <div class="accordion-item-content" on:click={() => f7.accordion.close(".accordion-pronunciation-item")}>
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

      <li class="accordion-item accordion-translator-item">
        <a href="#" class="item-content item-link">
          <div class="item-inner">
            <div class="item-title">{$_('settings.translator.text')}:  {translatorEngines[$settingsData.translator === undefined ? "google" : $settingsData.translator]}</div>
          </div>
        </a>
        <div class="accordion-item-content" on:click={() => f7.accordion.close(".accordion-translator-item")}>
          <div on:click={() => saveTranslator("google")}>
            <ListItem>
              <Button class="settings_button">{$_('settings.translator.google')}</Button>
            </ListItem>
          </div>
          <div on:click={() => saveTranslator("microsoft")}>
            <ListItem>
              <Button class="settings_button">{$_('settings.translator.microsoft')}</Button>
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

      <ListItem>
        <div>
          {$_('settings.user_level')}
        </div>
        {#if advancedUser}
          <Toggle on:toggleChange={saveUserLevel} checked></Toggle>
        {:else}
          <Toggle on:toggleChange={saveUserLevel}></Toggle>
        {/if}
      </ListItem>

      <ListItem>
        <div>
          {$_('settings.quiz')}
        </div>
        {#if enableQuiz}
          <Toggle on:toggleChange={saveQuiz} checked></Toggle>
        {:else}
          <Toggle on:toggleChange={saveQuiz}></Toggle>
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
    Toggle, Stepper
  } from 'framework7-svelte';
  import DS from '../js/storages/data.js';
  import Header from '../components/Header.svelte';
  import Footer  from '../components/Footer.svelte';
  import { _ } from 'svelte-i18n';
  import { defaultSettingsData } from '../js/utils.js';
  import { settingsData } from '../js/store.js';

  export let f7router;

  let wordsLimit = $settingsData.wordsLimit;
  let enableAutoPlaySound = $settingsData.enableAutoPlaySound;
  let swiperTransitionSpeed = $settingsData.swiperTransitionSpeed;
  let advancedUser = $settingsData.advancedUser;
  let enableQuiz = $settingsData.enableQuiz;

  const pronunciations = {
    "uk": $_('settings.pronunciation.uk'),
    "us": $_('settings.pronunciation.us')
  }

  const translatorEngines = {
    "google": $_('settings.translator.google'),
    "microsoft": $_('settings.translator.microsoft')
  }


  function saveAutoPlaySound() {
    $settingsData.enableAutoPlaySound = !$settingsData.enableAutoPlaySound;
    DS.saveSettings($settingsData);
  }

  function saveUserLevel() {
    $settingsData.advancedUser = !$settingsData.advancedUser;
    DS.saveSettings($settingsData);
  }

  function savePronunciation(pronunciation) {
    $settingsData.pronunciation = pronunciation;
    DS.saveSettings($settingsData);
  }

  function saveTranslator(translator) {
    $settingsData.translator = translator;
    DS.saveSettings($settingsData);
  }

  function saveSwiperTransitionSpeed(speed) {
    $settingsData.swiperTransitionSpeed = speed;
    DS.saveSettings($settingsData);
  }

  function saveWordLimit() {
    $settingsData.wordsLimit = wordsLimit;
    DS.saveSettings($settingsData);
  }

  function saveQuiz() {
    $settingsData.enableQuiz = !$settingsData.enableQuiz;
    DS.saveSettings($settingsData);
  }
</script>
