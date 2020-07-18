<div class="other-mode">
  <div class="other-div word">
    {#if mode==="write"} 
      {#each word.sense as sense, id}
        {sense.toLowerCase()}{#if id + 1 !== word.sense.length},{/if} <br/>
      {/each}
    {:else if mode==="listen"} 
      <div class="read-mode" on:click={() => playTextSound(word.text, $settingsData.pronunciation)}>
        <div class="read-title">{$_('training.listen_title')}</div>
        <SVGIcon name="volume" size="24"/>
      </div>
    {/if}
  </div>
  <div class="footer-container footer-singular arrows">
    <div class="footer-content arrows">
      {#if result === null}
        <Button class="page-button button-examples" on:click={checkButton}>{$_('training.buttons.check')}</Button>
      {:else}
        <Button class="page-button button-examples" on:click={() => dispatch('nextWord')}>{$_('training.buttons.continue')}</Button>
      {/if}
    </div>
  </div>
</div>

<div class="page-title">
  <span>{$trainingData.currentWordIndex+1}/{$trainingData.words.length}</span>
</div>

<div class="content-mode">
  <div class="other-div">
    <input bind:value={translatedText} on:keydown={handleKeydown} autocomplete="off" placeholder="{$_(`training.placeholders.${mode}`)}" class="translate">
    {#if result !== null}
      {#if mode === "write"}
        <div class="volume-block" on:click={() => playTextSound(word.text, $settingsData.pronunciation)}>
          <SVGIcon name="volume" size="24"/>
        </div>
      {/if}
      {#if !result}
        <div class="result-div wrong">
          <span class="result">{$_('training.results.wrong')}</span>
          <div>{$_('training.results.result_word')}
            <span class="this-word">{word.text}</span>
          </div>
        </div>
      {:else if result}
        <div class="result-div right">
          <span class="result">{$_('training.results.right')}</span>
        </div>
      {/if}
    {/if}
  </div>
</div>
    

<script>
  import { Button } from 'framework7-svelte';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import SVGIcon from '../SVGIcon.svelte';
  import { playTextSound, LearningMode } from '../../js/utils.js';
  import { trainingData, statisticsData, settingsData } from '../../js/store.js';

  export let word;
  export let mode;

  const dispatch = createEventDispatcher();

  let translatedText = "";
  let result = null;

  function check() {
    setTimeout(() => { 
      if (translatedText.toLowerCase() === word.text.toLowerCase()) {
        result = true;
        dispatch('updateWord', {word: word, state: true, mode: mode});
      } else {
        result = false;
        dispatch('updateWord', {word: word, state: false, mode: mode});
      }
    }, 200);
  }

  function checkButton() {
    document.activeElement.disabled = true;
    check();
  }

  function handleKeydown(event) {
    if (event.key === "Enter") {
      document.activeElement.disabled = true;
      document.activeElement.blur()
      check();
    }
  }
</script>
