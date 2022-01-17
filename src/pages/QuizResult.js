import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { history } from '../redux/ConfigureStore'
import { useParams } from 'react-router-dom' // 삭제 X (props로 받은 useParams().category)
import { actionCreators as quizActions } from '../redux/modules/quiz'
import { quizApi } from '../shared/api'

import Grid from '../elements/Grid'
import BottomPopup from '../components/BottomPopup'
import ShareBottomSheet from '../components/ShareBottomSheet'
import OneQuiz from '../components/OneQuiz'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ReactComponent as GoBackIcon } from '../styles/icons/되돌아가기_24dp.svg'
import { ReactComponent as CopyLinkIcon } from '../styles/icons/링크복사_24dp.svg'
import { MdClose } from 'react-icons/md'
import { RiCloseCircleLine } from 'react-icons/ri'

const QuizResult = ({ quiz_list, category }) => {
  const dispatch = useDispatch()
  const user_answer_list = useSelector((state) => state.quiz.user_answer_list)
  const answerCnt = quiz_list
    ? quiz_list.filter((quiz, i) => {
        return quiz.solution === user_answer_list[i]
      }).length
    : null

  const [showQuiz, setShowQuiz] = useState(false)
  const [resultText, setResultText] = useState({ sub: '', main: '' })
  const [shareVisible, setShareVisible] = useState(false)

  const handleShareVisible = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShareVisible(!shareVisible)
  }

  const handleShowQuiz = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowQuiz(!showQuiz)
  }

  const handleMoveQuizIntro = (e) => {
    e.preventDefault()
    e.stopPropagation()
    history.push('/quiz')
    dispatch(quizActions.initAnswer())
  }

  useEffect(() => {
    if (answerCnt >= 0 && answerCnt < 4) {
      setResultText({ sub: '아주 작은 기적...', main: '"밈기적."' })
    } else if (answerCnt >= 4 && answerCnt < 8) {
      setResultText({ sub: `${answerCnt}개나 맞춘 나,`, main: '제법 "밈잘알"이에요.' })
    } else {
      setResultText({ sub: '치료가 필요할 정도로 심각한', main: '"밈중독"입니다.' })
    }
  }, [])

  useEffect(function () {
    async function submitQuizScore() {
      try {
        const result = await quizApi.submitScore(category, answerCnt)
      } catch (error) {
        console.log('퀴즈 결과 전송 문제 발생', error.response)
      }
    }
    submitQuizScore()
  }, [])

  return (
    <>
      <Header type="QuizResult" location="밈퀴즈"></Header>
      <Wrapper>
        <Grid flex_center column>
          <QuizResultBox>
            <div className="quiz-subject box-1">결과</div>
            <div className="quiz-subject box-2"></div>
            <Grid flex_center column padding="50px 0 30px">
              <h2 className="result-text__sub">{resultText.sub}</h2>
              <h2 className="result-text__main">{resultText.main}</h2>
              <span className="result-text__answerCnt">{answerCnt}/10</span>
            </Grid>
          </QuizResultBox>
          <ResultButtonContainer>
            <div className="resultButtonBox box1">
              <button className="resultButton" onClick={handleShowQuiz}>
                정답확인
              </button>
            </div>
            <div className="resultButtonBox box2"></div>
          </ResultButtonContainer>
          <TextButtonContainer>
            <Grid flex_center padding="16px 0">
              <div className="circle-button-box">
                <div
                  className="circle-button btn-1"
                  onClick={() => {
                    history.push('/quiz')
                  }}
                >
                  <GoBackIcon />
                </div>
                <div className="circle-button btn-2"></div>
              </div>
              <button className="text-button" onClick={handleMoveQuizIntro}>
                다른 테스트 하러 가기
              </button>
            </Grid>
            <Grid flex_center padding="16px 0">
              <div className="circle-button-box">
                <div className="circle-button btn-1" onClick={handleShareVisible}>
                  <CopyLinkIcon />
                </div>
                <div className="circle-button btn-2"></div>
              </div>
              <button className="text-button" onClick={handleShareVisible}>
                친구에게 공유하기
              </button>
            </Grid>
          </TextButtonContainer>
          <BottomPopup isOpen={showQuiz} onClose={() => setShowQuiz(false)} heightPixel={600}>
            <QuizContainer>
              <Handler />
              {quiz_list &&
                quiz_list.map((quiz, index) => {
                  return <OneQuiz key={index} quiz={quiz} index={index} />
                })}
              <Grid flex_center padding="10px 0 0">
                <RiCloseCircleLine className="close-icon" onClick={() => setShowQuiz(false)} />
              </Grid>
            </QuizContainer>
          </BottomPopup>
        </Grid>
        <ShareBottomSheet shareVisible={shareVisible} setShareVisible={setShareVisible} />
      </Wrapper>
      <Footer />
    </>
  )
}

