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
import { throttle } from 'lodash';


export default function PopularProjects({ selectedLanguage }) {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const observerRef = useRef();
  const [init, setInit] = useState(false);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading && init) {
      setPage(prev => prev + 1);
    }
  }, [loading]);

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

  // 创建节流3秒的错误提示函数
  const throttledError = throttle(
    () => message.error("未能获取项目数据，请稍后再试。"),
    3000,
    { leading: true, trailing: false }
  );

  /**
   * 分页加载项目
   */
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const q = selectedLanguage === 'all'
        ? 'stars:>1'
        : `stars:>1 language:${selectedLanguage}`;

      const response = await api.get('/search/repositories', {
        params: {
          q,
          sort: 'stars',
          order: 'desc',
          page,
          per_page: 10
        }
      });

      if (response && Array.isArray(response.items)) {
        setProjects(prev => [...prev, ...response.data.items]);
      } else {
        throttledError();

      }

    } catch (error) {
      if (error.message !== 'canceled') {
        throttledError();

      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('selectedLanguage', selectedLanguage);
    setProjects([]);
    setPage(1);
  }, [selectedLanguage]);


  useEffect(() => {
    fetchProjects();
    setInit(true);
  }, [page, selectedLanguage]);

  return (
    <div className="container">
      {/* 项目网格 */}
      {/* <div className="project-grid"> */}
      <Spin
        spinning={loading}
        tip="加载中..."
        wrapperClassName="loading-spinner"
        delay={500}
        size="large">
        <Row gutter={[16, 16]} justify={projects.length % 4 !== 0 ? 'space-evenly' : 'start'}
          wrap>
          {projects.map((project, index) => (
            <Col
              key={project.id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              style={{ margin: "auto" }}
            >

              <div key={project.id} className="project-card">
                <div className='project-rank'>#{index + 1}</div>
                <img
                  src={project.owner.avatar_url}
                  alt={project.name}
                  loading="lazy"
                  className="project-image"
                />
                <h3 className='project-name'>{project.name}</h3>
                {/* <p>{project.description}</p> */}
                <div className="stats">
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
