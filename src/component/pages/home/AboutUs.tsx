import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FormGroup from '../../form/FormGroup';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import BaseComponent from './../../BaseComponent';
import Card from './../../container/Card';

class AboutUs extends BaseComponent<any, any> {
  constructor(props) {
    super(props, false);
  }
  componentDidMount() {
    document.title = "About Us";
  }
  render() {
    const appProfile = this.getApplicationProfile();
    return (
      <div className="section-body container-fluid mt-2">
        <h2>About Us</h2>
        <Card title="Application">
          <FormGroup label="Name">{appProfile.appName}</FormGroup>
          <FormGroup><i>{appProfile.appDescription}</i></FormGroup>
          <FormGroup label="Contact">{appProfile.contact}</FormGroup>
          <FormGroup label="Address">{appProfile.address}</FormGroup>
        </Card>
        <p />
        <Card title="Development Mode">
          {/* <FormGroup label="Repository"><a target="_blank" href="https://github.com/fajaralmu">https://github.com/fajaralmu</a></FormGroup>
                <FormGroup label="Front End">React Js</FormGroup>
                <FormGroup><a target="_blank" href="https://github.com/fajaralmu/front-end-shopping-mart-v2">https://github.com/fajaralmu/front-end-shopping-mart-v2</a></FormGroup>
                <FormGroup label="Back End">Java, Spring MVC</FormGroup>
                <FormGroup><a target="_blank" href="https://github.com/fajaralmu/universal-good-shop-v2">https://github.com/fajaralmu/universal-good-shop-v2</a></FormGroup> */}
        </Card>
        <p />
      </div>);
  }
}
export default withRouter(connect(
  mapCommonUserStateToProps,
)(AboutUs))