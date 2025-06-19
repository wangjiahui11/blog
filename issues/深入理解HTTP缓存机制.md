## 深入理解HTTP缓存机制

### 前言

> 浏览器缓存策略对于前端开发同学来说不陌生，大家都有一定的了解，但如果没有系统的归纳总结，可能三言两语很难说明白，甚至说错，尤其在面试过程中感触颇深，很多候选人对这类基础知识竟然都是一知半解，说出几个概念就没了，所以重新归纳总结下，温故而知新。

**什么是浏览器缓存？**

- 浏览器缓存是指一个 Web 资源（如 html 页面，图片，js，数据等）存在于服务器和客户端（浏览器）之间的副本。
- 缓存会根据进来的请求保存输出内容的副本；当下一个请求来到的时候，如果是相同的 URL，缓存会根据**缓存机制**决定是直接使用副本响应访问请求，还是向源服务器再次发送请求。

**浏览器缓存的好处？**

- 减少网络延迟，加快页面打开速度

- 减少网络带宽消耗

- 降低服务器压力

  

### 缓存过程分析

​		浏览器与服务器通信的方式为应答模式，即是：浏览器发起HTTP请求 – 服务器响应该请求。那么浏览器第一次向服务器发起该请求后拿到请求结果，会根据响应报文中HTTP头的缓存标识，决定是否缓存结果，是则将请求结果和缓存标识存入浏览器缓存中，简单的过程如下图：

![图片](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/%E5%BC%BA%E5%88%B6%E7%BC%93%E5%AD%98%E7%AC%AC%E4%B8%80%E7%A7%8D%E6%83%85%E5%86%B5.png?raw=true)

由上图我们可以知道：

- 浏览器每次发起请求，都会先在浏览器缓存中查找该请求的结果以及缓存标识（读取）
- 浏览器每次拿到返回的请求结果都会将该结果和缓存标识存入浏览器缓存中（保存）

以上两点结论就是浏览器缓存机制的关键，他确保了每个请求的缓存**存入与读取，**只要我们再理解浏览器缓存的使用规则，那么所有的问题就迎刃而解了。



### HTTP 缓存的两个阶段

浏览器缓存一般分为两类：强制缓存（也称本地缓存）和协商缓存（也称弱缓存）。

#### 强制缓存

强制缓存就是向浏览器缓存查找该请求结果，并根据该结果的缓存规则来决定是否使用该缓存结果的过程

##### **强制缓存三种状态：**

1. 不存在该缓存结果和缓存标识，强制缓存失效，则向服务器发起请求（跟第一次发起请求一致），如下图：

   ![图片](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/%E5%BC%BA%E5%88%B6%E7%BC%93%E5%AD%98%E7%AC%AC%E4%B8%80%E7%A7%8D%E6%83%85%E5%86%B5.png?raw=true)

2. 存在该缓存结果和缓存标识，但该结果已失效，强制缓存失效，则使用协商缓存，如下图

   ​          ![强制缓存第二种情况](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/强制缓存第二种情况.png)

3. 存在该缓存结果和缓存标识，且该结果尚未失效，强制缓存生效，直接返回该结果，如下图

   ![强制缓存第三种情况](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/强制缓存第三种情况.png)

   

> ***那么强制缓存的缓存规则是什么？***

​		当浏览器向服务器发起请求时，服务器会将缓存规则放入HTTP响应报文的HTTP头中和请求结果一起返回给浏览器，控制强制缓存的字段分别是**Expires**和**Cache-Control**，**其中Cache-Control优先级比Expires高**。

##### Expires

Expires是HTTP/1.0控制网页缓存的字段，其值为服务器返回该请求结果缓存的到期时间，即再次发起该请求时，如果客户端的时间小于Expires的值时，直接使用缓存结果。

> Expires是HTTP/1.0的字段，但是现在浏览器默认使用的是HTTP/1.1，那么在HTTP/1.1中网页缓存还是否由Expires控制？

到了HTTP/1.1，Expire已经被Cache-Control替代，原因在于Expires控制缓存的原理是使用客户端的时间与服务端返回的时间做对比，那么如果客户端与服务端的时间因为某些原因（例如时区不同；客户端和服务端有一方的时间不准确）发生误差，那么强制缓存则会直接失效，这样的话强制缓存的存在则毫无意义，那么Cache-Control又是如何控制的呢？

##### Cache-Control

在HTTP/1.1中，Cache-Control是最重要的规则，主要用于控制网页缓存，主要取值为：

- public：所有内容都将被缓存（客户端和代理服务器都可缓存）
- private：所有内容只有客户端可以缓存，Cache-Control的默认取值
- no-cache：忽略本地缓存，强制每次向服务器发送请求，通过协商策略判断是否使用协商缓存
- no-store：所有内容都不会被缓存，即不使用强制缓存，也不使用协商缓存
- max-age=xxx (xxx is numeric)：本地缓存内容将在xxx秒后失效，后续再执行协商缓存机制判断是否使用缓存；

![强制缓存策略](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/强制缓存策略.png)



由上面的例子我们可以知道：

- HTTP响应报文中expires的时间值，是一个绝对值
- HTTP响应报文中Cache-Control为max-age=600，是相对值

