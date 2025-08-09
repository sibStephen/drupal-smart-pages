export interface DrupalArticleAttributes {
  title: string;
  body?: {
    value?: string;
    processed?: string;
    format?: string;
  };
  path?: {
    alias?: string;
  };
  // field_image?: {
  //   uri?: {
  //     url?: string;
  //   };
  // };  // To do
}

export interface DrupalArticle {
  id: string;
  type: string;
  attributes: DrupalArticleAttributes;
  relationships?: any;
}