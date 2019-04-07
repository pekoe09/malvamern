import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import fi from 'date-fns/locale/fi'
import 'react-datepicker/dist/react-datepicker.css'
import './diary.css'
import { Col, Row, FormControl, HelpBlock } from 'react-bootstrap'
import { MalvaForm, MalvaFormGroup, MalvaControlLabel } from '../common/MalvaStyledComponents'
import FormButtons from '../common/FormButtons'
import ViewHeader from '../common/ViewHeader'
import { addEntry, updateEntry, deleteEntry } from '../../actions/diaryActions'
import { addUIMessage } from '../../actions/uiMessageActions'

registerLocale('fi', fi)
setDefaultLocale('fi')

class EntryEdit extends React.Component {
  constructor() {
    super()
    this.state = {
      _id: '',
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
    const editingEntry = this.props.editingEntry
    if (editingEntry) {
      this.setState({
        _id: editingEntry._id,
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
      _id: this.state._id,
      date: this.state.date,
      title: this.state.title,
      body: this.state.body
    }
    if (entry._id) {
      await this.props.updateEntry(entry)
    } else {
      await this.props.addEntry(entry)
    }
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

  getButtons = (isEnabled) => {
    return (
      <FormButtons
        handleSubmit={this.handleSubmit}
        submitIsEnabled={isEnabled}
        cancelUrl='/diary'
        cancelBtnText='Päiväkirjaan'
      />
    )
  }

  render() {
    const errors = this.validate()
    const isEnabled = !Object.keys(errors).some(x => errors[x])

    return (
      <div>

        <ViewHeader
          text={this.props.editingEntry ?
            'Muokkaa päiväkirjamerkintää' :
            'Tee päiväkirjamerkintä'}
        />

        {this.getButtons(isEnabled)}

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
                  onBlur={this.handleBlur('date')}
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
                onBlur={this.handleBlur('body')}
                rows={10}
              />
              <HelpBlock>{errors['body']}</HelpBlock>
            </MalvaFormGroup>

            {this.getButtons(isEnabled)}

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
    updateEntry,
    deleteEntry,
    addUIMessage
  }
)(EntryEdit))

EntryEdit.propTypes = {
  editingEntry: PropTypes.object
}