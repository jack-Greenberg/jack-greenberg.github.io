---
title: "Redis Permission Cache"
date: 2020-09-19T11:22:11-07:00
year: 2020
image: "images/main.svg"
draft: false
featured: false
---

During my summer internship at [Indico](https://indico.io), one of my big projects was building a cross-microservice permission cache system using Redis.

<!--more-->

Indico's API is a microservices architecture, which means that they have a bunch (~12 iirc[^1]) of smaller applications that all communicate over HTTP to perform different functions. For instance, one service fetches datasets from a database while others handle that data and perform machine learning tasks.

[^1]: "If I remember correctly"

The need for a permission cache came from the fact that when any of these services were used (i.e. they recieved an HTTP request), each of them _individually_ would have to make sure that the request had the correct permissions on the data that was being used.

And in order to verify those permissions, the service in question would have to make an _additional_ HTTP request to a central service that was responsible for verifying the permissions. So for each request, there would be almost double the amount of HTTP traffic, and for large, involved requests, that could mean a very heavy load for the whole system.

That's where my project came in.

Each of the services has access to a central in-memory database that runs [Redis](https://redis.io/). Utilizing Redis I was able to write a system where only a _single_ service has to make an HTTP request, and the others just wait for the first one to fetch the data, and read it from Redis. It works like this:

1. 3 services {A, B, C} need to verify permissions on a set of data.
2. The first service to query the cache ___`A`___ sees that it is unlocked and empty, and locks it.
    * Any other service that checks the cache now will see that it is locked, so it can just wait
3. ___`A`___ makes an HTTP request to fetch the permissions, and then stores the results in Redis.
4. ___`A`___ then unlocks the cache
5. Now all other services that were waiting for the lock to be released are now able to access the cache, and find that it is filled with data that they can use.

## Design Decisions

There were a handful of decisions that were made to improve the performance and security of the tool. For one, each cache was keyed[^2] using the API request ID, the user id, and the data id. This meant that the data was only fresh for a specific request and a specific user, and thus wouldn't be accessed by any others.

[^2]: Stored under the name of

Additionally, we set up a number of failsafes that would prevent deadlocks, including a timeout on the cache lock, just to make sure that a request never failed due to a fault in a single service.

One option we considered while designing the system was actually moving all permissions to a Redis database instead of having them fetched per HTTP request. While potentially memory-intensive, this option would be beneficial in that it would prevent race conditions with different microservices making simultaneous requests, and instead just allow the services to make requests to Redis directly, thus eliminating HTTP traffic in that stage entirely.

## Looking Back

This was my first real industry software engineering project, and I learned a lot! It was a great opportunity to apply concepts I learned in my _Software Systems_ class like mutexes and memory storage. It also taught me a lot about software design patterns and writing efficient software.

I couldn't have done it without the help of my brilliant and patient mentors at Indico, to whom I'm forever grateful for the opportunity. I can definitely see that this project and others that I worked on at Indico have changed the way I write software for the better.
