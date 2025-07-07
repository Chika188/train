import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faStar,
    faCodeBranch,
    faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import '../popular/popular.scss';
import './battle-result.scss'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonNav from '../battle/components/CommonNav';
import { Row, Col } from 'antd';


export default function BattleResult() {
    const navigate = useNavigate();
    useEffect(() => {
        const player1 = JSON.parse(localStorage.getItem('player1Data') || '{}');
        const player2 = JSON.parse(localStorage.getItem('player2Data') || '{}');
        // 比较逻辑
        const comparePlayers = (a, b) => {
            const reposDiff = Number(a.public_repos) - Number(b.public_repos);
            if (reposDiff !== 0) return reposDiff;
            return Number(a.followers) - Number(b.followers);
        };

        // 处理数据
        const processedPlayers = [player1, player2].map(p => ({
            ...p,
            isWinner: comparePlayers(p, p === player1 ? player2 : player1) > 0
        }));
        setProjects(processedPlayers);
    }, []);


    const [projects, setProjects] = useState([]);

    const onReset = () => {
        navigate('/battle');
        setProjects([]);
    }
    return (
        <div className='battle-result-container'>
            <CommonNav/>
            <div className='Battle-result'>
                <Row>
                    {projects.map((project) => (
                        <Col key={project.id} xs={24}
                            sm={12}>
                            <div key={project.id} className="project-card project-card-battle" >
                                <div className='project-rank' style={{ marginBottom: 10 }}> {project.isWinner ? 'Winner' : 'Loser'}</div>
                                <img
                                    src={project.avatar_url}
                                    alt={project.name}
                                    loading="lazy"
                                    className="project-image"
                                />
                                <h4 className='project-name' style={{ marginBottom: 0 }}>Scores: {project.public_repos}</h4>
                                <h3 className='project-name' style={{ color: '#0396ff' }}>{project.name || 'Unknown'}</h3>
                                {/* <p>{project.description}</p> */}
                                <div className="stats">
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            style={{ color: '#666', marginRight: 8, width: 14, height: 14 }}
                                        />
                                        {project.location || 'Unknown'}
                                    </div>
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faStar}
                                            style={{ color: '#ffd700', marginRight: 8, width: 14, height: 14 }}
                                        />
                                        {project.followers}
                                    </div>
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faCodeBranch}
                                            style={{ color: '#2ecc71', marginRight: 8, width: 14, height: 14 }}
                                        />
                                        {project.following}
                                    </div>
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faExclamationCircle}
                                            style={{ color: '#e74c3c', marginRight: 8, width: 14, height: 14 }}
                                        />
                                        {project.public_repos}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
            <div className='Battle-reset' onClick={onReset}>RESET</div>
        </div>
    );
}