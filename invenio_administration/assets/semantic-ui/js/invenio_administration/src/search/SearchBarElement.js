/*
 * This file is part of Invenio.
 * Copyright (C) 2022 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import { withState } from "react-searchkit";
import { Input } from "semantic-ui-react";
import PropTypes from "prop-types";
import { i18next } from "@translations/invenio_administration/i18next";

export const SearchBar = withState(
  ({ updateQueryState, onInputChange, queryString, uiProps, placeholder }) => {
    const onBtnSearchClick = () => {
      updateQueryState({ queryString });
    };
    const onKeyPress = (event) => {
      if (event.key === "Enter") {
        updateQueryState({ queryString });
      }
    };
    return (
      <Input
        action={{
          icon: "search",
          onClick: onBtnSearchClick,
          className: "search",
        }}
        fluid
        placeholder={placeholder}
        onChange={(event, { value }) => {
          onInputChange(value);
        }}
        value={queryString}
        onKeyPress={onKeyPress}
        {...uiProps}
      />
    );
  }
);

SearchBar.propTypes = {
  queryString: PropTypes.string.isRequired,
  updateQueryState: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  uiProps: PropTypes.object,
};

SearchBar.defaultProps = {
  uiProps: undefined,
  placeholder: i18next.t("Search ..."),
  queryString: "",
};
