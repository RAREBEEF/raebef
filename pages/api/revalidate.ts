import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, body } = req;

  // Check for secret to confirm this is a valid request
  if (query.secret !== process.env.NEXT_PUBLIC_REVALIDATE_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const targetPath =
    body.target === "product"
      ? "/products/product/"
      : body.target === "collection"
      ? "/collections/"
      : "";

  if (targetPath === "") {
    return res.status(401).json({ message: "Invalid target" });
  }

  try {
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    if (typeof body.id === "string") {
      await res.revalidate(targetPath + body.id);
    } else {
      body.id.forEach(async (id: string) => {
        await res.revalidate(targetPath + id);
      });
    }

    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
}
