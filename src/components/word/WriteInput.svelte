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
        {#if translatedText.length === 0 && $trainingData.isTraining}
          <div class="result-div wrong">
            <div>{$_('training.results.result_word')} <br/> {word.text} </div>
          </div>
        {:else}
          <div class="result-div wrong">
            <span class="result">{$_('training.results.wrong')}</span>
            <div>{$_('training.results.result_word')}
              <span class="this-word">{word.text}</span>
            </div>
          </div>
        {/if}
      {:else if result}
        <div class="result-div right">
          <span class="result">{$_('training.results.right')}</span>
        </div>
      {/if}
    {/if}
  </div>
</div>

{#if !isChecked}
  <div class="footer-container footer-singular arrows">
    <div class="footer-content arrows">
      <Button class="page-button button-examples" on:click={checkButton}>
        {translatedText.length === 0 && $trainingData.isTraining ? $_('training.buttons.unknown') : $_('training.buttons.check')}
      </Button>
    </div>
  </div>
{/if}


<script>
  import { Button } from 'framework7-svelte';
  import SVGIcon from '../SVGIcon.svelte';
  import { _ } from 'svelte-i18n';
  import { createEventDispatcher } from 'svelte';
  import { playTextSound } from '../../js/utils.js';
  import { trainingData, settingsData } from '../../js/store.js';

  export let word;
  export let mode;
  export let isChecked;

  const dispatch = createEventDispatcher();

  let translatedText = "";
  let result = null;

  function check(text) {
    setTimeout(() => { 
      result = text.toLowerCase() === word.text.toLowerCase();
      isChecked = true;
      dispatch('check', { isRight: result });
    }, 200);
  }

  function checkButton() {
    document.activeElement.disabled = true;
    check(translatedText);
  }

  function handleKeydown(event) {
    if (event.key === "Enter") {
      document.activeElement.disabled = true;
      document.activeElement.blur()
      check(translatedText);
    }
  }
</script>
