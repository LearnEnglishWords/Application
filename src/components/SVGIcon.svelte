<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {size} {size}" width={size} height={size} data-name="{name}">
  {@html icons[size][name]}
</svg>

<script>
  export let name = null;
  export let size = null;

  const icons = {
    "12": {},
    "16": {},
    "24": {
      "translation": '<g stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" fill="#111111" stroke="#111111"><path d="M13,6V2.773A1.773,1.773,0,0,0,11.227,1H2.773A1.773,1.773,0,0,0,1,2.773v7.454A1.773,1.773,0,0,0,2.773,12H3v2l3-2H8" fill="none" stroke-miterlimit="10"></path><path d="M21.286,9H12.714A1.777,1.777,0,0,0,11,10.833v7.334A1.777,1.777,0,0,0,12.714,20H18l3,2V20h.286A1.777,1.777,0,0,0,23,18.167V10.833A1.777,1.777,0,0,0,21.286,9Z" fill="none" stroke="#111111" stroke-miterlimit="10"></path><path d="M10.287,5.113c-.308-.028-.581-.042-1-.042a5.525,5.525,0,0,1-.476,1.352,5.162,5.162,0,0,1-.777,1.134,6.742,6.742,0,0,0,2.4.848,4.493,4.493,0,0,0-.693,1.288A8.641,8.641,0,0,1,7.079,8.418a8.993,8.993,0,0,1-2.787,1.29,4.065,4.065,0,0,0-.673-1.24A7.639,7.639,0,0,0,6.105,7.55a6.126,6.126,0,0,1-.9-1.281,6.185,6.185,0,0,1-.483-1.2c-.413,0-.652.014-1,.042V3.845a8.644,8.644,0,0,0,1.016.049H6.28v-.42a2.056,2.056,0,0,0-.042-.434H7.646a2.155,2.155,0,0,0-.042.427v.427H9.271a8.576,8.576,0,0,0,1.016-.049ZM6.063,5.071a4.006,4.006,0,0,0,.981,1.7,3.96,3.96,0,0,0,.875-1.7Z" data-stroke="none" stroke="none" stroke-linecap="butt"></path><path d="M18.369,17.451l-.317-1.2H15.965l-.325,1.2H13.733L15.829,11h2.316l2.122,6.451Zm-.677-2.628-.277-1.054q-.1-.352-.235-.91t-.182-.8c-.027.149-.079.4-.156.738s-.25,1.018-.517,2.026Z" fill="#111111" data-stroke="none" stroke="none" stroke-linecap="butt"></path></g>',
      "left-arrow": '<g stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" fill="#111111" stroke="#111111"><polyline fill="none" stroke="#111111" stroke-miterlimit="10" points="17,2 7,12 17,22" transform="translate(0, 0)"></polyline></g>',
      "right-arrow": '<g stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" fill="#111111" stroke="#111111"><polyline fill="none" stroke="#111111" stroke-miterlimit="10" points="7,2 17,12 7,22" transform="translate(0, 0)"></polyline></g>',
      "sound": '<g stroke-width="2" transform="translate(0, 0)"><polygon fill="none" stroke="#444444" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" points="14,22 6,16 1,16 1,8 6,8 14,2 " stroke-linejoin="miter"></polygon> <path data-color="color-2" fill="none" stroke="#444444" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" d="M17.5,15.5 c2-2,2-5.1,0-7.1" stroke-linejoin="miter"></path> <path data-color="color-2" fill="none" stroke="#444444" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" d="M20.4,18.4 c3.5-3.5,3.5-9.2,0-12.7" stroke-linejoin="miter"></path></g>',
      "drag-down": '<g stroke-width="2" transform="translate(0, 0)"><line data-cap="butt" data-color="color-2" fill="none" stroke="#444444" stroke-width="2" stroke-miterlimit="10" x1="12" y1="22" x2="12" y2="7" stroke-linejoin="miter" stroke-linecap="butt"></line> <polyline data-color="color-2" fill="none" stroke="#444444" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" points=" 16,18 12,22 8,18 " stroke-linejoin="miter"></polyline> <path data-cap="butt" fill="none" stroke="#444444" stroke-width="2" stroke-miterlimit="10" d="M7.99915,11.47145 C6.77214,10.37283,6,8.77659,6,7c0-3.31371,2.68629-6,6-6s6,2.68629,6,6c0,1.77679-0.77232,3.3732-1.99957,4.47182" stroke-linejoin="miter" stroke-linecap="butt"></path></g>',
      "e-remove": '<g stroke-width="2" transform="translate(0, 0)"><line fill="none" stroke="#444444" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" x1="19" y1="5" x2="5" y2="19" stroke-linejoin="miter"></line> <line fill="none" stroke="#444444" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" x1="19" y1="19" x2="5" y2="5" stroke-linejoin="miter"></line></g>'
    },
    "32": {},
    "48": {},
    "64": {}
  }
</script>
