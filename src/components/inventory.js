import React, {Component} from 'react';
import axios from 'axios';
import { Button, Container, CssBaseline, TextField, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { DataGrid } from '@mui/x-data-grid';
import { CSVLink } from "react-csv";

const useStyles = theme => ({
    paper: {
      marginTop: theme.spacing(12),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', 
      marginTop: theme.spacing(4),
    },
    submit: {
      margin: theme.spacing(3, 0, 3),
    },
});


const columns = [
  { field: '_id', headerName: 'id', width: 200 },
  { field: 'product', headerName: 'Product', width: 150 },
  { field: 'amount', headerName: 'Amount', width: 150 },
  { field: 'location', headerName: 'Location', width: 150 },
];

class Inventory extends Component {
    csvLink = React.createRef()

    constructor(props) {
        super(props);
        
        this.state = {
            product: '',
            amount: '',
            location: '',
            inventory: [],
            data: []
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.getTransactionData = this.getTransactionData.bind(this)
    }

    componentDidMount() {
      axios.get("http://localhost:5000")
        .then(res => this.setState({inventory: res.data}))
    }

    getTransactionData = async () => {
      await axios.get("http://localhost:5000/download")
        .then(res => this.setState({data: res.data}))
        .catch((e) => console.log(e))
      this.csvLink.current.link.click()
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {

        const inventory = {
            product: this.state.product,
            amount: this.state.amount,
            location: this.state.location
        }

        console.log(inventory)

        if (e.nativeEvent.submitter.name === "create") {
          axios.post("http://localhost:5000/create", inventory)
            .then(res => console.log(res.data));
        }

        if (e.nativeEvent.submitter.name === "update") {
          axios.patch("http://localhost:5000/"+this.state.product, inventory)
            .then(res => console.log(res.data));
        }

        if (e.nativeEvent.submitter.name === "delete"){
          axios.delete("http://localhost:5000/"+this.state.product, inventory)
            .then(res => console.log(res.data));
        }

        axios.get("http://localhost:5000")
        .then(res => this.setState({inventory: res.data}))
    }


    render() {
        const { classes } = this.props
        return(
          <Container component="main" maxWidth="md">
            <CssBaseline />
              <Grid item xs={8}>
                <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="product"
                        label="Product"
                        name="product"
                        autoFocus
                        value={this.state.product}
                        onChange={this.onChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="amount"
                        label="Amount"
                        name="amount"
                        value={this.state.amount}
                        onChange={this.onChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        name="location"
                        label="Location"
                        type="location"
                        id="location"
                        value={this.state.location}
                        onChange={this.onChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={3}>
                      <Button
                        type="submit"
                        name="create"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                      >
                        Create Inventory
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        type="submit"
                        name="update"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                      >
                        Update Inventory
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        type="submit"
                        name="delete"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                      >
                        Delete Inventory
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
              <div style={{ height: 500, width: '75%' }}>
                <DataGrid rows={this.state.inventory} columns={columns} />
              </div>
              <Grid item xs={3}>
                      <Button
                          type="submit"
                          name="export"
                          variant="contained"
                          color="primary"
                          className={classes.submit}
                          onClick={this.getTransactionData}
                        >
                          Export CSV
                        </Button>
                        <CSVLink
                            data={this.state.inventory}
                            filename="data.csv"
                            ref={this.csvLink}
                            target="_blank" 
                        />
                    </Grid>
          </Container>
        )
    }
}

export default withStyles(useStyles)(Inventory);