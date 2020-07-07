<Page name="Search">
  <!-- Navbar -->
  <Header {f7router} searchOpened={true} on:search={(e) => search(e.detail.query)} />

  {#if found === false}
    <span class="search-failed">Požadované slovíčko nebylo nalezeno</span>
  {:else if found}
    <div class="word-info">
      <WordReadDetail {word} />
    </div>
  {/if}

  <div class="search-bar">
    <Row noGap>
      <Col class="ripple">
        <SVGIcon element="navigation" name="paper" size="16" />
        <span>Příklady</span>
      </Col>
      <Col class="ripple">
        <SVGIcon element="navigation" name="pen-01" size="16" />
        <span>Upravit</span>
      </Col>
      <Col class="ripple">
        <SVGIcon element="navigation" name="event-confirm" size="16" />
        <span>Uložit</span>
      </Col>
    </Row>
  </div>
</Page>

<script>
  import { Page, Button, Col, Row } from 'framework7-svelte';
  import Header  from '../components/Header.svelte';
  import Footer  from '../components/Footer.svelte';
  import SVGIcon  from '../components/SVGIcon.svelte';
  import WordReadDetail from '../components/word/ReadDetail.svelte';
  import DS from '../js/storages/data.js';
  import { _ } from 'svelte-i18n';
  
  export let f7router;
  export let query;

  let found = null;
  let word = null;
  
  search(query);

  function search(query) {
    if (query === "") { return }
    DS.getWord(query).then((w) => { 
      word = w;
      found = word !== null;
    })
  }
</script>
