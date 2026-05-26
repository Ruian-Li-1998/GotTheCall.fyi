import type { Metadata } from "next";
import { Card, Container } from "@/components/ui";
import { SubmitForm } from "@/components/submit-form";
import { getModels } from "@/lib/queries";
import { hasSupabaseWriteConfig } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Submit a datapoint",
  description:
    "Share how long you waited and what you spent to get the call on a hard-to-get watch.",
};

export default async function SubmitPage() {
  const models = await getModels();
  const options = models.map((m) => ({
    slug: m.slug,
    brand: m.brand,
    model: m.model,
    reference: m.reference,
  }));

  return (
    <Container className="max-w-2xl py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Share your experience</h1>
      <p className="mt-2 text-sm text-gray-500">
        Add an anonymous datapoint so others know what it really takes to get the
        call. The more honest reports we collect, the better the medians get.
      </p>

      <Card className="mt-6 p-6">
        <SubmitForm models={options} canPersist={hasSupabaseWriteConfig()} />
      </Card>
    </Container>
  );
}
