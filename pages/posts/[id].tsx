import type { NextPage, GetStaticPropsContext } from 'next'
import { getPostPage, getPostPages } from '../../lib/api';
import { IPost } from '../../types/generated/contentful';

interface Props {
  page: IPost,
}

const Post: NextPage<Props> = ({ page }) => {
  return (
    <div>
      <h2>This is post!</h2>
      <div>Name: {page.fields.name}</div>
      <div>Age: {page.fields.age}</div>
    </div>
  )
}

export default Post

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context.params?.id);
  const page = await getPostPage(id);
  console.log(JSON.stringify({ page: page }, null, 2))
  return {
    props: { page }, // will be passed to the page component as props
  }
}

export async function getStaticPaths() {
  const pages = await getPostPages();
  const paths = pages.map(page => ({ params: { id: page.fields.name } }));

  return {
    paths: paths,
    fallback: false,
  };
}
