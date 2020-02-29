<Block>
  <center>
    {#if mode==="read"}
      <BlockTitle large>{word.text}</BlockTitle>
      <Block>
        <BlockTitle>[ {word.pronunciation} ]  &#x1F509;</BlockTitle>
      </Block>

      <WordDetail {word}/>
    {:else} 
        <BlockTitle medium> 
          {#if mode==="write"} 
            {#each word.sense as sense}
              {sense} <br/>
            {/each}
          {:else if mode==="listen"} 
            <div on:click={playSound}>
              <h1><b>&#x1F509;</b></h1>
            </div>
          {/if}
        </BlockTitle> 
      <Block>
        <Row>
          <Col width=20>
          </Col>
          <Col width=60>
            <br> <br>
            <input bind:value={translatedText} on:keydown={handleKeydown} id="translate-input" placeholder="{placeholder}">
          </Col>
          <Col width=20>
          </Col>
        </Row>
        <Row>
          <Col width=20>
          </Col>
          <Col width=60>
            <br> <br>
            {#if result === ""}
              <Button large fill on:click={check}> Zkontrolovat </Button>
            {:else}
              <h3> {result} </h3> 
            {/if}
          </Col>
          <Col width=20>
          </Col>
        </Row>
      </Block>
    {/if}
  </center>
</Block>

<script>
  import { 
    f7, Block, BlockTitle,
    Row, Col, Button, Link,
    List, ListInput
  } from 'framework7-svelte';
	import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import WordDetail from './WordDetail.svelte';
  import { statisticsData } from '../js/store.js';

  export let word;
  export let mode;

  const dispatch = createEventDispatcher();

  let translatedText = "";
  let result = "";
  let placeholder = "";

  if (mode === "write") {
    placeholder = "Prelozte do anglictiny";
  } else if (mode === "listen") {
    placeholder = "Napiste co slysite";
  }

  function check() {
    document.querySelector("#translate-input").disabled = true;
    if (translatedText === word.text) {
      result = "Spravne ;-)"
      dispatch('updateWord', {word: word, state: true})
    } else {
      result = "Spatne. Spravna odpoved je: " + word.text
      dispatch('updateWord', {word: word, state: false})
    }
  }

  function handleKeydown(event) {
    if (event.key === "Enter") {
      document.activeElement.blur()
      check();
    }
  }

  function playSound() {
    var audio = new Audio();
    audio.src = `https://drakeman.cz/english-words/collections/basic/sounds/${word.text}.mp3`;
    audio.play();
  }
</script>
