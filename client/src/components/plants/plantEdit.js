import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import { Col, Row, FormControl, HelpBlock, Checkbox } from 'react-bootstrap'
import { MalvaForm, MalvaControlLabel, MalvaFormGroup, MalvaButton, MalvaLinkButton } from '../common/MalvaStyledComponents'
import { MalvaImageContainer } from '../common/MalvaElements'
import NumberEntryField from '../common/NumberEntryField'
import ViewHeader from '../common/ViewHeader'
import colorList from './colorList'
import Select from 'react-select'
import ImageAdd from './imageAdd'
import { getPlant, updatePlant } from '../../actions/plantActions'
import { addImage } from '../../actions/imageActions'
import { addUIMessage } from '../../actions/uiMessageActions'

class PlantEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      plant: null,
      _id: '',
      name: '',
      scientificName: '',
      heightMin: '',
      heightMax: '',
      widthMin: '',
      widthMax: '',
      plantDistance: '',
      plantDepth: '',
      soilTypes: [],
      plantingFrom: '',
      plantingTo: '',
      floweringFrom: '',
      floweringTo: '',
      harvestFrom: '',
      harvestTo: '',
      flowerColors: [],
      isPoisonous: false,
      hasSpikes: false,
      description: '',
      shortDescription: '',
      environmentRequirements: '',
      careInstructions: '',
      openImageAddModal: false,
      modalError: '',
      touched: {
        name: false,
        scientificName: false,
        heightMin: false,
        heightMax: false,
        widthMin: false,
        widthMax: false,
        plantDistance: false,
        plantDepth: false,
        soilTypes: false,
        plantingFrom: false,
        plantingTo: false,
        floweringFrom: false,
        floweringTo: false,
        harvestFrom: false,
        harvestTo: false,
        flowerColors: false,
        isPoisonous: false,
        hasSpikes: false,
        description: false,
        shortDescription: false,
        environmentRequirements: false,
        careInstructions: false,
      }
    }
  }

  componentDidMount = async () => {
    const id = this.props.match.params.id
    let plant = this.props.plantCache.find(p => p._id === id)
    if (!plant) {
      await this.props.getPlant(id)
      plant = this.props.plantCache.find(p => p._id === id)
    }
    const flowerColors = plant.flowerColors.map(f => {
      return _.find(colorList, c => c.value === f)
    })
    this.setState({
      plant: plant,
      _id: plant._id,
      name: plant.name,
      scientificName: plant.scientificName,
      heightMin: plant.heightMin ? plant.heightMin.toString() : '',
      heightMax: plant.heightMax ? plant.heightMax.toString() : '',
      widthMin: plant.widthMin ? plant.widthMin.toString() : '',
      widthMax: plant.widthMax ? plant.widthMax.toString() : '',
      plantDistance: plant.plantDistance ? plant.plantDistance.toString() : '',
      plantDepth: plant.plantDepth ? plant.plantDepth.toString() : '',
      soilTypes: plant.soilTypes,
      plantingFrom: plant.plantingFrom ? plant.plantingFrom.number.toString() : '',
      plantingTo: plant.plantingTo ? plant.plantingTo.number.toString() : '',
      floweringFrom: plant.floweringFrom ? plant.floweringFrom.number.toString() : '',
      floweringTo: plant.floweringTo ? plant.floweringTo.number.toString() : '',
      harvestFrom: plant.harvestFrom ? plant.harvestFrom.number.toString() : '',
      harvestTo: plant.harvestTo ? plant.harvestTo.number.toString() : '',
      flowerColors,
      isPoisonous: plant.isPoisonous,
      hasSpikes: plant.hasSpikes,
      description: plant.description,
      shortDescription: plant.shortDescription,
      environmentRequirements: plant.environmentRequirements,
      careInstructions: plant.careInstructions
    })
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleColorChange = (flowerColors) => {
    this.setState({ flowerColors })
  }

  handleCheckboxToggle = (event) => {
    this.setState({ [event.target.name]: !this.state[event.target.name] })
  }

  handleBlur = (field) => () => {
    this.setState({
      touched: {
        ...this.state.touched,
        [field]: true
      }
    })
  }

  handleClear = () => {
    this.setState({
      name: '',
      scientificName: '',
      heightMin: '',
      heightMax: '',
      widthMin: '',
      widthMax: '',
      plantDistance: '',
      plantDepth: '',
      soilTypes: [],
      plantingFrom: '',
      plantingTo: '',
      floweringFrom: '',
      floweringTo: '',
      harvestFrom: '',
      harvestTo: '',
      flowerColors: [],
      isPoisonous: false,
      hasSpikes: false,
      description: '',
      shortDescription: '',
      environmentRequirements: '',
      careInstructions: '',
      touched: {
        name: false,
        scientificName: false,
        heightMin: false,
        heightMax: false,
        widthMin: false,
        widthMax: false,
        plantDistance: false,
        plantDepth: false,
        soilTypes: false,
        plantingFrom: false,
        plantingTo: false,
        floweringFrom: false,
        floweringTo: false,
        harvestFrom: false,
        harvestTo: false,
        flowerColors: false,
        isPoisonous: false,
        hasSpikes: false,
        description: false,
        shortDescription: false,
        environmentRequirements: false,
        careInstructions: false,
      }
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const plant = {
      ...this.state
    }
    delete plant.touched
    delete plant.plant
    plant.flowerColors = this.state.flowerColors.map(c => c.value)
    await this.props.updatePlant(plant)
    if (!this.props.error) {
      this.props.addUIMessage(
        `Kasvi ${plant.name} päivitetty!`,
        'success',
        10
      )
    } else {
      this.props.addUIMessage(
        `Kasvia ${plant.name} ei pystytty päivittämään!`,
        'danger',
        10
      )
    }
  }

  handleDelete = async () => {
    await this.props.deletePlant(this.state.plant._id)
    if (!this.props.error) {
      this.props.addUIMessage(
        `Kasvi ${this.state.plant.name} poistettu!`,
        'success',
        10
      )
      await this.props.getPlantCount()
      this.props.history.push('/plants')
    } else {
      this.props.addUIMessage(
        `Kasvia ${this.state.plant.name} ei pystytty poistamaan!`,
        'danger',
        10
      )
    }
  }

  toggleImageAddOpen = () => {
    this.setState({
      openImageAddModal: !this.state.openImageAddModal,
      modalError: ''
    })
  }

  handleAddImage = async () => {
    this.toggleImageAddOpen()
  }

  handleSaveImage = async (image) => {
    console.log('Saving image', image.name)
    await this.props.addImage(image)
    if (!this.props.imageError) {
      this.props.addUIMessage(
        `Kuva ${image.name} lisätty kasviin!`,
        'success',
        10
      )
    } else {
      this.props.addUIMessage(
        `Kuvaa ${image.name} ei pystytty lisäämään!`,
        'danger',
        10
      )
    }
  }

  validate = () => {
    return {
      name: !this.state.name && this.state.touched['name'] ? 'Nimi on pakollinen tieto' : '',
      scientificName: !this.state.scientificName && this.state.touched['scientificName'] ? 'Tieteellinen nimi on pakollinen tieto' : '',
      heightMin: !this.validateNumber('heightMin', 1, null, true, true) && this.state.touched['heightMin'] ? 'Korkeus pakollinen, vähintään 1' : '',
      heightMax: !this.validateNumber('heightMax', 1, null, false, true) && this.state.touched['heightMax'] ? 'Korkeus vähintään 1' : '',
      widthMin: !this.validateNumber('widthMin', 1, null, true, true) && this.state.touched['widthMin'] ? 'Leveys pakollinen, vähintään 1' : '',
      widthMax: !this.validateNumber('widthMax', 1, null, false, true) && this.state.touched['widthMax'] ? 'Leveys vähintään 1' : '',
      plantDistance: !this.validateNumber('plantDistance', 1, null, false, true) && this.state.touched['plantDistance'] ? 'Etäisyys vähintään 1' : '',
      plantDepth: !this.validateNumber('plantDepth', 1, null, false, true) && this.state.touched['plantDepth'] ? 'Syvyys vähintään 1' : '',
      plantingFrom: !this.validateNumber('plantingFrom', 1, 12, false, true) && this.state.touched['plantingFrom'] ? 'Kuukauden on oltava kokonaisluku (1-12)' : '',
      plantingTo: !this.validateNumber('plantingTo', 1, 12, false, true) && this.state.touched['plantingTo'] ? 'Kuukauden on oltava kokonaisluku (1-12)' : '',
      floweringFrom: !this.validateNumber('floweringFrom', 1, 12, false, true) && this.state.touched['floweringFrom'] ? 'Kuukauden on oltava kokonaisluku (1-12)' : '',
      floweringTo: !this.validateNumber('floweringTo', 1, 12, false, true) && this.state.touched['floweringTo'] ? 'Kuukauden on oltava kokonaisluku (1-12)' : '',
      harvestFrom: !this.validateNumber('harvestFrom', 1, 12, false, true) && this.state.touched['harvestFrom'] ? 'Kuukauden on oltava kokonaisluku (1-12)' : '',
      harvestTo: !this.validateNumber('harvestTo', 1, 12, false, true) && this.state.touched['harvestTo'] ? 'Kuukauden on oltava kokonaisluku (1-12)' : '',
      description: !this.state.description && this.state.touched['description'] ? 'Kuvaus on pakollinen' : '',
      shortDescription: !this.state.shortDescription && this.state.touched['shortDescription'] ? 'Lyhyt kuvaus on pakollinen' : '',
    }
  }

  validateNumber = (field, min, max, isMandatory, shouldBeInteger) => {
    const value = this.state[field]
    if (isMandatory && !this.state[field]) {
      return false
    } else if (value && isNaN(value)) {
      return false
    } else if (value && shouldBeInteger && isNaN(parseInt(value))) {
      return false
    } else if (value && ((min && value < min) || (max && value > max))) {
      return false
    } else {
      return true
    }
  }

  getValidationState = (errors, fieldName) => {
    if (errors[fieldName] && this.state.touched[fieldName]) {
      return 'error'
    } else {
      return null
    }
  }

  render() {
    const errors = this.validate()
    const isEnabled = !Object.keys(errors).some(x => errors[x])

    return (
      <div>
        <div>
          <ViewHeader text='Muokkaa kasvia' />
          <MalvaButton
            name='savebtn'
            disabled={!isEnabled}
            btntype='primary'
            onClick={this.handleSubmit}
          >
            Tallenna
          </MalvaButton>
          <MalvaLinkButton
            text='Kasvilistaan'
            to='/plants'
            btnType='default'
          />
          <MalvaButton
            btntype='default'
            onClick={this.handleClear}
          >
            Tyhjennä
          </MalvaButton>
          <MalvaButton
            name='editbtn'
            btntype='danger'
            onClick={this.handleDelete}
          >
            Poista
          </MalvaButton>
        </div>

        <Col sm={6} style={{ padding: 0, marginBottom: 50 }}>
          <MalvaForm>
            <MalvaFormGroup validationState={this.getValidationState(errors, 'name')}>
              <MalvaControlLabel>Nimi</MalvaControlLabel>
              <FormControl
                type='text'
                name='name'
                value={this.state.name}
                onChange={this.handleChange}
                onBlur={this.handleBlur('name')}
              />
              <HelpBlock>{errors['name']}</HelpBlock>
            </MalvaFormGroup>
            <MalvaFormGroup validationState={this.getValidationState(errors, 'scientificName')}>
              <MalvaControlLabel>Tieteellinen nimi</MalvaControlLabel>
              <FormControl
                type='text'
                name='scientificName'
                value={this.state.scientificName}
                onChange={this.handleChange}
                onBlur={this.handleBlur('scientificName')}
              />
              <HelpBlock>{errors['scientificName']}</HelpBlock>
            </MalvaFormGroup>

            <Row style={{ paddingLeft: 15 }}>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <NumberEntryField
                  name='heightMin'
                  text='Korkeus (min)'
                  value={this.state.heightMin}
                  min={1}
                  validate={this.getValidationState}
                  errors={errors}
                  handleChange={this.handleChange}
                  handleBlur={this.handleBlur('heightMin')}
                />
              </Col>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <NumberEntryField
                  name='heightMax'
                  text='Korkeus (max)'
                  value={this.state.heightMax}
                  min={1}
                  validate={this.getValidationState}
                  errors={errors}
                  handleChange={this.handleChange}
                  handleBlur={this.handleBlur('heightMax')}
                />
              </Col>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <NumberEntryField
                  name='widthMin'
                  text='Leveys (min)'
                  value={this.state.widthMin}
                  min={1}
                  validate={this.getValidationState}
                  errors={errors}
                  handleChange={this.handleChange}
                  handleBlur={this.handleBlur('widthMin')}
                />
              </Col>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <NumberEntryField
                  name='widthMax'
                  text='Leveys (max)'
                  value={this.state.widthMax}
                  min={1}
                  validate={this.getValidationState}
                  errors={errors}
                  handleChange={this.handleChange}
                  handleBlur={this.handleBlur('widthMax')}
                />
              </Col>
            </Row>

            <Row style={{ paddingLeft: 15 }}>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <NumberEntryField
                  name='plantDistance'
                  text='Istutusetäisyys'
                  value={this.state.plantDistance}
                  min={1}
                  max={12}
                  validate={this.getValidationState}
                  errors={errors}
                  handleChange={this.handleChange}
                  handleBlur={this.handleBlur('plantDistance')}
                />
              </Col>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <NumberEntryField
                  name='plantDepth'
                  text='Istutussyvyys'
                  value={this.state.plantDepth}
                  min={1}
                  max={12}
                  validate={this.getValidationState}
                  errors={errors}
                  handleChange={this.handleChange}
                  handleBlur={this.handleBlur('plantDepth')}
                />
              </Col>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <NumberEntryField
                  name='plantingFrom'
                  text='Istutus alkaen'
                  value={this.state.plantingFrom}
                  min={1}
                  max={12}
                  validate={this.getValidationState}
                  errors={errors}
                  handleChange={this.handleChange}
                  handleBlur={this.handleBlur('plantingFrom')}
                />
              </Col>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <NumberEntryField
                  name='plantingTo'
                  text='Istutus asti'
                  value={this.state.plantingTo}
                  min={1}
                  max={12}
                  validate={this.getValidationState}
                  errors={errors}
                  handleChange={this.handleChange}
                  handleBlur={this.handleBlur('plantingTo')}
                />
              </Col>
            </Row>

            <Row style={{ paddingLeft: 15 }}>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <NumberEntryField
                  name='floweringFrom'
                  text='Kukinta alkaen'
                  value={this.state.floweringFrom}
                  min={1}
                  max={12}
                  validate={this.getValidationState}
                  errors={errors}
                  handleChange={this.handleChange}
                  handleBlur={this.handleBlur('floweringFrom')}
                />
              </Col>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <NumberEntryField
                  name='floweringTo'
                  text='Kukinta asti'
                  value={this.state.floweringTo}
                  min={1}
                  max={12}
                  validate={this.getValidationState}
                  errors={errors}
                  handleChange={this.handleChange}
                  handleBlur={this.handleBlur('floweringTo')}
                />
              </Col>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <NumberEntryField
                  name='harvestFrom'
                  text='Sato alkaen'
                  value={this.state.harvestFrom}
                  min={1}
                  max={12}
                  validate={this.getValidationState}
                  errors={errors}
                  handleChange={this.handleChange}
                  handleBlur={this.handleBlur('harvestFrom')}
                />
              </Col>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <NumberEntryField
                  name='harvestTo'
                  text='Sato asti'
                  value={this.state.harvestTo}
                  min={1}
                  max={12}
                  validate={this.getValidationState}
                  errors={errors}
                  handleChange={this.handleChange}
                  handleBlur={this.handleBlur('harvestTo')}
                />
              </Col>
            </Row>

            <Row style={{ paddingLeft: 15 }}>
              <MalvaFormGroup>
                <MalvaControlLabel>Kukintoväri</MalvaControlLabel>
                <Select
                  name='flowerColors'
                  value={this.state.flowerColors}
                  onChange={this.handleColorChange}
                  options={colorList}
                  isMulti
                />
              </MalvaFormGroup>
            </Row>

            <Row style={{ paddingLeft: 15 }}>
              <MalvaFormGroup>
                <Checkbox
                  name='isPoisonous'
                  checked={this.state.isPoisonous}
                  onChange={this.handleCheckboxToggle}
                  inline
                >
                  Myrkyllinen
                </Checkbox>
                <Checkbox
                  name='hasSpikes'
                  checked={this.state.hasSpikes}
                  onChange={this.handleCheckboxToggle}
                  inline
                >
                  Piikikäs
                </Checkbox>
              </MalvaFormGroup>
            </Row>

            <MalvaFormGroup validationState={this.getValidationState(errors, 'description')}>
              <MalvaControlLabel>Kuvaus</MalvaControlLabel>
              <FormControl
                componentClass='textarea'
                name='description'
                value={this.state.description}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                rows={10}
              />
              <HelpBlock>{errors['description']}</HelpBlock>
            </MalvaFormGroup>

            <MalvaFormGroup validationState={this.getValidationState(errors, 'shortDescription')}>
              <MalvaControlLabel>Lyhyt kuvaus</MalvaControlLabel>
              <FormControl
                componentClass='textarea'
                name='shortDescription'
                value={this.state.shortDescription}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                rows={10}
              />
              <HelpBlock>{errors['shortDescription']}</HelpBlock>
            </MalvaFormGroup>

            <MalvaFormGroup validationState={this.getValidationState(errors, 'environmentRequirements')}>
              <MalvaControlLabel>Ympäristövaatimukset</MalvaControlLabel>
              <FormControl
                componentClass='textarea'
                name='environmentRequirements'
                value={this.state.environmentRequirements}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                rows={10}
              />
              <HelpBlock>{errors['environmentRequirements']}</HelpBlock>
            </MalvaFormGroup>

            <MalvaFormGroup validationState={this.getValidationState(errors, 'careInstructions')}>
              <MalvaControlLabel>Hoito-ohjeet</MalvaControlLabel>
              <FormControl
                componentClass='textarea'
                name='careInstructions'
                value={this.state.careInstructions}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                rows={10}
              />
              <HelpBlock>{errors['careInstructions']}</HelpBlock>
            </MalvaFormGroup>

            <MalvaFormGroup>
              <MalvaControlLabel>Kuvat</MalvaControlLabel>
              <Row
                style={{
                  paddingLeft: 15,
                  paddingBottom: 10
                }}>
                <MalvaButton
                  name='addImageBtn'
                  btntype='warning'
                  onClick={this.handleAddImage}
                >
                  Lisää kuva
                </MalvaButton>
              </Row>
              <MalvaImageContainer>
                <div>Kuvat</div>
              </MalvaImageContainer>
            </MalvaFormGroup>

            <Row style={{ paddingLeft: 15 }}>
              <MalvaButton
                name='savebtn'
                disabled={!isEnabled}
                btntype='primary'
                onClick={this.handleSubmit}
              >
                Tallenna
              </MalvaButton>
              <MalvaLinkButton
                text='Peruuta'
                to='/plants'
                btnType='default'
              />
              <MalvaButton
                btntype='default'
                onClick={this.handleClear}
              >
                Tyhjennä
              </MalvaButton>
              <MalvaButton
                name='editbtn'
                btntype='danger'
                onClick={this.handleDelete}
              >
                Poista
              </MalvaButton>
            </Row>

          </MalvaForm>
        </Col>

        <ImageAdd
          modalIsOpen={this.state.openImageAddModal}
          closeModal={this.toggleImageAddOpen}
          handleSave={this.handleSaveImage}
          modalError={this.state.modalError}
        />
      </div>
    )
  }
}

const mapStateToProps = store => ({
  plantCache: store.plants.cache,
  soilTypes: store.soilTypes.items,
  updating: store.plants.updating,
  error: store.plants.error,
  imageUpdating: store.images.updating,
  imageError: store.images.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    getPlant,
    updatePlant,
    addImage,
    addUIMessage
  }
)(PlantEdit))