import { useEffect, useState, useRef, useCallback } from 'react';
import api from '../../utils/api';
import './popular.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faStar,
  faCodeBranch,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Spin, message } from 'antd';
import throttle from 'lodash/throttle';

export default function PopularProjects({ selectedLanguage }) {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const observerRef = useRef();
  const [init, setInit] = useState(false);

  // localStorage缓存key
  const CACHE_KEY = 'popular_language_cache';
  // 初始化时从localStorage读取缓存
  const [languageCache, setLanguageCache] = useState(() => {
    try {
      const cache = localStorage.getItem(CACHE_KEY);
      if (cache) {
        return JSON.parse(cache);
      }
    } catch (e) {
      console.error('Failed to parse language cache from localStorage:', e);
    }
    return { queue: [], data: {} };
  });

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && init) {
        setPage((prev) => prev + 1);
      }
    },
    [loading, init]
  );

  useEffect(() => {
    const option = {
      root: null,
      // rootMargin: '10px',
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  // 创建节流版的 error 提示
  const throttledError = useCallback(
    throttle(
      (msg) => {
        message.error(msg);
      },
      3000,
      { leading: true, trailing: false }
    ),
    []
  );
  /**
   * 分页加载项目
   * @param {number} customPage
   * @param {string} customLang
   * @param {boolean} isFirstPage
   */
  const fetchProjects = async (
    customPage = page,
    customLang = selectedLanguage,
    isFirstPage = false
  ) => {
    setLoading(true);
    try {
      // 检查缓存中是否有该语言的数据
      if (languageCache.data[customLang] && customPage === 1) {
        setProjects(languageCache.data[customLang]);
        return;
      } else {
        const q = customLang === 'all' ? 'stars:>1' : `stars:>1 language:${customLang}`;

        const response = await api.get('/search/repositories', {
          params: {
            q,
            sort: 'stars',
            order: 'desc',
            page: customPage,
            per_page: 10
          }
        });

        if (response && Array.isArray(response.data.items)) {
          setProjects((prev) =>
            isFirstPage ? response.data.items : [...prev, ...response.data.items]
          );

          // 更新缓存
          setLanguageCache((prev) => {
            const newQueue = [...prev.queue];
            const newData = { ...prev.data };
            // 维护缓存队列
            if (newQueue.length >= 3) {
              const oldestLang = newQueue.shift();
              delete newData[oldestLang];
            }

            if (!newQueue.includes(customLang)) {
              newQueue.push(customLang);
              newData[customLang] = response.data.items;
            }

            return { queue: newQueue, data: newData };
          });
        } else {
          throttledError('未能获取项目数据，请稍后再试。');
        }
      }
    } catch (error) {
      if (error.message !== 'canceled') {
        throttledError('加载失败: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      throttledError.cancel();
    };
  }, []);

  // languageCache变化时写入localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(languageCache));
    } catch (e) {
      console.error('Failed to save language cache to localStorage:', e);
    }
  }, [languageCache]);

  // 切换语言时，立即请求第一页
  useEffect(() => {
    setProjects([]);
    setPage(1);
    setInit(false);
    fetchProjects(1, selectedLanguage, true);
  }, [selectedLanguage]);

  // 监听 page，page>1 时请求数据
  useEffect(() => {
    fetchProjects(page, selectedLanguage);
    setInit(true);
  }, [page]);

  return (
    <div className='container'>
      {/* 项目网格 */}
      {/* <div className="project-grid"> */}
      <Spin
        spinning={loading}
        tip='加载中...'
        wrapperClassName='loading-spinner'
        delay={500}
        size='large'
      >
        <Row gutter={[16, 16]} justify={projects.length % 4 !== 0 ? 'space-evenly' : 'start'} wrap>
          {projects.map((project, index) => (
            <Col key={project.id} xs={24} sm={12} md={8} lg={6} style={{ margin: 'auto' }}>
              <div key={project.id} className='project-card'>
                <div className='project-rank'>#{index + 1}</div>
                <img
                  src={project.owner.avatar_url}
                  alt={project.name}
                  loading='lazy'
                  className='project-image'
                />
                <h3 className='project-name'>{project.name}</h3>
                {/* <p>{project.description}</p> */}
                <div className='stats'>
                  <div>
                    <FontAwesomeIcon
                      icon={faUser}
                      style={{ color: '#666', marginRight: 8, width: 14, height: 14 }}
                    />
                    {project.owner.login}
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ color: '#ffd700', marginRight: 8, width: 14, height: 14 }}
                    />
                    {project.stargazers_count} <span>stars</span>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faCodeBranch}
                      style={{ color: '#2ecc71', marginRight: 8, width: 14, height: 14 }}
                    />
                    {project.forks_count} <span>forks</span>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      style={{ color: '#e74c3c', marginRight: 8, width: 14, height: 14 }}
                    />
                    {project.open_issues_count} <span>open issues</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
          {/* {loading && (
            <Spin
              tip="Loading..."
              size="large"
              wrapperClassName="loading-spinner">
            </Spin>
        )} */}
          <div ref={observerRef} style={{ height: '10px', marginTop: '-5px' }} />
        </Row>
      </Spin>
    </div>
    // </div>
  );
}
