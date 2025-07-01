import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json'
  }
});

// 请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('github_token');
  if (token) {
    config.headers.Authorization = `token ${token}`;
  }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const errorMessage = {
      401: '请先登录',
      403: '权限不足',
      500: '服务器错误',
    }[status] || '网络连接异常';


    // // 特殊状态码处理
    // if (status === 401) {
    //   localStorage.removeItem('github_token');
    //   window.location.href = '/login';
    // }

    return Promise.reject({ ...error, message: errorMessage });
  }
);

export default api;