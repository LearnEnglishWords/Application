<Popup class={name} animate={true} >
  <Page>
    <Header type="popup" popupName={name} {title}/>
    <Block inset>
      <p>
        <List noHairlinesMd>
          <ListInput
            label="Email:"
            type="email"
            placeholder="Email"
            required
            validate
            errorMessage={$_('feedback.wrong_email')}
          />
          <ListInput
            label="{content}:"
            type="textarea"
            placeholder={content}
            maxlength={feedbackLength}
            validate
            errorMessage="{$_('feedback.text_length1')} {feedbackLength} {$_('feedback.text_length2')}"
          />
        </List>
        <Row>
          <Col width=25> </Col>
          <Col width=50>
            <Button fill color="green"> {$_('feedback.send')} </Button>
          </Col>
          <Col width=25> </Col>
        </Row>
      </p>
      <p>
      {$_('feedback.info1')} {feedbackLength} {$_('feedback.info2')}
      <a href='mailto:{email}'>{email}</a>
      </p>
    </Block>
  </Page>
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
  import { feedbackEmail, errorEmail }  from '../js/config.js';
  import { _ } from 'svelte-i18n';
  
  export let name;
  export let feedbackLength = 5000;
  let title;
  let content;
  let email;
  if (name === "feedback") {
    title = $_('feedback.title');
    content = $_('feedback.content');
    email = feedbackEmail;
  } else {
    title = $_('feedback.error_title');
    content = $_('feedback.error_content');
    email = errorEmail;
  }

</script>
