export default function ChangelogDetail() {
  console.log("ChangelogDetail");

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="prose prose-invert lg:prose-xl">
        <h1>Detail Page not ready yet</h1>
        {/* <h1>{changelogData.title}</h1>

        <p className="text-xl">Version: {changelogData.version}</p>
        <p className="text-gray-600">Date: {changelogData.date}</p>
        <div dangerouslySetInnerHTML={{ __html: changelogData.contentHtml }} /> */}
      </article>
    </div>
  );
}

/* export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getSortedChangelogsData().map((changelog) => ({
    params: { id: changelog.id },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const changelogData = await getChangelogData(params.id as string);
  return {
    props: {
      changelogData,
    },
  };
};
 */
