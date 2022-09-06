import { useState, useEffect } from "react";
import axios from "axios";

function useSearchBook(query, pageNum) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    let cancel;

    setIsLoading(true);
    setError(false);

    axios
      .get(`https://openlibrary.org/search.json?q=${query}&page=${pageNum}`, {
        cancelToken: new CancelToken((c) => (cancel = c))
      })
      .then((res) => {
        setBooks((prev) => {
          return [...new Set([...prev, ...res.data.docs.map((d) => d.title)])];
        });
        setHasMore(res.data.docs.length > 0);
        setIsLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(err);
      });

    return () => cancel();
  }, [query, pageNum]);

  return { isLoading, error, books, hasMore };
}

export default useSearchBook;