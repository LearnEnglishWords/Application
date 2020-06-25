<Page name="CategoryEdit">
  <!-- Navbar -->
  <Header>
    <div class="navbar-title title" slot="title">{$_('app_name')}</div>
  </Header>
  <!-- Header -->
  <div class="header statistics empty"></div>
  <div class="view Settings">
    <Button> Změnit název </Button>
    <Button> Odstranit kategorii </Button>
    <Button> Přidat slovíčka </Button>
    <Footer />
  </div>
</Page>

<script>
  import { Page, Button } from 'framework7-svelte';
  import DS from '../js/storages/data.js';
  import Header from '../components/Header.svelte';
  import Footer  from '../components/Footer.svelte';
  import { _ } from 'svelte-i18n';

</script>
