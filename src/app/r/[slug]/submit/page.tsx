import Editor from "@/components/Editor";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";


interface Props {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: Props) => {

  const subideavibe = await db.subideavibe.findFirst({
    where: {
      name: params.slug,
    },
  })

  if (!subideavibe) return notFound()



  return (
    <div className="flex flex-col items-start gap-6">
      {/* heading */}
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">
            in r/{params.slug}
          </p>
        </div>
      </div>

      {/* form */}
      <Editor subideavibeId={subideavibe.id}/>

      
    </div>
  );
};

export default Page;
