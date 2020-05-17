<Popup class={name} animate={true}>
  <Header type="popup" popupName={name} title={$_('app_name')} />
    <div class="page-title">{$_('about.title')}</div>
    <div class="popup-content">
      <div class="row">
        <div class="col">{appName} {$_('about.text1')}</div>
        <div class="col">{$_('about.text2')}</div>
        <div class="col">{$_('about.text3')}</div>
        <div class="col">{$_('about.text4')}</div>
        <div class="col">{$_('about.email_feedback')}</div>
        <div class="col">
          <center>
          <a href='mailto:{feedbackEmail}'>{feedbackEmail}</a>
          </center>
        </div>
        <!--
        <div class="col">
          <a href=#>{$_('about.share')}</a>
        </div>
        -->
      </div>
    </div>  
    <Footer />
</Popup>

<script>
  import {
    Page,
    Navbar, NavRight, Link,
    Block, Popup, Icon
  } from 'framework7-svelte';
  import Header  from '../components/Header.svelte';
  import Footer  from '../components/Footer.svelte';
  import SVGIcon  from '../components/SVGIcon.svelte';
  import { feedbackEmail, version, appName }  from '../js/config.js';
  import { _ } from 'svelte-i18n';
  
  export let name;
</script>