由于Cache-Control的优先级比expires，那么直接根据Cache-Control的值进行缓存，意思就是说在600秒内再次发起该请求，则会直接使用缓存结果，强制缓存生效。

**注：在无法确定客户端的时间与服务端的时间同步的情况下，Cache-Control优先于expires，所以同时存在时，只有Cache-Control生效。**



**举例：**当你打开一网页并刷新是，会在 DevTools Network看到如下情况

![强制缓存实例](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/强制缓存实例.png)

> 这里会出现 from disk cache和from memory cache，他们之间有什么区别呢？

对于这个问题，我们需要了解内存缓存(from memory cache)和硬盘缓存(from disk cache)，如下:

- 内存缓存(from memory cache)：**存在内存中**，具有两个特点，分别是快速读取和时效性：
  - 快速读取：内存缓存会将编译解析后的文件，直接存入该进程的内存中，占据该进程一定的内存资源，以方便下次运行使用时的快速读取。
  - 时效性：一旦该进程关闭，则该进程的内存则会清空。
- 硬盘缓存(from disk cache)：**存在硬盘中**，是直接将缓存写入硬盘文件中，读取缓存需要对该缓存存放的硬盘文件进行I/O操作，然后重新解析该缓存内容，读取复杂，速度比内存缓存慢。

在浏览器中，浏览器会在js和图片等文件解析执行后直接存入内存缓存中，那么当刷新页面时只需直接从内存缓存中读取(from memory cache)；而css文件则会存入硬盘文件中，所以每次渲染页面都需要从硬盘读取缓存(from disk cache)。



#### 协商缓存

协商缓存就是强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程；

##### 协商缓存分两种情况：

1. 协商缓存生效，返回304，如下

   ![协商缓存成功](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/协商缓存成功.png)

2. 协商缓存失效，返回200和请求结果结果，如下

   ![协商缓存失效](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/协商缓存失效.png)

同样，协商缓存的标识也是在响应报文的HTTP头中和请求结果一起返回给浏览器的，控制协商缓存的字段分别有：Last-Modified / If-Modified-Since和Etag / If-None-Match，其中Etag / If-None-Match的优先级比Last-Modified / If-Modified-Since高。

##### Last-Modified / If-Modified-Since

- **Last-Modified**是服务器**响应报文**时，返回该资源文件在服务器最后被修改的时间，如下。

  ```
  last-modified: Sat, 12 Jan 2019 13:20:45 GMT
  ```

- **If-Modified-Since则**是客户端再次发起该**请求报文**时，携带上次请求返回的Last-Modified值，通过此字段值告诉服务器该资源上次请求返回的最后被修改时间。服务器收到该请求，发现请求头含有If-Modified-Since字段，则会根据If-Modified-Since的字段值与该资源在服务器的最后被修改时间做对比，若服务器的资源最后被修改时间大于If-Modified-Since的字段值，则重新返回资源，状态码为200；否则则返回304，代表资源无更新，可继续使用缓存文件，如下。

  ```
  if-modified-since: Sat, 12 Jan 2019 13:20:45 GMT
  ```

  

##### Etag / If-None-Match

- **Etag**是服务器**响应报文**时，返回当前资源文件的一个唯一标识(由服务器生成)，如下。

  ```
  ETag:"fcb82312d92970bdf0d18a4eca08ebc7efede4fe"
  ```

- **If-None-Match**是客户端再次发起该**请求报文**时，携带上次请求返回的唯一标识Etag值，通过此字段值告诉服务器该资源上次请求返回的唯一标识值。服务器收到该请求后，发现该请求头中含有If-None-Match，则会根据If-None-Match的字段值与该资源在服务器的Etag值做对比，一致则返回304，代表资源无更新，继续使用缓存文件；不一致则重新返回资源文件，状态码为200，如下。

  ```
  if-none-match: W/"5c39e9ad-5417"
  ```

注：Etag / If-None-Match优先级高于Last-Modified / If-Modified-Since，同时存在则只有Etag / If-None-Match生效。



#### 总结

强制缓存优先于协商缓存进行，若强制缓存(Expires和Cache-Control)生效则直接使用缓存，若不生效则进行协商缓存(Last-Modified / If-Modified-Since和Etag / If-None-Match)，协商缓存由服务器决定是否使用缓存，若协商缓存失效，那么代表该请求的缓存失效，重新获取请求结果，再存入浏览器缓存中；生效则返回304，继续使用缓存，主要过程如下：

![图片](https://mmbiz.qpic.cn/mmbiz_png/meG6Vo0Mevgq38cXiaLvaxNIiatrA806UA6eZ3dqoKdgIhPENicUjaXXict6LuQDYsGNHFrddiayooqibHN50ZUCbYog/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)



参考：

[彻底理解浏览器的缓存机制](https://mp.weixin.qq.com/s/d2zeGhUptGUGJpB5xHQbOA)

[浏览器缓存机制剖析](http://louiszhai.github.io/2017/04/07/http-cache/#%E5%AF%BC%E8%AF%BB)

[彻底弄懂浏览器缓存策略](https://www.jiqizhixin.com/articles/2020-07-24-12)
