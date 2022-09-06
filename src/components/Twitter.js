import React, { useState, useEffect, useRef, useCallback } from "react";
import useTweet from "../hooks/useTweet";

export default function Twitter() {
  const [page, setPage] = useState('Tweets');
  const [pageNum, setPageNum] = useState(0);
  const { isLoading, error, tweets, hasMore } = useTweet(pageNum);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const users = [];
    const map = new Map();
    for (const tweet of tweets) {
        if(!map.has(tweet.user.username)){
            map.set(tweet.user.username, true);
            users.push({
                username: tweet.user.username,
                friendsCount: tweet.user.friendsCount,
                followersCount: tweet.user.followersCount,
                tweetsCount: 1
            });
        } else {
          users.find(user => user.username === tweet.user.username).tweetsCount++;
        }
    
    }
    users.sort((a, b) => a.username.localeCompare(b.username));
    setUsers(users);
  }, [tweets]);


  const observer = useRef();
  const tweetsContainerRef = React.useRef();
  const usersContainerRef = React.useRef();
  const lastTweetRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prev) => prev + 1);
        }
      }, {
        root: tweetsContainerRef.current
        });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const lastUserRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prev) => prev + 1);
        }
      }, {
        root: usersContainerRef.current
        });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const handlePageClick = () =>{
    setPage(prev => prev == 'Tweets'? 'Users' : 'Tweets');
  }

  const UserHeader = () => {
    return (
      <div style={{display: 'flex', flexDirection: 'row', fontWeight: 'bold'}}>
        <div style={{width: '150px', fontWeight: 'bold'}}>Name</div> <div className="count">Tweets</div><div className="count">Frinds</div><div className="count">Follows</div> 
      </div>)
  }
  const UserRow = ({name, friendsCount, followersCount, tweetsCount}) => {
    return (
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{width: '150px'}}>{name}</div> <div className="count">{tweetsCount}</div><div className="count">{friendsCount}</div><div className="count">{followersCount}</div> 
      </div>)
  }

  return (
    <div>
      {page === 'Tweets'? 
        (<div ref={tweetsContainerRef}
          style={{
            padding: '15px',
            height: '90vh',
            overflow: 'scroll',
          }}
        >
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
            <div className='headerLine'>Tweets</div>
            <button style={{marginLeft: '20px', width: '100px'}}onClick={handlePageClick}>&gt;&gt; Users</button>
          </div>
          {tweets.map((tweet, i) => {
            if (tweets.length === i + 1) {
              return (
                <div key={i} ref={lastTweetRef}>
                  <span>
                    {tweet.content}
                  </span>
                  <div>
                    {tweet.username}
                  </div>
                </div>
              );
            } else {
              return (
                <div key={i}>
                  <span><b>{tweet.user.username}</b></span>
                  <span>: </span>
                  <span>
                    {tweet.content}
                  </span> 
                </div>);
            }
          })}
          <div>{isLoading && "Loading..."}</div>
          <div>{error && "Error..."}</div>
        </div>)
        :
        (<div ref={usersContainerRef}
          style={{
            padding: '15px',
            height: '90vh',
            overflow: 'scroll',
          }}
        >
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
            <div className='headerLine'>Users</div>
            <button style={{marginLeft: '20px', width: '100px'}}onClick={handlePageClick}>&gt;&gt;  Tweets</button>
          </div>
          <UserHeader />
          {users.map((user, i) => {
            if (users.length === i + 1) {
              return (
                <div style={{display: 'flex', flexDirection: 'row'}} key={i} ref={lastUserRef}>
                  <UserRow name={user.username} friendsCount={user.friendsCount} followersCount={user.followersCount} tweetsCount={user.tweetsCount} />
                </div>
              );
            } else {
              return (
                <div key={i}>
                  <UserRow name={user.username} friendsCount={user.friendsCount} followersCount={user.followersCount} tweetsCount={user.tweetsCount} />
                </div>);
            }
          })}
          <div>{isLoading && "Loading..."}</div>
          <div>{error && "Error..."}</div>
        </div>)
      }
    </div>
  );
}
