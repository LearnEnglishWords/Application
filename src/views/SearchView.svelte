<Page name="Search">
  <!-- Navbar -->
  <Header {f7router} searchOpened={true} />

  {#await search(query)}
    <span class="search-failed">Probíhá vyhledávání..</span>
  {:then word}
    <WordReadDetail {word} />
    <div class="search-bar">
      <Row noGap>
        <Col class="ripple">
          <SVGIcon element="navigation" name="paper" size="16" />
          <span>{$_('search.buttons.examples')}</span>
        </Col>
        <Col class="ripple">
          <SVGIcon element="navigation" name="pen-01" size="16" />
          <span>{$_('search.buttons.edit')}</span>
        </Col>
        <Col class="ripple">
          <SVGIcon element="navigation" name="event-confirm" size="16" />
          <span>{$_('search.buttons.save')}</span>
        </Col>
      </Row>
    </div>
  {:catch error}
    <span class="search-failed">{$_('search.not_found')}</span>
  {/await}
</Page>

<script>
  import { Page, Button, Col, Row } from 'framework7-svelte';
  import Header  from '../components/Header.svelte';
  import Footer  from '../components/Footer.svelte';
  import SVGIcon  from '../components/SVGIcon.svelte';
  import WordReadDetail from '../components/word/ReadDetail.svelte';
  import DS from '../js/storages/data.js';
  import { backendApiUrl } from '../js/config.js'
  import { _ } from 'svelte-i18n';
  
  export let f7router;
  export let query;


  async function searchOnline(query) {
    const res = await fetch(`${backendApiUrl}/word/find?text=${query.replace(' ', '-')}`);
    let result = await res.json();
    return result.payload === undefined ? null : result.payload
  }

  function search(query) {
    return new Promise((success, error) => {
      if (query === "") { error() }
      DS.getWord(query).then((w) => { 
        w === null ? searchOnline(query).then((w) => { w === null ? error() : success(w) }) : success(w);
      });
    });
  }
</script>
