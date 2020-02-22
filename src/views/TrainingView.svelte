<Page name="Training">
  <Navbar title="LearnEnglishWords">
  <Subnavbar> 
    Training Words
  </Subnavbar> 
  </Navbar>              
  <div class="testEl"> 

  <Swiper init navigation={isTraining} params={{speed: 0, allowTouchMove: true, loop: true, followFinger: false}}>
    {#each $trainingData.words as word, id}
      <SwiperSlide>
        <WordDetailSlide {word}/>
      </SwiperSlide>
    {/each}
  </Swiper>


  {#if !isTraining}
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
  </div>

  <Sheet backdrop backdropEl="testEl" swipeToClose opened={sheetOpened} onSheetClosed={() => sheetOpened = false}>
    <br> <br> <br> <br> <br>
      <Row>
        <Col width="25">
        </Col>
        <Col width="50">
          <center>
            Reknete co si myslite ze slovo znamena a tahnete dolu pro zkontrolovani.
            <div class="arrow">&#8964;</div>
          </center>
        </Col>
        <Col width="25">
        </Col>
      </Row>
      <Row>
        <Col width="25">
        </Col>
        <Col width="50">
          <center>
          </center>
        </Col>
        <Col width="25">
        </Col>
      </Row> 
  </Sheet>

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
  import { trainingData } from '../js/store.js';
  import WordDetailSlide from '../components/WordDetailSlide.svelte';
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';

  let isTraining = $trainingData.isTraining;
  let sheetOpened = !isTraining;

  onMount(() => {
    f7.preloader.hide();
  });

  function noButton() {
    sheetOpened = true;
    let swiper = f7.swiper.get('.swiper-container')
    swiper.slideNext();
  }

  function yesButton() {
    sheetOpened = true;
    let swiper = f7.swiper.get('.swiper-container')
    swiper.slideNext();
  }
</script>

<style>
  :root {
    --f7-sheet-height: 70%;
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

