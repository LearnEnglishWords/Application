<div class="content-mode">
  <div class="other-div">
    {#if result === null}
      {#each selectList as wordText, id}
        <Button class="button-select" on:click={() => selectWord(wordText)}> {wordText.toLowerCase()} </Button>
      {/each}
    {:else}
      <div class="volume-block" on:click={() => playTextSound(word.text, $settingsData.pronunciation)}>
        <SVGIcon name="volume" size="24"/>
      </div>
      <div class="result-div {result ? 'right' : 'wrong'}">
        <span class="result">{$_(`training.results.${result ? 'right' : 'wrong'}`)}</span>
        <div>{$_('training.results.result_word')}
          <span class="this-word">{word.text.toLowerCase()}</span>
        </div>
      </div>
    {/if}
  </div>
</div>


<script>
  import { Button } from 'framework7-svelte';
  import SVGIcon from '../SVGIcon.svelte';
  import { trainingData, settingsData } from '../../js/store.js';
  import { shuffle, playTextSound } from '../../js/utils.js';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  export let word;
  export let isChecked;
  export let wordList;

  const dispatch = createEventDispatcher();

  let selectList = [];
  let result = null;

  for (let i = 1; i <= 3; i++) { 
    let randomIndex = Math.floor(Math.random() * wordList.length);
    selectList.push(wordList[randomIndex]);
    wordList.splice(randomIndex, 1);
  }
  selectList.push(word.text);

  shuffle(selectList);

  function selectWord(wordText) {
    result = wordText.toLowerCase() === word.text.toLowerCase();
    isChecked = true;
    dispatch('check', { isRight: result });         
    if ($settingsData.enableAutoPlaySound) {
      playTextSound(word.text, $settingsData.pronunciation);
    }
  }
</script>
