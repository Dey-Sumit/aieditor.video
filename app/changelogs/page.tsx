import { ArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import { getSortedChangelogsData } from "~/utils/changelogs";

type ChangelogData = ReturnType<typeof getSortedChangelogsData>[number];

const ChangelogSummary = ({ changelog }: { changelog: ChangelogData }) => (
  <article className="rounded-md border p-4">
    <div className="[&>*]:my-3">
      <h2 className="!mt-0">{changelog.title}</h2>
      <p className="text-xl">Version: {changelog.version}</p>
      <p className="text-muted-foreground">Date: {changelog.date}</p>
      <p>{changelog.description}</p>
      <h3>Major Changes:</h3>
      <ul>
        {changelog.changes.map((change, index) => (
          <li key={index}>{change}</li>
        ))}
      </ul>
      <Link
        href={`/changelogs/${changelog.id}`}
        className="font-semibold text-blue-600 no-underline hover:text-blue-800"
      >
        Read full changelog
        <ArrowUpRightFromSquare className="ml-2 inline" size={16} />
      </Link>
    </div>
  </article>
);

export default function Changelogs() {
  const allChangelogsData = getSortedChangelogsData();
  return (
    <main className="px-4 py-8">
      <div className="prose prose-invert max-w-full">
        <div className="mb-2 flex flex-col items-center justify-center gap-y-3 rounded-md p-8 [&>*]:my-0">
          <h1 className="text-4xl">AiEditor.video Changelog</h1>
          <p>
            Site to browse latest releases of NextJs framework and packages.
          </p>
        </div>
        <div className="flex flex-col gap-y-4">
          {allChangelogsData.map((changelog) => (
            <ChangelogSummary key={changelog.id} changelog={changelog} />
          ))}
        </div>
      </div>
    </main>
  );
}
