// This file is part of InvenioAdministration
// Copyright (C) 2022 CERN.
//
// Invenio RDM Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Icon } from "semantic-ui-react";
import { i18next } from "@translations/invenio_administration/i18next";
import { Modal } from "semantic-ui-react";
import { Trans } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import { ErrorMessage } from "../ui_messages/messages";
import { NotificationContext } from "../ui_messages/context";
import { InvenioAdministrationActionsApi } from "../api/actions";

export class DeleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, error: undefined };
  }

  static contextType = NotificationContext;

  cleanError = () => {
    this.setState({ error: undefined });
  };

  handleOnButtonClick = async () => {
    const { successCallback, resource, apiEndpoint, idKeyPath, toggleModal } =
      this.props;
    const { addNotification } = this.context;
    try {
      await InvenioAdministrationActionsApi.deleteResource(
        resource,
        apiEndpoint,
        idKeyPath
      );
      toggleModal(false);
      addNotification({
        title: "Success",
        content: "Resource was successfully deleted.",
        type: "success",
      });
      successCallback();
    } catch (e) {
      this.setState({
        error: { header: "Action error", content: e.message, id: e.code },
      });
    }
  };

  resetErrorState = () => {
    this.setState({ error: undefined });
  };

  render() {
    const { loading, error } = this.state;
    const { modalOpen, toggleModal, children, title } = this.props;
    return (
      <Modal role="dialog" open={modalOpen}>
        <Modal.Header as="h2">
          <Trans defaults="Delete {{title}}" values={{ title: title }} />
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {children}
            {!isEmpty(error) && (
              <ErrorMessage {...error} removeNotification={this.resetErrorState} />
            )}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            icon="cancel"
            onClick={() => {
              this.cleanError();
              toggleModal(false);
            }}
            loading={loading}
            content={i18next.t("Cancel")}
            floated="left"
            size="medium"
          />
          <Button negative onClick={this.handleOnButtonClick} loading={loading}>
            <Icon name="trash alternate" />
            {i18next.t("Delete")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

DeleteModal.propTypes = {
  title: PropTypes.string.isRequired,
  apiEndpoint: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
  successCallback: PropTypes.func.isRequired,
  idKeyPath: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

DeleteModal.defaultProps = {
  children: null,
};
