<Popup class={name} animate={true} >
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
          errorMessage="Nespravny format emailove adresy."
        />
        <ListInput
          label="{content}:"
          type="textarea"
          placeholder={content}
          maxlength={feedbackLength}
          validate
          errorMessage="Delka zpravy musi byt maximalne {feedbackLength} slov."
        />
      </List>
      <Row>
        <Col width=25> </Col>
        <Col width=50>
          <Button fill color="green"> Odeslat </Button>
        </Col>
        <Col width=25> </Col>
      </Row>
    </p>
    <p>
    Pokud je vase zpetna vazba delsi jak {feedbackLength} slov, tak ji muzete poslat na email:
    <a href='mailto:feedback@learnenglishwords.com'>feedback@learnenglishwords.com</a>
    </p>
  </Block>
</Popup>

<script>
  import {
    Navbar, NavRight, Link,
    Popup, Icon, Button,
    List, ListInput,
    Row, Col, Block
  } from 'framework7-svelte';
  import Header  from './Header.svelte';
  
  export let name;
  export let feedbackLength = 5000;
  let title;
  let content;
  if (name === "feedback") {
    title = "Zpetna vazba";
    content = "Zpetna vazba";
  } else {
    title = "Hlaseni chyb";
    content = "Informace o chybe";
  }

</script>
