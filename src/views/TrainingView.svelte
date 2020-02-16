<Page name="Training">
  <Navbar title="LearnEnglishWords">
  <Subnavbar> 
    Training Words
  </Subnavbar> 
  </Navbar>              
  <Toolbar position='bottom'>
    <Link on:click={prevWord}>Previous word</Link>
    <Link on:click={nextWord}>Next word</Link>
  </Toolbar>

  <Swiper init navigation params={{speed: 0, allowTouchMove: true, loop: true, followFinger: false}}>
    {#each $trainingData.words as word, id}
      <SwiperSlide>
        <Block>
          <center>

            <BlockTitle large>{word.text}</BlockTitle>
            <Block>
              <BlockHeader>[ {word.pronunciation} ]  &#x1F509;</BlockHeader>
            </Block>

            <Block>
              <Row>
                <Col width="20">
                </Col>
                <Col width="60">
                  <List>
                    {#each word.sense as sense}
                      <ListItem link="#" sheetOpen=".example-sheet"> {sense} </ListItem>
                    {/each}
                  </List>
                </Col>
                <Col width="20">
                </Col>
              </Row>
            </Block>

            <Sheet class="example-sheet" opened={sheetOpened} onSheetClosed={() => sheetOpened = false}>
              <Toolbar>
                <div class="left"></div>
                <div class="right">
                  <Link sheetClose>Close</Link>
                </div>
              </Toolbar>
              <!--  Scrollable sheet content -->
              <PageContent>
                <Block>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae ducimus dolorum ipsa aliquid accusamus perferendis laboriosam delectus numquam minima animi, libero illo in tempora harum sequi corporis alias ex adipisci.</p>
                  <p>Sunt magni enim saepe quasi aspernatur delectus consectetur fugiat necessitatibus qui sed, similique quis facere tempora, laudantium quae expedita ea, aperiam dolores. Aut deserunt soluta alias magnam. Consequatur, nisi, enim.</p>
                  <p>Eaque maiores ducimus, impedit unde culpa qui, explicabo accusamus, non vero corporis voluptatibus similique odit ab. Quaerat quasi consectetur quidem libero? Repudiandae adipisci vel voluptatum, autem libero minus dignissimos repellat.</p>
                  <p>Iusto, est corrupti! Totam minus voluptas natus esse possimus nobis, delectus veniam expedita sapiente ut cum reprehenderit aliquid odio amet praesentium vero temporibus obcaecati beatae aspernatur incidunt, perferendis voluptates doloribus?</p>
                  <p>Illum id laborum tempore, doloribus culpa labore ex iusto odit. Quibusdam consequuntur totam nam obcaecati, enim cumque nobis, accusamus, quos voluptates, voluptatibus sapiente repellendus nesciunt praesentium velit ipsa illo iusto.</p>
                </Block>
              </PageContent>
            </Sheet>

            <BlockTitle >Uz umis dane slovicko?</BlockTitle>
            <Row>
              <Col width="25">
              </Col>
              <Col width="25">
                <Button large fill color="red" on:click={prevWord}>Ne</Button>
              </Col>
              <Col width="25">
                <Button large fill color="green" on:click={nextWord}>Ano</Button>
              </Col>
              <Col width="25">
              </Col>
            </Row>

          <center>
        </Block>
      </SwiperSlide>
    {/each}
  </Swiper>

</Page>

<script>
  import { 
    f7, Page, PageContent, 
    Block, BlockTitle, BlockHeader, 
    Navbar, Subnavbar,
    Swiper, SwiperSlide,
    List, ListItem, AccordionContent,
    Row, Col, Button, Link,
    Sheet, Toolbar
  } from 'framework7-svelte';
  import { trainingData } from '../js/store.js';
  import { _ } from 'svelte-i18n';

  let sheetOpened = false;

  function nextWord() {
    let swiper = f7.swiper.get('.swiper-container')
    swiper.slideNext();
  }
  function prevWord() {
    let swiper = f7.swiper.get('.swiper-container')
    swiper.slidePrev();
  }
</script>

<style>
</style>

