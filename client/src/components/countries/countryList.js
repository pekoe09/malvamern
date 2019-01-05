import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { MalvaReactTable } from '../common/MalvaStyledComponents'
import ViewHeader from '../common/ViewHeader'
import CountryAdd from './countryAdd'
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

  handleCancel = () => {
    this.props.history.push('/')
  }

  handleSave = async (country) => {
    console.log('Saving country', country)
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
    // console.log('Countries', this.props.countries)
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
      </div>
    )
  }

}

const mapStateToProps = store => {
  // console.log('Store countries', store.countries.items)
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