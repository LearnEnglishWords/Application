<!-- Word window -->
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

{#if learnType !== LearningMode.SEARCH}
  <Counter />
{/if}

<!-- Sense -->
<List class="list-container list-categories">
  {#each word.sense.slice(0,4) as sense, id}
    <ListItem class="list-item" title={sense.toLowerCase()}>
      <div slot="media" class="item-media">
        <SVGIcon name="translation" size="24" />
      </div>
    </ListItem>
  {/each}
</List>

<!-- Bottom panel -->
{#if (learnType === LearningMode.EXAM || learnType === LearningMode.REPETITION)}
  <div class="footer-container footer-double">
    <div class="footer-content">
      <Button class="page-button button-no" on:click={() => clickButton(false)}>{$_('training.question.unknow')}</Button>
      <Button class="page-button button-yes" on:click={() => clickButton(true)}>{$_('training.question.know')}</Button>
    </div>
  </div> 
{:else if learnType === LearningMode.FILTER}
  <div class="footer-container footer-triple">
    <span>{$_('training.question.text')}</span>
    <div class="footer-content">
      <Button class="page-button button-no" on:click={() => clickButton(false)}>{$_('training.question.no')}</Button>
      <Button class="page-button button-slightly" on:click={() => clickButton(null)}>{$_('training.question.slightly')}</Button>
      <Button class="page-button button-yes" on:click={() => clickButton(true)}>{$_('training.question.yes')}</Button>
    </div>
  </div> 
{:else if learnType === LearningMode.SEARCH}
  <div class="search-bar">
    <Row noGap>
      <Col class="ripple" on:click={() => openedExamples = true}>
        <SVGIcon element="navigation" name="paper" size="16" />
        <span>{$_('search.buttons.examples')}</span>
      </Col>
      <Col class="ripple">
        <SVGIcon element="navigation" name="pen-01" size="16" />
        <span>{$_('search.buttons.edit')}</span>
      </Col>
      <Col class="ripple" on:click={() => dispatch('saveWord', { word: word })}>
        <SVGIcon element="navigation" name="event-confirm" size="16" />
        <span>{$_('search.buttons.save')}</span>
      </Col>
    </Row>
  </div>
  <WordDescriptionPopup {word} popupName="examples" bind:opened={openedExamples} />
{/if}
    

<script>
  import { 
    f7, Button, 
    List, ListItem,
    Row, Col
  } from 'framework7-svelte';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import SVGIcon from '../SVGIcon.svelte';
  import Counter from './Counter.svelte';
  import WordDescriptionPopup from '../../popups/WordDescriptionPopup.svelte';
  import { playTextSound, LearningMode } from '../../js/utils.js';
  import { settingsData } from '../../js/store.js';

  export let word;
  export let mode;
  export let learnType;
  export let showPronunciation = true;
  export let enableWallButton = false;

  const dispatch = createEventDispatcher();

  let openedExamples = false;


  function clickButton(state) {
    dispatch('updateWord', { word: word, state: state, mode: mode });
    dispatch('nextWord');
  }

  function switchTrainingModeWall() {
    $settingsData.enableTrainingModeWall = !$settingsData.enableTrainingModeWall;
    DS.saveSettings($settingsData);
  }
</script>
