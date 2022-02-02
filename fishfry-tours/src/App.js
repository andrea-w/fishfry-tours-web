import './App.css';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import React from 'react';
import BoatCardList from './BoatCardList';
import { Button, FormControl, TextField, withStyles } from '@material-ui/core';
import { ErrorSnackbar, SuccessSnackbar } from './Alert';

const axios = require('axios').default

const styles = () => ({
  formControl: {
    margin: '10px',
    minWidth: '200px'
  }
})

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      boats: [],
      newBoatName: '',
      isError: false,
      isSuccess: false
    }
    this.axios_instance = axios.create({
      baseURL: "https://fishfry-tours.herokuapp.com/",
      config: {
        headers: {
          post: {
          "Access-Control-Allow-Origin": "*"
          }
        }
      }
    })
    this.setIsErrorState = (isError) => {
      this.setState({
        isError: isError
      })
      setTimeout(() => {
        this.setState({isError: false})
      }, 3000)
    }
    this.setIsSuccessState = (isSuccess) => {
      this.setState({
        isSuccess: isSuccess
      })
      setTimeout(() => {
        this.setState({isSuccess: false})
      }, 3000)
    }
  }



  componentDidMount() {
    this.getBoats()
  }

  getBoats = () => {
    const queryString = `query { boats { id name status }}`
    this.axios_instance.post('/graphql', {query: queryString}).then((response) => {
      this.setState( {
        boats: response.data.data.boats
      })
    })
  }

  addBoat = (boatName) => {
    if(boatName.length > 0) {
      const mutationString = `mutation { boats { addBoat(name: "${boatName}") {id name status } }}`
      this.axios_instance.post('graphql', {query: mutationString}).then((response) => {
        if (response.status === 200 && response.data.data !== null) {
          this.getBoats()
          this.setState({
            newBoatName: '',
            isError: false
          })
          this.setIsSuccessState(true)
        } else if (response.data.errors[0].message.includes('IntegrityError')) {
            this.setState({
              isSuccess: false
            })
            this.setIsErrorState(true)
        }
      })
    }
  }
  
  deleteBoat = (boatId) => {
    const mutationString = `mutation { boats { deleteBoat(id: ${boatId}) }}`
    this.axios_instance.post('graphql', {query: mutationString}).then((response) => {
      if (response.status === 200 && response.data.data.boats.deleteBoat === true) {
        this.getBoats()
      }
    })
  }

  updateBoatStatus = (boatId, newStatus) => {
    const mutationString = `mutation { boats { updateBoatStatus(id: ${boatId}, status: ${newStatus}) { id name status }}}`
    this.axios_instance.post('graphql', {query: mutationString}).then((response) => {
      if (response.status === 200) {
        this.getBoats()
      }
    })
  }

  render() {
    const { classes } = this.props
    return (
      <div className="App">
        <PageHeader />
        {this.state.isError ? (
          <ErrorSnackbar />
        ) : (null)}
        {this.state.isSuccess ? (
          <SuccessSnackbar />
        ) : (null)}
        <FormControl className={classes.formControl}>
          <div>
            <TextField variant="outlined" label="Boat Name" size="small" value={this.state.newBoatName} onChange={(e) => {
              this.setState({newBoatName: e.target.value})
            }} />
            <Button variant="contained" onClick={() => {this.addBoat(this.state.newBoatName)}}>
              Add Boat
            </Button>
          </div>
        </FormControl>
        <BoatCardList boatCards={this.state.boats} deleteBoat={this.deleteBoat} updateBoat={this.updateBoatStatus} />
        <PageFooter />
      </div>
    );
  }
  
}

export default withStyles(styles)(App)
