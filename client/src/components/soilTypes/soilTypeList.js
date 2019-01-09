import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { MalvaReactTable } from '../common/MalvaStyledComponents'
import ViewHeader from '../common/ViewHeader'
import SoilTypeAdd from './soilTypeAdd'
import SoilTypeEdit from './soilTypeEdit'
import ConfirmDelete from '../common/ConfirmDelete'
import { getAllSoilTypes, addSoilType, updateSoilType, deleteSoilType } from '../../actions/soilTypeActions'
import { addUIMessage } from '../../actions/uiMessageActions'

class SoilTypeList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openSoilTypeCreationModal: false,
      openSoilTypeUpdateModal: false,
      openSoilTypeDeleteConfirm: false,
      modalError: '',
      rowToDelete: '',
      rowToEdit: {
        _id: '',
        name: '',
        country: {
          _id: '',
          name: '',
          abbreviation: ''
        }
      },
      deletiontargetId: '',
      deletionTargetName: '',
    }
  }

  componentDidMount = async () => {
    await this.props.getAllSoilTypes()
  }

  toggleSoilTypeCreationOpen = () => {
    this.setState({
      modalError: '',
      openSoilTypeCreationModal: !this.state.openSoilTypeCreationModal
    })
  }

  closeSoilTypeEditModal = () => {
    this.setState({
      modalError: '',
      openSoilTypeUpdateModal: false,
      rowToEdit: {
        _id: '',
        name: '',
        country: {
          _id: '',
          name: '',
          abbreviation: ''
        }
      }
    })
  }

  handleCancel = () => {
    this.props.history.push('/')
  }

  handleSave = async (soilType) => {
    await this.props.addSoilType(soilType)
    if (!this.props.error) {
      this.setState({
        openSoilTypeCreationModal: false
      })
      this.props.addUIMessage(
        `Maaperä ${soilType.name} luotu!`,
        'success',
        10
      )
    } else {
      this.setState({
        modalError: `Maaperän ${soilType.name} luonti epäonnistui!`
      })
    }
  }

  handleUpdate = async (soilType) => {
    await this.props.updateSoilType(soilType)
    if (!this.props.error) {
      this.setState({
        openSoilTypeUpdateModal: false,
        rowToEdit: {
          _id: '',
          name: '',
          country: {
            name: '',
            abbreviation: ''
          }
        }
      })
      this.props.addUIMessage(
        `Maaperä ${soilType.name} päivitetty!`,
        'success',
        10
      )
    } else {
      this.setState({
        modalError: `Maaperän ${soilType.name} päivittäminen epäonnistui!`
      })
    }
  }

  handleRowClick = (state, rowInfo) => {
    return {
      onClick: (e) => {
        this.setState({
          openSoilTypeUpdateModal: true,
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
      openSoilTypeDeleteConfirm: true
    })
  }

  handleDeleteConfirmation = async (isConfirmed) => {
    if (isConfirmed) {
      await this.props.deleteSoilType(this.state.deletiontargetId)
      if (!this.props.error) {
        this.props.addUIMessage(`Maaperä ${this.state.deletionTargetName} on poistettu!`, 'success', 10)
      } else {
        this.props.addUIMessage(`Maaperän ${this.state.deletionTargetName} poisto ei onnistunut!`, 'danger', 10)
      }
    }
    this.setState({
      openSoilTypeDeleteConfirm: false,
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
      Header: 'Maa',
      accessor: 'country.name',
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
        <ViewHeader text='Maaperätyypit' />
        <Button
          bsStyle='primary'
          onClick={this.toggleSoilTypeCreationOpen}
        >
          Lisää maaperätyyppi
        </Button>
        <Button
          bsStyle='default'
          onClick={this.handleCancel}
        >
          Peruuta
        </Button>

        <MalvaReactTable
          data={this.props.soilTypes}
          columns={this.columns}
          getTrProps={this.handleRowClick}
          defaultPageSize={50}
          minRows={1}
        />

        <SoilTypeAdd
          modalIsOpen={this.state.openSoilTypeCreationModal}
          closeModal={this.toggleSoilTypeCreationOpen}
          handleSave={this.handleSave}
          modalError={this.state.modalError}
        />

        <SoilTypeEdit
          modalIsOpen={this.state.openSoilTypeUpdateModal}
          closeModal={this.closeSoilTypeEditModal}
          handleSave={this.handleUpdate}
          modalError={this.state.modalError}
          soilType={this.state.rowToEdit}
        />

        <ConfirmDelete
          modalIsOpen={this.state.openSoilTypeDeleteConfirm}
          closeModal={this.handleDeleteConfirmation}
          headerText={'Vahvista poisto'}
          bodyText={`Oletko varma että haluat poistaa maaperän ${this.state.deletionTargetName}`}
          isDangerous={true}
        />
      </div>
    )
  }
}

const mapStateToProps = store => {
  return {
    soilTypes: store.soilTypes.items,
    loading: store.soilTypes.loading,
    creating: store.soilTypes.creating,
    deleting: store.soilTypes.deleting,
    error: store.soilTypes.error
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    getAllSoilTypes,
    addSoilType,
    updateSoilType,
    deleteSoilType,
    addUIMessage
  }
)(SoilTypeList))