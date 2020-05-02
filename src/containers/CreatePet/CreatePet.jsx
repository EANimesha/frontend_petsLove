import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { observer, useLocalStore } from 'mobx-react'
import { useTranslation } from 'react-i18next'
import { MdCancel, MdUpdate } from 'react-icons/md'
import { useHistory, useParams } from 'react-router'
import { SERVER } from 'services/config'
import c from 'classnames'
import Input from 'components/commons/Input'
import LayoutContainer from 'components/commons/LayoutContainer'
import Title from 'components/commons/Title'
import InputSelect from 'components/commons/InputSelect'
import InputCheckbox from 'components/commons/InputCheckbox'
import Textarea from 'components/commons/Textarea'
import CreatePetStore from 'stores/CreatePetStore'
import GoogleMapsLocation from 'components/commons/GoogleMapsLocation'
import ButtonsEditFixed from 'components/commons/ButtonsEditFixed'
import UserContext from 'Context/UserContext'
import ButtonsSaveFixed from 'components/commons/ButtonsSaveFixed'
import GoogleAutocomplete from 'components/commons/GoogleAutocomplete'
import styles from './createPet.scss'

const CreatePet = () => {
  const history = useHistory()
  const { id } = useParams()
  const [addressLocation, setAddress] = useState({})
  const [onlySave, setOnlySave] = useState(false)
  const fileUpload = useRef()
  const { t } = useTranslation(['createPet'])
  const rootStore = useContext(UserContext)
  const { optionsSelectsStore, authStore } = rootStore
  const createPetStore = useLocalStore(() => new CreatePetStore())

  const handleChangeImage = useCallback(e => {
    createPetStore.setImage(e.target.files)

    const fileList = Array.from(e.target.files)

    const mappedFiles = fileList.map(file => ({
      ...file,
      preview: URL.createObjectURL(file),
      imageName: file,
    }))

    createPetStore.setNewsPreviewsImage(mappedFiles)
  })

  const onClickFileUpload = useCallback(() => {
    fileUpload.current.click()
  }, [])

  const handleChangeName = useCallback(e => {
    createPetStore.setName(e.target.value)
  }, [])

  const handleChangeCategory = useCallback(selectedValue => {
    createPetStore.setCategory(selectedValue)
  }, [])

  const handleChangeAddress = useCallback(address => {
    setAddress(address)
    createPetStore.setAddress(address)
  }, [])

  const handleChangeTextAddress = useCallback(address => {
    createPetStore.setTextAddress(address)
  }, [])

  const handleChangeUrgent = useCallback(() => {
    createPetStore.setUrgent()
  }, [])

  const handleChangeLost = useCallback(() => {
    createPetStore.setLost()
  }, [])

  const handleChangeAdopted = useCallback(() => {
    createPetStore.setAdopted()
  }, [])

  const handleChangeSterilized = useCallback(() => {
    createPetStore.setSterilized()
  }, [])

  const handleChangeVaccinated = useCallback(() => {
    createPetStore.setVaccinated()
  }, [])

  const handleChangeGender = useCallback(selectedValue => {
    createPetStore.setGender(selectedValue)
  }, [])

  const handleChangeAge = useCallback(selectedValue => {
    createPetStore.setAge(selectedValue)
  }, [])

  const handleChangeHistory = useCallback(e => {
    createPetStore.setHistory(e.target.value)
  }, [])

  const handleChangeRequired = useCallback(e => {
    createPetStore.setRequiredToAdoption(e.target.value)
  }, [])

  const handleChangeActivity = useCallback(selectedValue => {
    createPetStore.setActivity(selectedValue)
  }, [])

  const handleCancelEdit = useCallback(() => {
    createPetStore.setCancelEdit()
  }, [])

  const handleEdit = useCallback(() => {
    createPetStore.setEdit()
  }, [])

  const handleBack = useCallback(() => {
    history.push(`/profile-pets/${id}`)
  }, [])

  const deleteImage = useCallback(image => {
    createPetStore.deleteImageArray(image)
  }, [])

  const handleSave = useCallback(() => {
    if (id) {
      createPetStore.saveEdit(id)
    } else {
      createPetStore.save(authStore.user._id)
    }
  }, [])

  useEffect(() => {
    optionsSelectsStore.listGender()
    optionsSelectsStore.listActiviy()
    optionsSelectsStore.listAges()
    optionsSelectsStore.listCategories()

    if (id) {
      createPetStore.searchPetForId(id)
      createPetStore.setCancelEdit()
    } else {
      createPetStore.setEdit()
      setOnlySave(true)
    }

    if (createPetStore.requestSuccess) {
      history.push('/')
      history.push(`/profile-pets/${createPetStore.idPet}`)
    }
  }, [createPetStore.requestSuccess])

  return (
    <LayoutContainer handleBack={handleBack} title={t('title')} textButton={t('backPets')}>
      <Title subTitle={t('subtitle')} />
      <div className={styles.containerImagePreview}>
        {createPetStore.newPreviewsImage &&
          createPetStore.newPreviewsImage.map(image => {
            return (
              <div className={styles.containerImage}>
                <img className={styles.imagePreview} src={image.preview} alt="pets" />
              </div>
            )
          })}
        {createPetStore.imagePreview &&
          createPetStore.imagePreview.map(image => {
            return (
              <div className={styles.containerImage}>
                <img className={styles.imagePreview} src={`${SERVER}/${image}`} alt="pets" />
                <div className={styles.middle}>
                  <div onClick={() => deleteImage(image)} className={styles.containerIcon}>
                    <MdCancel className={styles.iconImage} size={20} />
                  </div>
                </div>
              </div>
            )
          })}
      </div>
      <div className={styles.containerForm}>
        {createPetStore.isEdit && (
          <div className={styles.colInputImage}>
            <input
              multiple
              ref={fileUpload}
              className={styles.inputFile}
              onChange={handleChangeImage}
              type="file"
              placeholder={t('placeholderImages')}
            />
            <label onClick={onClickFileUpload} className={c(styles.textInput, styles.btnTertiary)}>
              <MdUpdate className={styles.icon} size={15} />
              <span className={styles.jsFileName}>Choose a file</span>
            </label>
          </div>
        )}
        <div className={styles.col}>
          <Input
            isEdit={createPetStore.isEdit}
            value={createPetStore.name}
            handleChange={handleChangeName}
            placeholder={t('placeholderName')}
          />
        </div>
        <div className={styles.col}>
          <InputSelect
            isEdit={createPetStore.isEdit}
            value={createPetStore.category}
            options={[
              { value: 'dog', label: t('dogs') },
              { value: 'cat', label: t('cats') },
            ]}
            handleChange={handleChangeCategory}
            placeholder={t('categoryPets')}
          />
        </div>
        <div className={styles.colContainerCheckbox}>
          <div className={styles.colCheckbox}>
            <InputCheckbox
              isEdit
              handleChange={handleChangeUrgent}
              value={createPetStore.urgent}
              text={t('urgent')}
            />
          </div>
          <div className={styles.colCheckbox}>
            <InputCheckbox
              handleChange={handleChangeLost}
              isEdit
              value={createPetStore.lost}
              text={t('lost')}
            />
          </div>
        </div>
        <div className={styles.colContainerCheckbox}>
          <div className={styles.colCheckbox}>
            <InputCheckbox
              isEdit
              handleChange={handleChangeSterilized}
              value={createPetStore.sterilized}
              text={t('sterilized')}
            />
          </div>
          <div className={styles.colCheckbox}>
            <InputCheckbox
              isEdit
              handleChange={handleChangeVaccinated}
              value={createPetStore.vaccinated}
              text={t('vaccinated')}
            />
          </div>
        </div>
        <div className={styles.colMap}>
          <GoogleAutocomplete
            isEdit={createPetStore.isEdit}
            label={t('addressPet')}
            placeholder={t('addAddress')}
            value={createPetStore.textAddress}
            handleChangeTextAddress={handleChangeTextAddress}
            handleChangeAddress={handleChangeAddress}
          />
          {addressLocation.lat && (
            <div className={styles.containerMap}>
              <GoogleMapsLocation
                addressValue={createPetStore.address}
                showAddress
                location={addressLocation}
                title={t('messageMap')}
              />
            </div>
          )}
        </div>
        <div className={styles.col}>
          <InputSelect
            isEdit={createPetStore.isEdit}
            value={createPetStore.gender}
            options={[
              { value: 'female', label: t('female') },
              { value: 'male', label: t('male') },
            ]}
            handleChange={handleChangeGender}
            placeholder={t('gender')}
          />
        </div>
        <div className={styles.col}>
          <InputSelect
            isEdit={createPetStore.isEdit}
            value={createPetStore.age}
            options={[
              { value: '1month', label: t('1month') },
              { value: '2month', label: t('2month') },
              { value: '3month', label: t('3month') },
              { value: '4month', label: t('4month') },
              { value: '5month', label: t('5month') },
              { value: '6month', label: t('6month') },
              { value: '7month', label: t('7month') },
              { value: '8month', label: t('8month') },
              { value: '9month', label: t('9month') },
              { value: '10month', label: t('10month') },
              { value: '11month', label: t('11month') },
              { value: '12month', label: t('12month') },
              { value: '1year', label: t('1year') },
              { value: '2year', label: t('2year') },
              { value: '3year', label: t('3year') },
              { value: '4year', label: t('4year') },
              { value: '5year', label: t('5year') },
              { value: '6year', label: t('6year') },
              { value: '7year', label: t('7year') },
              { value: '8year', label: t('8year') },
              { value: '9year', label: t('9year') },
              { value: '10year', label: t('10year') },
              { value: '11year', label: t('11year') },
              { value: '12year', label: t('12year') },
            ]}
            handleChange={handleChangeAge}
            placeholder={t('age')}
          />
        </div>
        <div className={styles.col}>
          <Textarea
            isEdit={createPetStore.isEdit}
            rows={4}
            value={createPetStore.history}
            handleChange={handleChangeHistory}
            placeholder={t('history')}
          />
        </div>
        <div className={styles.col}>
          <Textarea
            isEdit={createPetStore.isEdit}
            rows={4}
            value={createPetStore.requiredToAdoption}
            handleChange={handleChangeRequired}
            placeholder={t('RequiredToAdoption')}
          />
        </div>
        <div className={styles.col}>
          <InputSelect
            isEdit={createPetStore.isEdit}
            value={createPetStore.activity}
            options={[
              { value: 'quiet', label: t('quiet') },
              { value: 'energetic', label: t('energetic') },
              { value: 'superEnergetic', label: t('superEnergetic') },
            ]}
            handleChange={handleChangeActivity}
            placeholder={t('activity')}
          />
        </div>
        {onlySave && <ButtonsSaveFixed handleSave={handleSave} />}
        {!onlySave && (
          <ButtonsEditFixed
            isEdit={createPetStore.isEdit}
            handleEdit={handleEdit}
            handleSave={handleSave}
            handleCancelEdit={handleCancelEdit}
          />
        )}
      </div>
    </LayoutContainer>
  )
}

export default observer(CreatePet)