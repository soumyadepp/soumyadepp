import Image from "next/image";
import { SITE } from "@/content/site";

type SubjectPhotoProps = {
  sizes: string;
  fit?: string;
  priority?: boolean;
  children?: React.ReactNode;
};

/**
 * The desk photograph, with a cutout of the subject layered over it.
 *
 * The photograph is already graded: a dark monochrome room with the subject
 * in colour. The cutout lets a frame sit behind the subject.
 *
 * Args:
 *   sizes: The responsive sizes hint for both image layers.
 *   fit: Object-fit and object-position classes shared by both layers.
 *   priority: Load the images eagerly, for use above the fold.
 *   children: Layers drawn in front of the room and behind the subject.
 */
export default function SubjectPhoto({
  sizes,
  fit = "object-cover",
  priority = false,
  children,
}: SubjectPhotoProps) {
  return (
    <>
      <div className="absolute inset-0">
        <Image
          src={SITE.photo}
          alt={SITE.photoAlt}
          fill
          priority={priority}
          sizes={sizes}
          className={fit}
        />
      </div>
      {children}
      <div className="absolute inset-0">
        <Image
          src={SITE.photoSubject}
          alt=""
          aria-hidden="true"
          fill
          priority={priority}
          sizes={sizes}
          className={fit}
        />
      </div>
    </>
  );
}
