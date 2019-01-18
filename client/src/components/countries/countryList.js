import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { MalvaReactTable } from '../common/MalvaStyledComponents'
import ViewHeader from '../common/ViewHeader'
import CountryAdd from './countryAdd'
import CountryEdit from './countryEdit'
import ConfirmDelete from '../common/ConfirmDelete'
import { getAllCountries, addCountry, updateCountry, deleteCountry } from '../../actions/countryActions'
import { addUIMessage } from '../../actions/uiMessageActions'

class CountryList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openCountryCreationModal: false,
      openCountryUpdateModal: false,
      openContryDeleteConfirm: false,
      modalError: '',
      rowToDelete: '',
      rowToEdit: {
        _id: '',
        name: '',
        abbreviation: ''
      },
      deletiontargetId: '',
      deletionTargetName: '',
    }
  }

  componentDidMount = async () => {
    await this.props.getAllCountries()
  }

  toggleCountryCreationOpen = () => {
    this.setState({
      modalError: '',
      openCountryCreationModal: !this.state.openCountryCreationModal
    })
  }

  closeCountryEditModal = () => {
    this.setState({
      modalError: '',
      openCountryUpdateModal: false,
      rowToEdit: {
        _id: '',
        name: '',
        abbreviation: ''
      }
    })
  }

  handleCancel = () => {
    this.props.history.push('/')
  }

  handleSave = async (country) => {
    await this.props.addCountry(country)
    if (!this.props.error) {
      this.setState({
        openCountryCreationModal: false
      })
      this.props.addUIMessage(
        `Maa ${country.name} (${country.abbreviation}) luotu!`,
        'success',
        10
      )
    } else {
      this.setState({
        modalError: `Maan ${country.name} luonti epäonnistui!`
      })
    }
  }

  handleUpdate = async (country) => {
    await this.props.updateCountry(country)
    if (!this.props.error) {
      this.setState({
        openCountryUpdateModal: false,
        rowToEdit: {
          _id: '',
          name: '',
          abbreviation: ''
        }
      })
      this.props.addUIMessage(
        `Maa ${country.name} (${country.abbreviation}) päivitetty!`,
        'success',
        10
      )
    } else {
      this.setState({
        modalError: `Maan ${country.name} päivittäminen epäonnistui!`
      })
    }
  }

  handleRowClick = (state, rowInfo) => {
    return {
      onClick: (e) => {
        console.log('Row clicked', rowInfo)
        this.setState({
          openCountryUpdateModal: true,
          rowToEdit: rowInfo.original
        })
      }
    }
  }

  handleDelete = (row, e) => {
    e.stopPropagation()
    this.setState({
      rowToDelete: row,
      deletiontargetId: row._id,
      deletionTargetName: row.name,
      openContryDeleteConfirm: true
    })
  }

  handleDeleteConfirmation = async (isConfirmed) => {
    if (isConfirmed) {
      await this.props.deleteCountry(this.state.deletiontargetId)
      if (!this.props.error) {
        this.props.addUIMessage(`Maa ${this.state.deletionTargetName} on poistettu!`, 'success', 10)
      } else {
        this.props.addUIMessage(`Maan ${this.state.deletionTargetName} poisto ei onnistunut!`, 'danger', 10)
      }
    }
    this.setState({
      openContryDeleteConfirm: false,
      rowToDelete: '',
      deletionTargetName: '',
      deletiontargetId: ''
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
          bsStyle='danger'
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
    return (
      <div>
        <ViewHeader text='Maat' />
        <Button
          bsStyle='primary'
          onClick={this.toggleCountryCreationOpen}
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

        <CountryAdd
          modalIsOpen={this.state.openCountryCreationModal}
          closeModal={this.toggleCountryCreationOpen}
          handleSave={this.handleSave}
          modalError={this.state.modalError}
        />

        <CountryEdit
          modalIsOpen={this.state.openCountryUpdateModal}
          closeModal={this.closeCountryEditModal}
          handleSave={this.handleUpdate}
          modalError={this.state.modalError}
          country={this.state.rowToEdit}
        />

        <ConfirmDelete
          modalIsOpen={this.state.openContryDeleteConfirm}
          closeModal={this.handleDeleteConfirmation}
          headerText={'Vahvista poisto'}
          bodyText={`Oletko varma että haluat poistaa maan ${this.state.deletionTargetName}`}
          isDangerous={true}
        />
      </div>
    )
  }
}

const mapStateToProps = store => {
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