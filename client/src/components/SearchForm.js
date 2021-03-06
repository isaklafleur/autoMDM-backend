import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import axios from "axios";
import "../styles/App.css";

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = { parts: [], activeCheckboxes: [] };
    this._handleChange = this._handleChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }
  render() {
    const { numberOfParts, headers } = this.props;
    return (
      <div>
        {headers.map(header => {
          return (
            <TextField
              className="input-field"
              type="text"
              name={header.id}
              onChange={this._handleChange}
              label={header.label}
              key={header.id}
            />
          );
        })}
        <br />
        <Button raised color="primary" onClick={this._handleSubmit}>
          Search
        </Button>
        <br />
        {numberOfParts > 0 && <h4>Matches: {numberOfParts}</h4>}
        <br />
      </div>
    );
  }
  _handleChange(event) {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    const name = event.target.name;
    const searchQuery = Object.assign({}, this.state.searchQuery);
    searchQuery[name] = value;
    this.setState({ searchQuery });
  }
  _handleSubmit(event) {
    event.preventDefault();
    axios
      .post("/api/parts/search", this.state.searchQuery)
      .then(response => {
        // console.log("response", response);
        this.props._handleSubmit(response.data.parts);
      })
      .catch(error => console.log(error));
  }
}
SearchForm.PropTypes = {
  _handleSubmit: PropTypes.func.isRequired,
  numberOfParts: PropTypes.string.isRequired,
  headers: PropTypes.arrayOf({}).isRequired
};

export default SearchForm;
