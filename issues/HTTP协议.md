## HTTP协议

![img](http://www.ruanyifeng.com/blogimg/asset/2016/bg2016081901.jpg)

#### 前言

HTTP协议是Hyper Text Transfer Protocol（超文本传输协议）,

HTTP协议是基于 TCP/IP 协议的[**应用层协议**](http://www.ruanyifeng.com/blog/2012/05/internet_protocol_suite_part_i.html)。它不涉及数据包（packet）传输，主要规定了客户端和服务器之间的通信格式，默认使用80端口。



#### 一、http的特点

##### 优点：

- **灵活可扩展**：主要体现在两个方面，一个是**语义上**的自由，只规定了基本格式，比如空格分隔单词，换行分隔字段，其他的各个部分都没有严格的语法限制。另一个是**传输形式（方法）**的多样性，不仅仅可以传输文本，还能传输图片、视频等任意数据，非常方便。
- **可靠性**：HTTP 基于 TCP/IP，因此把这一特性继承了下来。这属于 TCP 的特性。
- **请求-应答**：客户端主动发起请求，服务器被动回复请求，通俗来讲就是“一发一收”“有来有去”。
- **无状态**：每个请求都是互相独立、毫无关联的，协议不要求客户端或服务器记录请求相关的信息。

##### 缺点：

- **无状态**

  在需要长连接的场景中，需要保存大量的上下文信息，以免传输大量重复的信息，那么这时候无状态就是 http 的缺点了。

- **队头阻塞问题**

  当 http 开启长连接时，共用一个 TCP 连接，同一时刻只能处理一个请求，那么当前请求耗时过长的情况下，其它的请求只能处于阻塞状态，也就是著名的**队头阻塞**问题。



#### 二、Http报文

**报文两种**

- 请求报文

  - 请求行：包含了请求方法、URL、协议版本

  - 请求头：键字/值对组成，每行一对。包括：客户端环境和请求正文的有用信息。

    比如：Host：表示主机名，虚拟主机；
    			Connection：keepalive，即持久连接，一个连接可以发多个请求；

  - 空格 ：用来分隔首部和内容主体 Body

  - 请求体：请求内容主体

  ![http请求报文](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/http请求报文.png)

- 响应报文

  - **状态行**：协议版本、状态码以及描述，常见的是 200 表示ok
  - **响应头**：键字/值对组成，每行一对。包括：客户端环境和响应正文的有用信息。
  - **空格**：用来分隔首部和内容主体 Body
  - **响应体**：响应的内容主体

  ```
  HTTP/1.1 200 OK
  Age: 529651
  Cache-Control: max-age=604800
  Connection: keep-alive
  Content-Encoding: gzip
  Content-Length: 648
  Content-Type: text/html; charset=UTF-8
  Date: Mon, 02 Nov 2020 17:53:39 GMT
  Etag: "3147526947+ident+gzip"
  Expires: Mon, 09 Nov 2020 17:53:39 GMT
  Keep-Alive: timeout=4
  Last-Modified: Thu, 17 Oct 2019 07:18:26 GMT
  
  <!doctype html>
  <html>
  <head>
      <title>Example Domain</title>
  	// 省略... 
  </body>
  </html>
  ```



#### 三、HTTP请求方法

客户端发送的 **请求报文** 第一行为请求行，包含了方法字段。

**GET**

> 获取资源

当前网络请求中，绝大部分使用的是 GET 方法。

**HEAD**

> 获取报文首部

和 GET 方法类似，但是不返回报文实体主体部分。

主要用于确认 URL 的有效性以及资源更新的日期时间等。

**POST**

> 传输实体主体

POST 主要用来传输数据，而 GET 主要用来获取资源。

**PUT**

> 上传文件

由于自身不带验证机制，任何人都可以上传文件，因此存在安全性问题，一般不使用该方法。

```
PUT /new.html HTTP/1.1
Host: example.com
Content-type: text/html
Content-length: 16
```

**PATCH**

> 对资源进行部分修改

PUT 也可以用于修改资源，但是只能完全替代原始资源，PATCH 允许部分修改。

```
PATCH /file.txt HTTP/1.1
Host: www.example.com
Content-Type: application/example
If-Match: "e0023aa4e"
Content-Length: 100
```

**DELETE**

> 删除文件

与 PUT 功能相反，并且同样不带验证机制。

```
DELETE /file.html HTTP/1.1
```

**OPTIONS**

> 查询支持的方法

查询指定的 URL 能够支持的方法。

会返回 `Allow: GET, POST, HEAD, OPTIONS` 这样的内容。

**CONNECT**

> 要求在与代理服务器通信时建立隧道

使用 SSL（Secure Sockets Layer，安全套接层）和 TLS（Transport Layer Security，传输层安全）协议把通信内容加密后经网络隧道传输。

```
CONNECT www.example.com:443 HTTP/1.1
```

**TRACE**

> 追踪路径

服务器会将通信路径返回给客户端。

发送请求时，在 Max-Forwards 首部字段中填入数值，每经过一个服务器就会减 1，当数值为 0 时就停止传输。

通常不会使用 TRACE，并且它容易受到 XST 攻击（Cross-Site Tracing，跨站追踪）



#### 四、HTTP 状态码

​	状态代码有三位数字组成，第一个数字定义了响应的类别，共分五种类别:

| 状态码 | 类别                             | 含义                       |
| ------ | -------------------------------- | -------------------------- |
| 1XX    | Informational（信息性状态码）    | 接收的请求正在处理         |
| 2XX    | Success（成功状态码）            | 请求正常处理完毕           |
| 3XX    | Redirection（重定向状态码）      | 需要进行附加操作以完成请求 |
| 4XX    | Client Error（客户端错误状态码） | 服务器无法处理请求         |
| 5XX    | Server Error（服务器错误状态码） | 服务器处理请求出错         |

##### 1XX 信息

- **100 Continue** ：表明到目前为止都很正常，客户端可以继续发送请求或者忽略这个响应。

##### 2XX 成功

- **200 OK**
- **204 No Content** ：请求已经成功处理，但是返回的响应报文不包含实体的主体部分。一般在只需要从客户端往服务器发送信息，而不需要返回数据时使用。
- **206 Partial Content** ：表示客户端进行了范围请求，响应报文包含由 Content-Range 指定范围的实体内容。

##### 3XX 重定向

- **301 Moved Permanently** ：永久性重定向
- **302 Found** ：临时性重定向
- **303 See Other** ：和 302 有着相同的功能，但是 303 明确要求客户端应该采用 GET 方法获取资源。
- 注：虽然 HTTP 协议规定 301、302 状态下重定向时不允许把 POST 方法改成 GET 方法，但是大多数浏览器都会在 301、302 和 303 状态下的重定向把 POST 方法改成 GET 方法。
- **304 Not Modified** ：如果请求报文首部包含一些条件，例如：If-Match，If-Modified-Since，If-None-Match，If-Range，If-Unmodified-Since，如果不满足条件，则服务器会返回 304 状态码。
- **307 Temporary Redirect** ：临时重定向，与 302 的含义类似，但是 307 要求浏览器不会把重定向请求的 POST 方法改成 GET 方法。

##### 4XX 客户端错误

- **400 Bad Request** ：请求报文中存在语法错误。
- **401 Unauthorized** ：该状态码表示发送的请求需要有认证信息（BASIC 认证、DIGEST 认证）。如果之前已进行过一次请求，则表示用户认证失败。
- **403 Forbidden** ：请求被拒绝。
- **404 Not Found**

##### 5XX 服务器错误

- **500 Internal Server Error** ：服务器正在执行请求时发生错误。
- **503 Service Unavailable** ：服务器暂时处于超负载或正在进行停机维护，现在无法处理请求。

#### 五、HTTP 首部字段类型

HTTP 首部字段根据实际用途被分为以下 4 种类型：

- **通用首部字段（General Header）**

  请求报文和响应报文两方都会使用的首部。如：Cache-Control，Connection,Date

- **请求首部字段（Request Header）**

  从客户端向服务器端发送请求报文时使用的首部。补充了请求的附加内容、客户端信息、响应内容相关优先级等信息。如Accept，Host，If-None-Match，If-Modified-Since；

- **响应首部字段（Response Header ）**

  从服务器端向客户端返回响应报文时使用的首部。补充了响应的附加内容，也会要求客户端附加额外的内容信息。如：Accept-Ranges，ETag， Location等

- **实体首部字段（Entity Header Fields）**
  针对请求报文和响应报文的实体部分使用的首部。补充了资源内容更新时间等与实体有关的信息。如：Expires，Last-Modified

#### 六、具体应用

1. ##### 持续连接

   - **为什么需要持久连接**

     ​	**HTTP协议的初始版本中，每进行一次HTTP通信就要断开一次TCP连接**。以当年的通信情况来说，因为都是些容量很小的文本传输，所以即使这样也没有多大问题。可随着 HTTP 的 普及，文档中包含大量图片的情况多了起来。比如，使用浏览器浏览一个包含多张图片的 HTML 页面时，在发送请求访问 HTML 页面资源的同时，也会请 求该 HTML 页面里包含的其他资源。因此，**每次的请求都会造成无谓的 TCP 连接建立和断开，增加通信量的开销。**

   - **持久连接的特点**

     ​		为解决上述 TCP 连接的问题，HTTP/1.1 和一部分的 HTTP/1.0 想出了持久连接（HTTP Persistent Connections，也称为 HTTP keep-alive 或 HTTP connection reuse）的方法。持久连接的特点是，**只要任意一端没有明确提出断开连接，则保持TCP连接状态。**

     ![TCP持续连接](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/TCP持续连接.png)

     ​       **持久连接的好处在于减少了 TCP 连接的重复建立和断开所造成的额外开销，减轻了服务器端的负载。另外， 减少开销的那部分时间，使 HTTP 请求和响应能够更早地结束，这样 Web 页面的显示速度也就相应提高了。**
     ​      在 HTTP/1.1 中，所有的连接默认都是持久连接，但在 HTTP/1.0 内并未标准化。虽然有一部分服务器通过非 标准的手段实现了持久连接，但服务器端不一定能够支持持久连接。毫无疑问，除了服务器端，客户端也需 要支持持久连接。

2. ##### 管线化

   - **管道化应用背景**

     ​	 持久连接使得多数请求以管线化（pipelining）方式发送成为可能。从前发送请求后需等待并收到响应，才能 发送下一个请求。管线化技术出现后，不用等待响应亦可直接发送下一个请求。
     **这样就能够做到同时并行发送多个请求，而不需要一个接一个地等待响应了。通俗地讲，请求打包一次传输过去，响应打包一次传递回来。管线化的前提是在持久连接下。**

   - **管道化特点**

     ![TCP管道化](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/TCP管道化.png)

     ​		假如当请求一个包含 10 张图片的 HTML Web 页面，**与挨个连接相比，用持久连接可以让请求更快结束。 而管线化技术则比持久连接还要快**。请求数越多，时间差就越明显。客户端需要请求这十个资源。以前的做法是，在同一个TCP连接里面，先发送A请求，然后等待服务器做出回应，收到后再发出B请求，以此类推，而管道机制则是允许浏览器同时发出这十个请求，但是服务器还是按照顺序，先回应A请求，完成后再回应B请求。
     于是在使用持久连接的情况下，某个连接上消息的传递类似于

     **请求1->响应1->请求2->响应2->请求3->响应3**

     管线化方式发送变成了类似这样：

     **请求1->请求2->请求3->响应1->响应2->响应3**

  

