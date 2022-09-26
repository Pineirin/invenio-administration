// This file is part of InvenioAdministration
// Copyright (C) 2022 CERN.
//
// Invenio RDM Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { ResourceActions, ActionsDropdown, DeleteModalTrigger } from ".";
import { Button, Icon, Popup } from "semantic-ui-react";
import { AdminUIRoutes } from "../routes";
import { i18next } from "@translations/invenio_administration/i18next";
import Overridable from "react-overridable";

class Actions extends Component {
  render() {
    const {
      title,
      resourceName,
      actions,
      apiEndpoint,
      resource,
      successCallback,
      idKeyPath,
      listUIEndpoint,
      editAction: {
        display: displayEdit,
        disabled: disableEdit,
        disabledMessage: disabledEditMessage,
      },
      deleteAction: {
        display: displayDelete,
        disabled: disableDelete,
        disabledMessage: disabledDeleteMessage,
      },
    } = this.props;

    // if number of actions is greater than 3, we display all in a dropdown
    const displayAsDropdown =
      displayEdit && displayDelete && Object.keys(actions).length > 1;

    return (
      <Overridable id="Actions.layout">
        {displayAsDropdown ? (
          <ActionsDropdown
            title={title}
            resourceName={resourceName}
            apiEndpoint={apiEndpoint}
            resource={resource}
            successCallback={successCallback}
            idKeyPath={idKeyPath}
            actions={actions}
            displayEdit={displayEdit}
            displayDelete={displayDelete}
          />
        ) : (
          <Button.Group size="tiny" className="relaxed">
            {!isEmpty(actions) && (
              <ResourceActions
                resource={resource}
                successCallback={successCallback}
                idKeyPath={idKeyPath}
                actions={actions}
                apiEndpoint={apiEndpoint}
              />
            )}
            {displayEdit && (
              <Popup
                content={
                  disabledEditMessage
                    ? disabledEditMessage
                    : i18next.t("Resource is not editable.")
                }
                disabled={!disableEdit}
                trigger={
                  <span className="mr-5">
                    <Button
                      as="a"
                      disabled={disableEdit}
                      href={AdminUIRoutes.editView(listUIEndpoint, resource, idKeyPath)}
                      icon
                      labelPosition="left"
                      title={disabledEditMessage ? disabledEditMessage : ""}
                    >
                      <Icon name="pencil" />
                      {i18next.t("Edit")}
                    </Button>
                  </span>
                }
              />
            )}
            {displayDelete && (
              <Popup
                content={
                  disabledDeleteMessage
                    ? disabledDeleteMessage
                    : i18next.t("Resource is not deletable.")
                }
                disabled={!disableDelete}
                trigger={
                  <span>
                    <DeleteModalTrigger
                      title={title}
                      resourceName={resourceName}
                      apiEndpoint={apiEndpoint}
                      resource={resource}
                      successCallback={successCallback}
                      idKeyPath={idKeyPath}
                      disabled={disableDelete}
                      disabledDeleteMessage={
                        disabledEditMessage ? disabledEditMessage : ""
                      }
                    />
                  </span>
                }
              />
            )}
          </Button.Group>
        )}
      </Overridable>
    );
  }
}

Actions.propTypes = {
  title: PropTypes.string.isRequired,
  resourceName: PropTypes.string.isRequired,
  editAction: PropTypes.shape({
    display: PropTypes.bool,
    disabled: PropTypes.bool,
    disabledMessage: PropTypes.string,
  }),
  deleteAction: PropTypes.shape({
    display: PropTypes.bool,
    disabled: PropTypes.bool,
    disabledMessage: PropTypes.string,
  }),
  apiEndpoint: PropTypes.string,
  resource: PropTypes.object.isRequired,
  successCallback: PropTypes.func.isRequired,
  idKeyPath: PropTypes.string,
  actions: PropTypes.object.isRequired,
  listUIEndpoint: PropTypes.string.isRequired,
};

Actions.defaultProps = {
  editAction: {
    display: true,
    disabled: false,
    disabledMessage: i18next.t("Resource is not editable."),
  },
  deleteAction: {
    display: true,
    disabled: false,
    disabledMessage: i18next.t("Resource is not deletable."),
  },
  apiEndpoint: undefined,
  idKeyPath: "pid",
};

export default Overridable.component("Actions", Actions);
