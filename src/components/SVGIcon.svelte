<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width={size} height={size}>
  {@html icons[size][name]}
</svg>

<script>
  export let name = "project";
  export let size = "24";

  const icons = {
    "16": {},
    "24": {
      "project": '<g><polygon points="4 1 23 1 20 7 1 7 4 1"></polygon><polygon points="4 9 23 9 20 15 1 15 4 9"></polygon><polygon points="4 17 23 17 20 23 1 23 4 17"></polygon></g>',
      "nav-left": '<g fill="#4268ff"><polygon fill="#111111" points="15,2 19,6 13,12 19,18 15,22 5,12 "></polygon></g>',
      "nav-right": '<g fill="#4268ff"><polygon fill="#111111" points="9,2 5,6 11,12 5,18 9,22 19,12 "></polygon></g>',
    },
    "32": {},
  }
</script>
