<div class="mode-read" on:click="{() => playTextSound(word.text, $settingsData.pronunciation)}">
  <div class="word">{word.text}</div>
  {#if showPronunciation}
    <div class="pronunciation">[ {word.pronunciation[$settingsData.pronunciation]} ]</div>
  {/if}
  {#if enableWallButton}
    <div class="switch-icon" on:click={switchTrainingModeWall}>
      <SVGIcon name="preview" size="24"/>
    </div>
  {/if}
  <div class="read-icon"> <SVGIcon name="volume" size="24"/> </div>
</div>

<script>
  import SVGIcon from '../SVGIcon.svelte';
  import { playTextSound } from '../../js/utils.js';
  import { settingsData } from '../../js/store.js';
  import DS from '../../js/storages/data.js';

  export let word;
  export let showPronunciation = true;
  export let enableWallButton = false;

  function switchTrainingModeWall() {
    $settingsData.enableTrainingModeWall = !$settingsData.enableTrainingModeWall;
    DS.saveSettings($settingsData);
  }
</script>
