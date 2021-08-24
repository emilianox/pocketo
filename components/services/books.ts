/* eslint-disable camelcase,@typescript-eslint/naming-convention */
import { useQuery } from "react-query";

interface Type {
  key: string;
}

interface Excerpt {
  author: Type;
  comment: string;
  excerpt: string;
}

interface Link {
  title: string;
  url: string;
  type: Type;
}

interface Created {
  type: string;
  value: string;
}

interface Author {
  type: Type;
  author: Type;
}

interface Links {
  self: string;
  author: string;
  next: string;
}

interface BookType {
  title: string;
  covers?: number[];
  key: string;
  authors: Author[];
  type: Type;
  latest_revision: number;
  revision: number;
  created: Created;
  last_modified: Created;
  description?: Created | string;
  links?: Link[];
  subject_places?: string[];
  subjects?: string[];
  subject_people?: string[];
  excerpts?: Excerpt[];
  subject_times?: string[];
  first_sentence?: Created;
  first_publish_date?: string;
  location?: string;
}

interface BooksbyAuthor {
  links: Links;
  size: number;
  entries: BookType[];
}

export default function useBooks() {
  return useQuery<BooksbyAuthor, Error>(
    "books",
    async () =>
      await fetch("https://openlibrary.org/authors/OL23919A/works.json").then(
        async (response) => (await response.json()) as BooksbyAuthor
      )
  );
}

export type { BookType, BooksbyAuthor };
