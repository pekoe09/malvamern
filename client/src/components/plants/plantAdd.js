import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Col, Row, FormControl, HelpBlock } from 'react-bootstrap'
import { MalvaForm, MalvaControlLabel, MalvaFormGroup, MalvaButton, MalvaLinkButton } from '../common/MalvaStyledComponents'
import ViewHeader from '../common/ViewHeader'
import { addPlant } from '../../actions/plantActions'
import { addUIMessage } from '../../actions/uiMessageActions'

class PlantAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
      isPoisonous: '',
      hasSpikes: '',
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
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleBlur = (field) => () => {
    this.setState({
      touched: {
        ...this.state.touched,
        [field]: true
      }
    })
  }

  validate = () => {

    return {
      name: !this.state.name && this.state.touched['name'] ? 'Nimi on pakollinen tieto' : '',
      scientificName: !this.state.scientificName && this.state.touched['scientificName'] ? 'Tieteellinen nimi on pakollinen tieto' : '',
      heightMin: !this.validateNumber('heightMin', 1, null, true, true) && this.state.touched['heightMin'] ? 'Vähimmäiskorkeus on pakollinen kokokaisluku, vähintään 1' : '',
      heightMax: !this.validateNumber('heightMax', 1, null, false, true) && this.state.touched['heightMax'] ? 'Enimmäiskorkeuden on oltava kokonaisluku, vähintään 1' : '',
      widthMin: !this.validateNumber('widthMin', 1, null, true, true) && this.state.touched['widthMin'] ? 'Vähimmäisleveys on pakollinen kokokaisluku, vähintään 1' : '',
      widthMax: !this.validateNumber('widthMax', 1, null, false, true) && this.state.touched['widthMax'] ? 'Enimmäisleveyden on oltava kokonaisluku, vähintään 1' : '',
      plantDistance: !this.validateNumber('plantDistance', 1, null, false, true) && this.state.touched['plantDistance'] ? 'Istutusetäisyyden on oltava kokonaisluku, vähintään 1' : '',
      plantDepth: !this.validateNumber('plantDepth', 1, null, false, true) && this.state.touched['plantDepth'] ? 'Istutussyvyyden on oltava kokonaisluku, vähintään 1' : '',
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
          <ViewHeader text='Lisää kasvi' />
          <MalvaLinkButton
            text='Peruuta'
            to='/plants'
            btnType='default'
          />
        </div>

        <Col sm={6} style={{ padding: 0 }}>
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
                <MalvaFormGroup validationState={this.getValidationState(errors, 'heightMin')}>
                  <MalvaControlLabel>Korkeus (min)</MalvaControlLabel>
                  <FormControl
                    type='number'
                    name='heightMin'
                    min={1}
                    value={this.state.heightMin}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur('heightMin')}
                  />
                </MalvaFormGroup>
              </Col>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <MalvaFormGroup validationState={this.getValidationState(errors, 'heightMax')}>
                  <MalvaControlLabel>Korkeus (max)</MalvaControlLabel>
                  <FormControl
                    type='number'
                    name='heightMax'
                    min={1}
                    value={this.state.heightMax}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur('heightMax')}
                  />
                </MalvaFormGroup>
              </Col>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <MalvaFormGroup validationState={this.getValidationState(errors, 'widthMin')}>
                  <MalvaControlLabel>Leveys (min)</MalvaControlLabel>
                  <FormControl
                    type='number'
                    name='widthMin'
                    min={1}
                    value={this.state.widthMin}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur('widthMin')}
                  />
                </MalvaFormGroup>
              </Col>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <MalvaFormGroup validationState={this.getValidationState(errors, 'widthMax')}>
                  <MalvaControlLabel>Leveys (max)</MalvaControlLabel>
                  <FormControl
                    type='number'
                    name='widthMax'
                    min={1}
                    value={this.state.widthMax}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur('widthMax')}
                  />
                </MalvaFormGroup>
              </Col>
            </Row>

            <HelpBlock>{errors['heightMin']}</HelpBlock>
            <HelpBlock>{errors['heightMax']}</HelpBlock>
            <HelpBlock>{errors['widthMin']}</HelpBlock>
            <HelpBlock>{errors['widthMax']}</HelpBlock>

            <Row style={{ paddingLeft: 15 }}>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <MalvaFormGroup validationState={this.getValidationState(errors, 'plantDistance')}>
                  <MalvaControlLabel>Istutusetäisyys</MalvaControlLabel>
                  <FormControl
                    type='number'
                    name='plantDistance'
                    min={1}
                    value={this.state.plantDistance}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur('plantDistance')}
                  />
                  <HelpBlock>{errors['plantDistance']}</HelpBlock>
                </MalvaFormGroup>
              </Col>
              <Col sm={2} style={{ padding: 0, marginRight: 10 }}>
                <MalvaFormGroup validationState={this.getValidationState(errors, 'plantDepth')}>
                  <MalvaControlLabel>Istutussyvyys</MalvaControlLabel>
                  <FormControl
                    type='number'
                    name='plantDepth'
                    min={1}
                    value={this.state.plantDepth}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur('plantDepth')}
                  />
                  <HelpBlock>{errors['plantDepth']}</HelpBlock>
                </MalvaFormGroup>
              </Col>
            </Row>
            <MalvaFormGroup>

            </MalvaFormGroup>
          </MalvaForm>
        </Col>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  soilTypes: store.soilTypes.items
})

export default withRouter(connect(
  mapStateToProps,
  {
    addPlant,
    addUIMessage
  }
)(PlantAdd))