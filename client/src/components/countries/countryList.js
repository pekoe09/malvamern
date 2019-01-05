import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Modal, Col, FormControl, FormGroup } from 'react-bootstrap'
import { MalvaReactTable, MalvaForm, MalvaControlLabel } from '../common/MalvaStyledComponents'
import ViewHeader from '../common/ViewHeader'
import { getAllCountries, addCountry, updateCountry, deleteCountry } from '../../actions/countryActions'
import { addUIMessage } from '../../actions/uiMessageActions'

class CountryList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openCountryCreationModal: false,
      openCountryUpdateModal: false,
      openContryDeleteConfirm: false,
      name: '',
      abbreviation: '',
      rowToDelete: '',
      deletiontargetId: '',
      deletionTargetName: '',
      touched: {
        name: false,
        abbreviation: false
      }
    }
  }

  componentDidMount = async () => {
    await this.props.getAllCountries()
  }

  handleOpenCountryCreation = () => {
    this.setState({
      openCountryCreationModal: true
    })
  }

  handleCloseCountryCreation = () => {
    this.setState({
      openCountryCreationModal: false,
      name: '',
      abbreviation: ''
    })
  }

  handleCancel = () => {

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

  handleSubmit = async (event) => {
    event.preventDefault()
    console.log('Submitting')
    const country = {
      name: this.state.name,
      abbreviation: this.state.abbreviation
    }
    console.log('Adding', country)
    await this.props.addCountry(country)
    if (!this.props.error) {
      this.props.addUIMessage(
        `Maa ${country.name} (${country.abbreviation}) luotu!`,
        'success',
        10
      )
    } else {
      this.props.addUIMessage(
        `Maan ${country.name} luonti epäonnistui!`,
        'error',
        10
      )
    }
  }

  validate = () => {
    return {
      name: !this.state.name,
      abbreviation: !this.state.abbreviation
    }
  }

  getValidationState = (errors, fieldName) => {
    if (errors[fieldName] && this.state.touched[fieldName]) {
      return 'error'
    } else {
      return null
    }
  }

  handleRowClick = (state, rowInfo) => {
    return {
      onClick: (e) => {
        console.log('Row clicked', rowInfo)
      }
    }
  }

  handleDelete = (row, e) => {
    e.stopPropagation()
    this.setState({
      rowToDelete: row
    })
  }

  columns = [
    {
      Header: 'Nimi',
      accessor: 'name',
      headerStyle: {
        textAlign: 'left'
      }
    },
    {
      Header: 'Lyhenne',
      accessor: 'abbreviation',
      headerStyle: {
        textAlign: 'left'
      }
    },
    {
      Header: '',
      accessor: 'delete',
      Cell: (row) => (
        <Button
          onClick={(e) => this.handleDelete(row.original, e)}
        >
          Delete
        </Button>
      ),
      style: {
        textAlign: 'center'
      },
      sortable: false,
      filterable: false,
      maxWidth: 80
    }
  ]


  render() {
    const errors = this.validate()
    const isEnabled = !Object.keys(errors).some(x => errors[x])

    console.log('Countries', this.props.countries)
    return (
      <div>
        <ViewHeader text='Maat' />
        <Button
          bsStyle='primary'
          onClick={this.handleOpenCountryCreation}
        >
          Lisää maa
        </Button>
        <Button
          bsStyle='default'
          onClick={this.handleCancel}
        >
          Peruuta
        </Button>

        <MalvaReactTable
          data={this.props.countries}
          columns={this.columns}
          getTrProps={this.handleRowClick}
          defaultPageSize={50}
          minRows={1}
        />

        <Modal
          show={this.state.openCountryCreationModal}
          onHide={this.handleCloseCountryCreation}
        >
          <Modal.Header closeButton>
            <Modal.Title>Lisää maa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MalvaForm>
              <FormGroup validationState={this.getValidationState(errors, 'name')}>
                <MalvaControlLabel>Nimi</MalvaControlLabel>
                <FormControl
                  type='text'
                  name='name'
                  value={this.state.name}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur('name')}
                />
              </FormGroup>
              <FormGroup validationState={this.getValidationState(errors, 'abbreviation')}>
                <MalvaControlLabel>Lyhenne</MalvaControlLabel>
                <FormControl
                  type='text'
                  name='abbreviation'
                  value={this.state.abbreviation}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur('abbreviation')}
                />
              </FormGroup>
            </MalvaForm>

          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle='primary'
              type='submit'
              onClick={this.handleSubmit}
              disabled={!isEnabled}
              style={{ marginRight: 5 }}
            >
              Tallenna
            </Button>
            <Button
              bsStyle='default'
              onClick={this.handleCloseCountryCreation}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    )
  }

}

const mapStateToProps = store => {
  console.log('Store countries', store.countries.items)
  return {
    countries: store.countries.items,
    loading: store.countries.loading,
    creating: store.countries.creating,
    deleting: store.countries.deleting,
    error: store.countries.error
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    getAllCountries,
    addCountry,
    updateCountry,
    deleteCountry,
    addUIMessage
  }
)(CountryList))