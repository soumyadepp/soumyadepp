import { getAllBlogs } from "@/lib/blogs";
import BlogsClient from "./BlogsClient";

export const metadata = {
  title: "Blog | Soumyadeep Ghosh",
  description: "Writing on systems, engineering, and things I've learned the hard way.",
};

export default function BlogsPage() {
  const blogs = getAllBlogs();
  return <BlogsClient blogs={blogs} />;
}
