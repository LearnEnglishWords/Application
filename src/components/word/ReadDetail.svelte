<!-- Word window -->
<ReadWord {word} {showPronunciation} {enableWallButton} />

<!-- Counter -->
<div class="page-title">{$_('training.sense_title')}
  {#if learnType !== LearningMode.SEARCH}
    <span>{$trainingData.currentWordIndex+1}/{$trainingData.words.length}</span>
  {/if}
</div>

<!-- Middle window -->
<SenseList {word} edit={editWord}/>

<!-- Bottom control panel -->
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
  {#if !editWord}
    <div class="search-bar">
      <Row noGap>
        <Col class="ripple" on:click={() => openedExamples = true}>
          <SVGIcon element="navigation" name="paper" size="16" />
          <span>{$_('search.buttons.examples')}</span>
        </Col>
        <Col class="ripple" on:click={() => editWord = true}>
          <SVGIcon element="navigation" name="pen-01" size="16" />
          <span>{$_('search.buttons.edit')}</span>
        </Col>
        <Col class="ripple" on:click={saveWord}>
          <SVGIcon element="navigation" name="event-confirm" size="16" />
          <span>{$_('search.buttons.save')}</span>
        </Col>
      </Row>
    </div>
  {:else}
    <div class="footer-container footer-double">
      <div class="footer-content">
        <Button class="page-button button-examples button-outline" on:click={cancelEditWord}>{$_('buttons.cancel')}</Button>
        <Button class="page-button button-examples" on:click={finishEditWord}>{$_('buttons.done')}</Button>
      </div>
    </div>
  {/if}

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
  import DS from '../../js/storages/data.js';
  import SVGIcon from '../SVGIcon.svelte';
  import SenseList from './SenseList.svelte';
  import ReadWord from './ReadWord.svelte';
  import WordDescriptionPopup from '../../popups/WordDescriptionPopup.svelte';
  import { playTextSound, LearningMode } from '../../js/utils.js';
  import { trainingData, statisticsData } from '../../js/store.js';

  export let word;
  export let mode;
  export let learnType;
  export let showPronunciation = true;
  export let enableWallButton = false;

  const dispatch = createEventDispatcher();

  let openedExamples = false;
  let editWord = false;

  function getWord() {
    if (learnType === LearningMode.SEARCH) {
      return word;
    } else {
      return $trainingData.words[$trainingData.currentWordIndex];
    }
  }

  function clickButton(state) {
    dispatch('updateWord', { word: getWord(), state: state, mode: mode });
    dispatch('nextWord');
  }
  
  function saveWord() {
    dispatch('saveWord', { word: getWord() });
  }

  function finishEditWord() {
    editWord = false;
    word.sense = word.sense.filter((s) => { return s !== ""});
    DS.saveWord(word.text, word);
  }                                                                        

  function cancelEditWord() {
    editWord = false; 
    dispatch('cancelEdit');
  }
</script>
