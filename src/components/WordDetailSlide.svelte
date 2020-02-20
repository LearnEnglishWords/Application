<Block>
  <center>
      <BlockTitle large>{word.text}</BlockTitle>
      <Block>
        <BlockTitle>[ {word.pronunciation} ]  &#x1F509;</BlockTitle>
      </Block>

      <Block>
        <Row>
          <Col width="20">
          </Col>
          <Col width="60">
            <List>
              {#each word.sense.slice(0,3) as sense}
                <ListItem link="#" sheetOpen=".example-sheet"> {sense} </ListItem>
              {/each}
            </List>
          </Col>
          <Col width="10">
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
  </center>
</Block>

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
  import { _ } from 'svelte-i18n';

  export let word = [];
  let sheetOpened = false;
</script>
