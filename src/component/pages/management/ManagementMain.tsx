import React from 'react'
import BaseComponent from './../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import BasePage from './../BasePage';
class ManagementMain extends BasePage
{
    constructor(props) {
        super(props, "Management", true);
    }
    render() {

        return (
            <div className="container-fluid section-body">
                <h2>Halaman Manajemen</h2>
                <div className="alert alert-info">
                    Welcome, <strong>{this.getLoggedUser()?.name}</strong>
                    <hr/>
                </div>
            </div>
        )
    }
}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(ManagementMain)
)