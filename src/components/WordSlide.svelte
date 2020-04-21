   {#if mode==="read"}

<div class="read-mode" on:click="{() => playSound(word)}">
  <div class="read-div">
    <div class="word">{word.text}</div>
    <div class="word_speak">[ {word.pronunciation[$settingsData.pronunciation]} ]</div>
    <SVGIcon name="sound" size="24"/>
</div>
</div>
    <!-- <div class="block-title">{$_('training.sense_title')}</div> -->
    <WordDetail {word}/>

    {:else} 

      <div class="other-mode">
          <div class="other-div word">
          {#if mode==="write"} 
            {#each word.sense as sense, id}
              {sense.toLowerCase()}{#if id + 1 !== word.sense.length},{/if} <br/>
            {/each}
          {:else if mode==="listen"} 
            <div on:click={() => playSound(word)}>
              <h1><b>&#x1F509;</b></h1>
            </div>
          {/if}
      </div>

          
        <div class="footer-training">
        {#if result === ""}
          <Button large fill on:click={check}>{$_('training.buttons.check')}</Button>
        {:else}
          <!--<h3 style="color: {resultColor}"> {result} </h3>-->
          <Button large fill class="button-continue" on:click={() => dispatch('nextWord')}> {$_('training.buttons.continue')} </Button>
        {/if}
        </div>

         
      </div>
              <div class="content-mode">
              <div class="other-div">
          <div class="block-title">Přeložte do angličtiny</div>
          <input bind:value={translatedText} on:keydown={handleKeydown} id="translate-input" class="translate">
          <!-- UPRAVIT -->
          {#if result !== null && !result}
            <div class="result-div wrong">
              <span>{$_('training.results.wrong')}</span>
              <div>{$_('training.results.result_word')}<span>word</span></div>
            </div>
          {:else if result !== null && result}
            <div class="result-div right">
              <span>{$_('training.results.right')}</span>
            </div>
          {/if}
          <!---->
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
  import { statisticsData, settingsData } from '../js/store.js';
  import { playSound } from '../js/utils.js';

  export let word;
  export let mode;

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
    if (translatedText === "") { return }
    if (translatedText.toLowerCase() === word.text.toLowerCase()) {
      result = true;
      dispatch('updateWord', {word: word, state: true});
    } else {
      result = false;
      dispatch('updateWord', {word: word, state: false});
    }
  }

  function handleKeydown(event) {
    if (event.key === "Enter") {
      document.activeElement.disabled = true;
      document.activeElement.blur()
      check();
    }
  }
</script>
