import CommonNav from '../battle/components/CommonNav';
import './Battle.scss'
import { faUserGroup, faTrophy, faPlane } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';


export default function Battle() {
    const navigate = useNavigate();
    const steps = [
        { description: 'Enter two Github users', icon: faUserGroup, color: '#fcbf75' },
        { description: 'Battle', icon: faPlane, color: '#727272' },
        { description: 'See the Winner', icon: faTrophy, color: '#fdd700' }
    ];

    const [username1, setUsername1] = useState('');
    const [username2, setUsername2] = useState('');
    const [avatarUrl1, setAvatarUrl1] = useState('');
    const [avatarUrl2, setAvatarUrl2] = useState('');

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitted2, setIsSubmitted2] = useState(false);


    /**
     * @description 实现提交处理
     * @param {*} username  用户名
     * @param {*} who  提交的是谁
     * @returns 
     */
    const handleSubmit = async (username, who) => {
        if (!username) return;
        message.loading('加载中...');
        // 保存当前操作标识符
        const currentWho = who;

        try {
            const response = await fetch(`https://api.github.com/users/${username}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();


            // 存储到localStorage
            const storageKey = who === '1' ? 'player1Data' : 'player2Data';
            localStorage.setItem(storageKey, JSON.stringify(data));


            // 统一处理成功状态
            const stateUpdate = {
                avatarUrl: currentWho === '1' ? setAvatarUrl1 : setAvatarUrl2,
                isSubmitted: currentWho === '1' ? setIsSubmitted : setIsSubmitted2
            };

            stateUpdate.avatarUrl(data.avatar_url);
            stateUpdate.isSubmitted(true);
            message.destroy();

        } catch (error) {
            console.error('请求失败:', error);
            message.error('请求出错啦~请换个名字试试');

            // 根据保存的currentWho重置状态
            const stateReset = {
                isSubmitted: currentWho === '1' ? setIsSubmitted : setIsSubmitted2
            };
            stateReset.isSubmitted(false);
        } finally {
            message.destroy();
        }
    };


    /**
     * @description 移除玩家头像
     * @param {*} playerId  玩家id
     */
    const handleRemoveAvatar = (playerId) => {
        if (playerId === '1') {
            setAvatarUrl1(null);
            setIsSubmitted(false);
        }
        if (playerId === '2') {
            setAvatarUrl2(null);
            setIsSubmitted2(false);
        }
    };



    return (
        <div>
            <CommonNav />
            <div>
                <div className='Battle-title'>Instructions</div>
                {/*  */}
                <div className='Battle-step'>
                    {steps.map((step, index) => (
                        <div className='Battle-step-item' key={index}>
                            <div className='Battle-step-description' >{step.description}</div>
                            <div
                                className={`Battle-step-icon ${step.description === 'Battle' && isSubmitted && isSubmitted2 ? 'active-battle' : ''}`}
                                onClick={() => {
                                    if (step.description === 'Battle' && isSubmitted && isSubmitted2) {
                                        navigate('/battle-result');
                                    }
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={step.icon}
                                    style={{
                                        color: step.description === 'Battle' && isSubmitted && isSubmitted2 ? '#ff0000' : step.color,
                                        width: '8vw',
                                        height: '8vw',
                                        animation: step.description === 'Battle' && isSubmitted && isSubmitted2 ? 'battle-blink 1s infinite' : 'none'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                {/*  */}
                <div className='Battle-player'>
                    <div className='player-title'>Players</div>
                    {/*  */}
                    <div className='player-content'>
                        <div className='player-content-item'>
                            <div className="player-sm-title">Player One</div>
                            <div className="player-info">
                                <input
                                    className='player-info-input'
                                    type='text'
                                    value={username1}
                                    onChange={(e) => setUsername1(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && username1 && !isSubmitted) {
                                            handleSubmit(username1, '1');
                                        }
                                    }}
                                />
                                <button className="player-info-submit" style={{ cursor: !username1 || isSubmitted ? 'not-allowed' : 'pointer' }} disabled={!username1 || isSubmitted} onClick={() => { handleSubmit(username1, '1'); }}>SUBMIT</button>
                            </div>
                            {/* 玩家1头像 */}
                            {avatarUrl1 && (
                                <div className="play-info-image">
                                    <img className='avatar-image' src={avatarUrl1} alt="Avatar" />
                                    <span
                                        className="remove-avatar"
                                        onClick={() => handleRemoveAvatar('1')}
                                    >
                                        ×
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className='player-content-item'>
                            <div className="player-sm-title">Player Two</div>
                            <div className="player-info">
                                <input className='player-info-input' type="text" value={username2}
                                    onChange={(e) => setUsername2(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && username2 && !isSubmitted2) {
                                            handleSubmit(username2, '2');
                                        }
                                    }} />
                                <button
                                    className="player-info-submit"
                                    disabled={!username2 || isSubmitted2}
                                    onClick={() => {
                                        handleSubmit(username2, '2');
                                    }}
                                    style={{ cursor: !username2 || isSubmitted2 ? 'not-allowed' : 'pointer' }}
                                >SUBMIT</button>
                            </div>

                            {/* 玩家2头像 */}
                            {avatarUrl2 && (
                                <div className="play-info-image">
                                    <img className='avatar-image' src={avatarUrl2} alt="Avatar" />
                                    <span
                                        className="remove-avatar"
                                        onClick={() => handleRemoveAvatar('2')}
                                    >
                                        ×
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}