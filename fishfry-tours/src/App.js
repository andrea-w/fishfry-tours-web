import './App.css';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import React from 'react';
import BoatCardList from './BoatCardList';
import { Button, FormControl, TextField, withStyles } from '@material-ui/core';

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
      newBoatName: ''
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
        if (response.status === 200) {
          this.getBoats()
          this.setState({
            newBoatName: ''
          })
        }
      })
    }
  }
  
  deleteBoat = (boatId) => {
    const mutationString = `mutation { boats { deleteBoat(id: ${boatId}) }}`
    this.axios_instance.post('graphql', {query: mutationString}).then((response) => {
      console.log(response)
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
        <FormControl className={classes.formControl}>
          <div>
            <TextField variant="outlined" label="Boat Name" size="small" onChange={(e) => {
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
