<Popup class={name} animate={true}>
  <Header type="popup" popupName={name} title={$_('app_name')} />
  <div class="popup-container">
    <div class="popup-header">
      <div class="page-title">{$_('about.title')}</div>
    </div>
    <div class="popup-content">
      <div class="row">
        <div class="col">{appName} {$_('about.text1')}</div>
        <div class="col">{$_('about.text2')}</div>
        <div class="col">{$_('about.text3')}</div>
        <div class="col">{$_('about.text4')}</div>
        <div class="col">{$_('about.email_feedback')}
          <a href='mailto:{feedbackEmail}'>{feedbackEmail}</a>
        </div>
        <div class="col"><a href=#>{$_('about.share')}</a></div>
      </div>
    </div>  
    <div class="footer-popup">
        <span>{$_('about.version')} {version}</span>
        <span>Copyright &copy; Learn English Words 2020</span>
      </div>
  </div>




  <Page style="display:none">
    <Header type="popup" popupName={name} title={$_('about.title')}/>
    <Block inset>
      <p>
        {appName} {$_('about.text1')}
      </p>
      <p>
        {$_('about.text2')}
      </p>
      <p>
        {$_('about.text3')}
      </p>
      <p>
        {$_('about.text4')}
      </p>

      <p>
        {$_('about.email_feedback')}
      <a href='mailto:{feedbackEmail}'>{feedbackEmail}</a>
      </p>
      <p>
      <a href=#>{$_('about.share')}</a>
      </p>

      <center>
        {$_('about.version')} {version} <br/>
        Copyright &copy; Learn English Words 2020
      </center>
    </Block>
  </Page>
</Popup>

<script>
  import {
    Page,
    Navbar, NavRight, Link,
    Block, Popup, Icon
  } from 'framework7-svelte';
  import Header  from '../components/Header.svelte';
  import SVGIcon  from '../components/SVGIcon.svelte';
  import { feedbackEmail, version, appName }  from '../js/config.js';
  import { _ } from 'svelte-i18n';
  
  export let name;
</script>
