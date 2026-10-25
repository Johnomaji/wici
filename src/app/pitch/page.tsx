import { Suspense } from "react";
import Demo from "@/components/Demo";

// /pitch?step=6 opens straight on a given step (handy for rehearsals)
export default function Pitch({ searchParams }: PageProps<"/pitch">) {
  return (
    <Suspense fallback={null}>
      <Start searchParams={searchParams} />
    </Suspense>
  );
}

async function Start({ searchParams }: Pick<PageProps<"/pitch">, "searchParams">) {
  const { step } = await searchParams;
  return <Demo initialStep={Number(step) || 0} />;
}
