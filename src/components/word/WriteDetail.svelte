<!-- Word window -->
{#if showSense}
  <ReadWord {word} />
{:else}
  <div class="other-mode">
    <div class="other-div word">
      {#if mode === "write"} 
        {#each word.sense.slice(0,4) as sense, id}
          {sense.toLowerCase()}{#if id + 1 !== word.sense.length},{/if} <br/>
        {/each}
      {:else if mode === "listen"} 
        <div class="read-mode" on:click={() => playTextSound(word.text, $settingsData.pronunciation)}>
          <div class="read-title">{$_('training.listen_title')}</div>
          <SVGIcon name="volume" size="24"/>
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- Counter -->
<div class="page-title">
  {showSense ? $_('training.sense_title') : ""}
  <span>{$trainingData.currentWordIndex+1}/{$trainingData.words.length}</span>
</div>

<!-- Middle window -->
{#if showSense}
  <SenseList {word} />
{:else}
  {#if $settingsData.enableQuiz && mode === "write" && learnType === LearningMode.TRAINING}
    <SelectInput {word} wordList={[...$categoryDetailData.wordStorages[WordsType.ALL].allWordIds]} bind:isChecked={isChecked} on:check={(e) => dispatch('updateWord', {word: word, state: e.detail.isRight, mode: mode})}/>
  {:else}
    <WriteInput {word} {mode} bind:isChecked={isChecked} on:check={(e) => dispatch('updateWord', {word: word, state: e.detail.isRight, mode: mode})}/>
  {/if}
{/if}
    
<!-- Bottom control panel -->
{#if isChecked}
  <div class="footer-container {!showSense && mode === "listen" ? "footer-double" : "footer-singular"} arrows">
    <div class="footer-content arrows">
      {#if !showSense && mode === "listen"}
        <Button class="page-button button-examples button-outline" on:click={() => { showSense = true; autoPlaySound() } }> {$_('training.buttons.show_sense')} </Button>
      {/if}
      <Button class="page-button button-examples" on:click={() => dispatch('nextWord')}>{$_('training.buttons.continue')}</Button>
    </div>
  </div>
{/if}

<script>
  import { Button } from 'framework7-svelte';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import SVGIcon from '../SVGIcon.svelte';
  import SenseList from './SenseList.svelte';
  import ReadWord from './ReadWord.svelte';
  import WriteInput from './WriteInput.svelte';
  import SelectInput from './SelectInput.svelte';
  import { playTextSound, LearningMode, WordsType } from '../../js/utils.js';
  import { trainingData, categoryDetailData, settingsData } from '../../js/store.js';

  export let word;
  export let mode;
  export let learnType;

  const dispatch = createEventDispatcher();

  let showSense = false;
  let isChecked = false;

  function autoPlaySound() {
    if ($settingsData.enableAutoPlaySound) {
      playTextSound(word.text, $settingsData.pronunciation);
    }
  }
</script>
