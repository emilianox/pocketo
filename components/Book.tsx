import { isString } from "@tool-belt/type-predicates";
// eslint-disable-next-line @typescript-eslint/no-shadow
import Image from "next/image";
import type { DeepReadonly } from "ts-essentials/dist/types";

import type { BookType } from "./services/useBooks";

interface BookProps {
  bookData: BookType;
}

function Book({ bookData }: DeepReadonly<BookProps>) {
  return (
    <div className="card bordered">
      <figure>
        <Image
          alt="book cover"
          // eslint-disable-next-line react/forbid-component-props
          className="w-full"
          height="200"
          src="https://picsum.photos/456/200"
          width="200"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{bookData.title}</h2>
        <p>{isString(bookData.description) && bookData.description}</p>
        <div className="card-actions">
          <div className="badge badge-ghost">Article</div>
          <div className="badge badge-ghost">Photography</div>
        </div>
      </div>
    </div>
  );
}

export default Book;
