{#if mode === "read"}
  <div class="mode-read" on:click="{() => playTextSound(word.text, $settingsData.pronunciation)}">
    <div class="word">{word.text}</div>
    {#if showPronunciation}
      <div class="pronunciation">[ {word.pronunciation[$settingsData.pronunciation]} ]</div>
    {/if}
    {#if $trainingData.isTraining}
      <div class="switch-icon" on:click={switchTrainingModeWall}>
        <SVGIcon name="preview" size="24"/>
      </div>
    {/if}
    <div class="read-icon"> <SVGIcon name="volume" size="24"/> </div>

  </div>
  <WordDetail {word}/>

  {#if ($trainingData.type === LearningMode.EXAM || $trainingData.type === LearningMode.REPETITION)}
    <div class="footer-container footer-double">
      <div class="footer-content">
        <Button class="page-button button-no" on:click={() => clickButton(false)}>{$_('training.question.unknow')}</Button>
        <Button class="page-button button-yes" on:click={() => clickButton(true)}>{$_('training.question.know')}</Button>
      </div>
    </div> 
  {:else if $trainingData.type === LearningMode.FILTER}
    <BlockTitle><center>{$_('training.question.text')}</center></BlockTitle>
    <div class="footer-container footer-double">
      <div class="footer-content">
        <Button class="page-button button-no" on:click={() => clickButton(false)}>{$_('training.question.no')}</Button>
        <Button class="page-button button-slightly" on:click={() => clickButton(null)}>{$_('training.question.slightly')}</Button>
        <Button class="page-button button-yes" on:click={() => clickButton(true)}>{$_('training.question.yes')}</Button>
      </div>
    </div> 
  {/if}

{:else} 
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
  <span class="count-word">{$trainingData.currentWordIndex+1}/{$trainingData.words.length}</span>
  <div class="content-mode">
    <div class="other-div">
      <input bind:value={translatedText} on:keydown={handleKeydown} placeholder="Přeložte do angličtiny" class="translate">
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
{/if}
    
<script>
  import { 
    f7, Block, BlockTitle,
    Row, Col, Button, Link,
    List, ListItem, ListInput
  } from 'framework7-svelte';
	import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import WordDetail from './WordDetail.svelte';
  import SVGIcon from './SVGIcon.svelte';
  import { playTextSound, trainingModes, LearningMode } from '../js/utils.js';
  import { trainingData, settingsData } from '../js/store.js';

  export let word;
  export let mode;
  export let type;
  export let showPronunciation;

  const dispatch = createEventDispatcher();

  let translatedText = "";
  let result = null;
  let placeholder = "";
  let resultColor = "black";

  if (mode === "write") {
    placeholder = $_('training.placeholders.write');
  } else if (mode === "listen") {
    placeholder = $_('training.placeholders.listen');
  }

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

  function clickButton(state) {
    dispatch('updateWord', {word: word, state: state, mode: mode});
    dispatch('nextWord');
  }

  function switchTrainingModeWall() {
    $settingsData.enableTrainingModeWall = !$settingsData.enableTrainingModeWall;
    DS.saveSettings($settingsData);
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
