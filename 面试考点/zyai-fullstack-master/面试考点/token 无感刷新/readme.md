# token 无感刷新
需要两个 token，
一个是 access token： 访问令牌，用于调用 API。
一个是 refresh token： 刷新令牌，用于刷新 access token。

步骤：
1. 客户端登录，获取 access token 和 refresh token 并保存到本地存储。
2. 请求接口时，将 access token 放到请求头中。
3. 如果 access token 过期，后端返回 401 错误，客户端收到错误后，使用 refresh token 刷新 access token。
4. 刷新 access token 后，将新的 access token 保存到本地存储。
