<Popup class={name} animate={true} >
  <Header type="popup" popupName={name} title={$_('app_name')} />
    <div class="page-title">{title}</div>
    <div class="popup-content">
      <div class="list feedback">
        <ul>
          <li class="item-content item-input">
            <div class="item-inner">
              <div class="item-input-wrap">
                <input type="text" placeholder={$_('feedback.email_placeholder')}>
                <span class="input-clear-button"></span>
              </div>
            </div>
          </li>
          <li class="item-content item-input">
            <div class="item-inner">
              <div class="item-input-wrap">
                <textarea placeholder={$_('feedback.text_placeholder')}></textarea>
                <span class="input-clear-button"></span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="text-random">     
        {$_('feedback.info1')} {feedbackLength} {$_('feedback.info2')}
        <a href='mailto:{email}'>{email}</a>
      </div>
    </div> 
    <!-- Footer -->
    <div class="footer-container footer-singular">
      <div class="footer-content">
        <Button class="page-button button-next">{$_('feedback.send')}</Button>
      </div>
    </div>
</Popup>

<script>
  import {
    Page,
    Navbar, NavRight, Link,
    Popup, Icon, Button,
    List, ListInput,
    Row, Col, Block
  } from 'framework7-svelte';
  import Header  from '../components/Header.svelte';
  import SVGIcon  from '../components/SVGIcon.svelte';
  import { feedbackEmail, errorEmail }  from '../js/config.js';
  import { _ } from 'svelte-i18n';
  
  export let name;
  export let feedbackLength = 5000;
  let title;
  let content;
  let email;
  if (name === "info-feedback") {
    title = $_('feedback.title');
    content = $_('feedback.content');
    email = feedbackEmail;
  } else {
    title = $_('feedback.error_title');
    content = $_('feedback.error_content');
    email = errorEmail;
  }

</script>
