import { createClient, Entry } from 'contentful';
import { CONTENT_TYPE, IHomePage, IPost, LOCALE_CODE } from '../types/generated/contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '', // TODO 
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '', // TODO
});

type GetPageParams = {
  pageContentType: CONTENT_TYPE;
  locale: LOCALE_CODE;
  id?: string;
};

type InnerFieldType<T> = T extends Entry<infer Inner> ? Inner : never;

async function getPage<T extends Entry<unknown>>(params: GetPageParams) {
  const query = {
    limit: 1,
    include: 10,
    locale: params.locale,
    'fields.name': params.id,
    content_type: params.pageContentType,
    // 'fields.content.sys.contentType.sys.id': params.pageContentType,
  };
  const { items: [page] } = await client.getEntries<InnerFieldType<T>>(query);
  return page;
}

async function getPages<T extends Entry<unknown>>(params: GetPageParams) {
  const query = {
    // limit: 1,
    // include: 10,
    locale: params.locale,
    // 'fields.slug': params.slug,
    content_type: params.pageContentType,
    // 'fields.content.sys.contentType.sys.id': params.pageContentType,
  };
  const { items } = await client.getEntries<InnerFieldType<T>>(query);
  return items;
}

export async function getPostPages() {
  return getPages<IPost>({
    locale: 'en-US',
    pageContentType: 'post',
  })
}


export async function getPostPage(id: string) {
  return getPage<IPost>({
    locale: 'en-US',
    pageContentType: 'post',
    id: id,
  })
}

export async function getHomePage() {
  const pages = await getPages<IHomePage>({
    locale: 'en-US',
    pageContentType: 'homePage',
  })
  return pages[0];
}