const Wrapper = styled.div`
  padding: 56px 0 84px;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const QuizResultBox = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  margin: 40px 0 0;
  border: 2px solid ${({ theme }) => theme.colors.black};
  display: flex;
  align-items: center;
  justify-content: center;

  .quiz-subject {
    width: 100px;
    height: 40px;
    position: absolute;
    border: 2px solid ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    font-family: 'YdestreetB';
    font-style: normal;
    font-weight: normal;
  }

  .box-1 {
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    text-align: center;
    line-height: 40px;
    font-size: ${({ theme }) => theme.fontSizes.xl};
    background-color: ${({ theme }) => theme.colors.yellow};
  }

  .box-2 {
    top: -16px;
    left: calc(50%);
    transform: translateX(calc(-50% + 4px));
    background-color: ${({ theme }) => theme.colors.white};
  }
  .result-text__answerCnt {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-family: 'YdestreetB';
    font-style: normal;
    font-weight: normal;
  }

  .result-text__sub {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-family: 'YdestreetL';
    font-style: normal;
    font-weight: normal;
  }
  .result-text__main {
    width: 100%;
    text-align: center;
    font-size: 24px;
    font-family: 'YdestreetB';
    font-style: normal;
    font-weight: normal;
  }
`

const QuizContainer = styled.div`
  padding: 5px 20px 16px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.6);
  z-index: 10001;
  .close-icon {
    font-size: 28px;
    transition: color 0.3s ease-in-out;
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.colors.blue};
    }
  }
`

const Handler = styled.div`
  width: 40px;
  height: 5px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.line};
`

const ResultButtonContainer = styled.div`
  margin: 20px 0 0;
  width: 100%;
  height: 40px;
  position: relative;

  .resultButtonBox {
    width: 130px;
    height: 40px;
    position: absolute;
    border: 2px solid ${({ theme }) => theme.colors.black};
    border-radius: 20px;
    background-color: ${({ theme }) => theme.colors.white};
    .resultButton {
      width: 100%;
      height: 100%;
      font-size: ${({ theme }) => theme.fontSizes.xxl};
      font-family: 'YdestreetB';
      font-style: normal;
      font-weight: normal;
    }
  }

  .box1 {
    left: 50%;
    transform: translateX(-50%);
    background-color: ${({ theme }) => theme.colors.blue};
    z-index: 2;
    transition-duration: 0.5s;
    &:active {
      left: calc(50%);
      transform: translateX(calc(-50% + 4px));
      margin-top: 4px;
    }
  }

  .box2 {
    left: calc(50%);
    transform: translateX(calc(-50% + 4px));
    margin-top: 4px;
    background-color: ${({ theme }) => theme.colors.white};
  }
`

const TextButtonContainer = styled.div`
  width: 100%;
  padding: 20px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .text-button {
    width: 100%;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-family: 'Pretendard Variable';
    font-style: normal;
    font-weight: 700;
  }
  .circle-button-box {
    position: relative;
    .circle-button {
      position: absolute;
      width: 36px;
      height: 36px;
      border: 2px solid ${({ theme }) => theme.colors.black};
      border-radius: 20px;
    }
    .btn-1 {
      background-color: ${({ theme }) => theme.colors.orange};
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 300;
      cursor: pointer;
      transition-duration: 0.5s;
      left: 20px;
      top: -18px;
      &:active {
        left: 23px;
        top: -15px;
      }
    }
    .btn-2 {
      left: 23px;
      top: -15px;
    }
  }
`

export default QuizResult
