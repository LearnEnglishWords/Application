<Page name="Training">
  <Navbar title="LearnEnglishWords">
  <Subnavbar> 
    Training Words
  </Subnavbar> 
  </Navbar>              

  <Swiper init navigation={isTraining} params={{speed: 0, allowTouchMove: true, loop: false, followFinger: false}}>
    {#each $trainingData.words as word, id}
      <SwiperSlide style="height: {swiperHeight}">
        <WordSlide {word} on:nextWord={nextWord} on:updateWord={(e) => updateWord(e.detail)} mode="{$trainingData.mode}"/>
      </SwiperSlide>
    {/each}
  </Swiper>


  {#if !isTraining && $trainingData.mode === "read"}
    <BlockTitle><center>Uz umis dane slovicko?</center></BlockTitle>
    <Row>
      <Col width="25">
      </Col>
      <Col width="25">
        <Button large fill color="red" on:click={noButton}>Ne</Button>
      </Col>
      <Col width="25">
        <Button large fill color="green" on:click={yesButton}>Ano</Button>
      </Col>
      <Col width="25">
      </Col>
    </Row> 
  {/if}

  {#if $trainingData.mode === "read"}
    <Sheet backdrop={false} swipeToClose opened={wallEnable} onSheetClosed={() => wallEnable = false}>
      <Row>
        <Col width="25">
        </Col>
        <Col width="50">
          <center>
            <div class="arrow">&#8964;</div> <br>
            Reknete co si myslite ze slovo znamena a tahnete dolu pro zkontrolovani.
          </center>
        </Col>
        <Col width="25">
        </Col>
      </Row>
    </Sheet>
  {/if}

</Page>

<script>
  import { 
    f7, Page, PageContent, 
    Block, BlockTitle, BlockHeader, 
    Navbar, Subnavbar,
    Swiper, SwiperSlide,
    List, ListItem, AccordionContent,
    Row, Col, Button, Link,
    Sheet, Toolbar, Popup
  } from 'framework7-svelte';
  import { trainingData, statisticsData } from '../js/store.js';
  import WordSlide from '../components/WordSlide.svelte';
  import Collection from '../js/collection.js';
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';

  let collection = new Collection();
  let isTraining = $trainingData.isTraining;
  let wallEnable = !isTraining;
  let currentWordIndex = 0;
  let swiperHeight = "80vh";

  if ($trainingData.mode === "read" && !$trainingData.isTraining) {
    swiperHeight = "62vh";
  }

  onMount(() => {
    f7.preloader.hide();
  });

  function noButton() {
    let currentWord = $trainingData.words[currentWordIndex];
    updateWord({word: currentWord, state: false});
    nextWord();
  }

  function yesButton() {
    let currentWord = $trainingData.words[currentWordIndex];
    updateWord({word: currentWord, state: true});
    nextWord();
  }

  function updateWord({word, state}) {
    if ($trainingData.isTraining) { return }
    if (word.learning === undefined) { 
      word.learning = {"read": false, "write": false, "listen": false}
    }

    let previousState = statisticsData.getState(word);
    if (word.learning[$trainingData.mode] !== state) {
      word.learning[$trainingData.mode] = state;
      collection.saveWord(word.text, word);
      statisticsData.updateData(word, previousState);
    }
  }

  function nextWord() {
    currentWordIndex += 1;
    wallEnable = true;
    let swiper = f7.swiper.get('.swiper-container')
    swiper.slideNext();
  }
</script>

<style>
  :root {
    --f7-sheet-height: 70vh;
    --f7-sheet-border-color: var(--f7-theme-color);
    --f7-sheet-transition-duration: 300ms;
    --f7-sheet-push-border-radius: 10px;
    --f7-sheet-push-offset: var(--f7-safe-area-top);
    --f7-sheet-bg-color: #1AA9D9;
  }
  .arrow {
    font-size: 100px;
  }
</style>
