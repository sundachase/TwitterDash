import { useState, useEffect } from "react";
import axios from "axios";

function useTweet(pageNum) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [hasMore, setHasMore] = useState(false);


  useEffect(() => {
    const CancelToken = axios.CancelToken;
    let cancel;

    setIsLoading(true);
    setError(false);

    axios
      .get(`https://localhost:7139/Twitter?pageNum=${pageNum}`, {
        cancelToken: new CancelToken((c) => (cancel = c))
      })
      .then((res) => {
        setTweets((prev) => {
          return [...new Set([...prev, ...res.data])];
        });
        setHasMore(res.data.length > 0);
        setIsLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(err);
      });

    return () => cancel();
  }, [pageNum]);

  return { isLoading, error, tweets, hasMore };
}

export default useTweet;