import Head from "next/head";

import useBooks from "../components/services/useBooks";
import Book from "../components/Book";

function List() {
  const { isLoading, data } = useBooks();

  // console.log(data);

  if (isLoading) {
    return "Loading...";
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Head>
        <title>Boom List</title>
      </Head>
      {data?.entries.map((book) => (
        <Book bookData={book} key={book.key} />
      ))}
    </div>
  );
}

export default List;
