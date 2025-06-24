import { BlockRenderer } from "@/components/BlockRenderer";
import { BlogCard } from "@/components/BlogCard";

import { ContentList } from "@/components/ContentList";
import { getHomePage } from "@/data/loaders";
import { notFound } from "next/navigation";

async function loader() {
  const data = await getHomePage();

  if (!data) notFound();

  console.log("Data from Loader:", data);
  return { ...data.data };
}

export default async function HomeRoute() {
  const data = await loader();
  const blocks = data.blocks || [];
  console.log("Data from Route:", data);
  return (
    <div>
      <BlockRenderer blocks={blocks} />
      <div className="container">
        <ContentList
          headline="Featured Articles"
          path="/api/articles"
          component={BlogCard}
          featured
        />
      </div>
    </div>
  );
}
