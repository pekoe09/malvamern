import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import DatePicker, { registerLocale, setDefaultLocale, getDefaultLocale } from 'react-datepicker'
import fi from 'date-fns/locale/fi'
import 'react-datepicker/dist/react-datepicker.css'
import './diary.css'
import { Col, Row, FormControl, HelpBlock } from 'react-bootstrap'
import { MalvaForm, MalvaFormGroup, MalvaControlLabel, MalvaButton, MalvaLinkButton } from '../common/MalvaStyledComponents'
import ViewHeader from '../common/ViewHeader'
import { addEntry, deleteEntry } from '../../actions/diaryActions'
import { addUIMessage } from '../../actions/uiMessageActions'

registerLocale('fi', fi)
setDefaultLocale('fi')

class EntryEdit extends React.Component {
  constructor() {
    super()
    this.state = {
      date: new Date(),
      title: '',
      body: '',
      images: [],
      touched: {
        date: false,
        title: false,
        body: false
      }
    }
  }

  componentDidMount = async () => {
    console.log('def locale:', getDefaultLocale())
    const editingEntry = this.props.editingEntry
    if (editingEntry) {
      this.setState({
        date: this.props.date,
        title: editingEntry.title,
        body: editingEntry.body,
        images: editingEntry.images ? editingEntry.images : []
      })
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleDateChange = date => {
    this.setState({ date })
  }

  handleBlur = (field) => () => {
    this.setState({
      touched: {
        ...this.state.touched,
        [field]: true
      }
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const entry = {
      title: this.state.title,
      body: this.state.body
    }
    await this.props.addEntry(entry)
    if (!this.props.error) {
      this.props.addUIMessage(
        `Merkintä lisätty päivälle ${this.state.date}!`,
        'success',
        10
      )
    } else {
      this.props.addUIMessage(
        'Merkintää ei pystytty lisäämään!',
        'danger',
        10
      )
    }
  }

  validate = () => {
    return {}
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
          <ViewHeader
            text={this.props.editingEntry ?
              'Muokkaa päiväkirjamerkintää' :
              'Tee päiväkirjamerkintä'}
          />
          <MalvaButton
            name='savebtn'
            btntype='primary'
            onClick={this.handleSubmit}
          >
            Tallenna
          </MalvaButton>
          <MalvaLinkButton
            text='Päiväkirjaan'
            to='/diary'
            btnType='default'
          />
          <MalvaButton
            btntype='default'
            onClick={this.handleClear}
          >
            Tyhjennä
          </MalvaButton>
          <MalvaButton
            name='deletebtn'
            btntype='danger'
            onClick={this.handleDelete}
          >
            Poista
          </MalvaButton>
        </div>

        <Col sm={6} style={{ padding: 0, marginBottom: 50 }}>
          <MalvaForm>

            <MalvaFormGroup validationState={this.getValidationState(errors, 'date')}>
              <MalvaControlLabel>Päivä</MalvaControlLabel>
              <Row style={{ marginLeft: 0 }}>
                <DatePicker
                  name='date'
                  className='malva-datepicker'
                  selected={this.state.date}
                  onChange={this.handleDateChange}
                  todayButton={'Tänään'}
                  dateFormat="dd.MM.yyyy"
                />
              </Row>
              <HelpBlock>{errors['date']}</HelpBlock>
            </MalvaFormGroup>

            <MalvaFormGroup validationState={this.getValidationState(errors, 'title')}>
              <MalvaControlLabel>Otsikko</MalvaControlLabel>
              <FormControl
                type='text'
                name='title'
                value={this.state.title}
                onChange={this.handleChange}
                onBlur={this.handleBlur('title')}
              />
              <HelpBlock>{errors['title']}</HelpBlock>
            </MalvaFormGroup>

            <MalvaFormGroup validationState={this.getValidationState(errors, 'body')}>
              <MalvaControlLabel>Teksti</MalvaControlLabel>
              <FormControl
                componentClass='textarea'
                name='body'
                value={this.state.body}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                rows={10}
              />
              <HelpBlock>{errors['body']}</HelpBlock>
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

      </div>
    )
  }

}

const mapStateToProps = store => ({
  error: store.entries.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    addEntry,
    deleteEntry,
    addUIMessage
  }
)(EntryEdit))

EntryEdit.propTypes = {
  editingEntry: PropTypes.object
}