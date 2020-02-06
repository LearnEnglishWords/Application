<Page name="CategoryList">
  <Navbar title="LearnEnglishWords">
  </Navbar>              

  <Block strong inset>
    <BlockTitle medium>Vyberte si kategorii:</BlockTitle>
    <List>
      {#each categoryItems as {name, wordsNum}, id}
        <ListItem text="" link="#">
          <h3>{name}</h3>
          <p>
            <Chip text="{wordsNum}" color="red" />
            <Chip text="0" color="orange" />      
            <Chip text="0" color="green" />
          </p>
        </ListItem>
      {/each}
    </List>
  </Block>
</Page>

<script>
  import { 
    Page, 
    Chip, 
    Block, 
    BlockTitle, 
    Navbar,
    Subnavbar,
    Link,
    List,
    ListItem
  } from 'framework7-svelte';

  let categoryItems = [
    {name: "Family", wordsNum: 30},
    {name: "Colors", wordsNum: 20},
    {name: "Numbers", wordsNum: 35},
    {name: "Furniture", wordsNum: 70},
    {name: "Food", wordsNum: 150},
    {name: "Animals", wordsNum: 60},
    {name: "Traveling", wordsNum: 300},
    {name: "Health", wordsNum: 163},
    {name: "Body", wordsNum: 30}
  ];

</script>

