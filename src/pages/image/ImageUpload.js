import React from 'react'
import styled from 'styled-components'
import { history } from '../../redux/ConfigureStore'
import { useDispatch } from 'react-redux'
import { actionCreators as imageActions } from '../../redux/modules/image'

import ConfirmModal from '../../components/modal/ConfirmModal'
import ImageWrapper from '../../components/image/ImageWrapper'
import { IoCloseOutline } from 'react-icons/io5'

const ImageUpload = ({ preview, fileInput }) => {
  const dispatch = useDispatch()

  const [showModal, setShowModal] = React.useState(false)

  const handleShowModal = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowModal(!showModal)
  }

  const handleUploadImage = () => {
    const uploadFile = fileInput.current.files[0]
    dispatch(imageActions.uploadImageDB(uploadFile))
    setShowModal(!showModal)
  }

  return (
    <>
      <ImageWrapper>
        <div style={{ width: '100%', padding: '0 15px 0 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => {
              history.go('/image')
            }}
          >
            <IoCloseOutline style={{ fontSize: '24px', color: '#FFF' }} />
          </button>
          <UploadButton onClick={handleShowModal}>등록</UploadButton>
        </div>
        <div style={{ width: '100%', height: '80%', display: 'flex', alignItems: 'center' }}>
          <img src={preview} style={{ width: '100%', maxHeight: '100%', objectFit: 'cover' }} />
        </div>
      </ImageWrapper>
      {showModal && (
        <ConfirmModal question="밈짤을 게시하시겠어요?" showModal={showModal} handleShowModal={handleShowModal} setShowModal={setShowModal}>
          <SubmitButton onClick={handleUploadImage}>게시</SubmitButton>
        </ConfirmModal>
      )}
    </>
  )
}

const UploadButton = styled.button`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
`

const SubmitButton = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.blue};
`

export default ImageUpload
