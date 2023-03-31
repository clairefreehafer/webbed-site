export const chasm = {
  images: [
    {
      src: "https://live.staticflickr.com/65535/50764696597_9635015d6c_k.jpg",
      alt: "a long-exposure photograph taken at night of a shed with a giant sign on the side that reads 'CHASM'.",
    }
  ],
  name: "chasm",
  styles: {
    body: "background-color: black;"
  },
  template: "single-image"
};

export const example = {
  // list of images to display on the page, in DOM order
  images: [
    {
      src: "image.jpg",
      alt: "alt text",
    }
  ],
  // page name for identification purposes. should match export name.
  name: "example",
  tags: ["tag1", "tag2"],
  // any text we want to display on the page
  text: ["some text", "more text"],
  // title for browser bar as well as to display on the list
  title: "page title",
  // if we want to populate a template - TBD if we'll actually do it this way
  // template: "single-image",
  // any other page styles we want to implement, like page background color
  style: "",
};

export const templateExample = {
  // list of images to display on the page, in DOM order
  images: [
    {
      src: "image.jpg",
      alt: "alt text",
    }
  ],
  // page name for identification purposes. kebab case
  name: "template-example",
  tags: ["tag1", "tag2"],
  // any text we want to display on the page
  text: ["some text", "more text"],
  // title for browser bar as well as to display on the list
  title: "template example page",
  // if we want to populate a template - TBD if we'll actually do it this way
  template: "single-image",
  // any other page styles we want to implement, like page background color
  style: "",
};
