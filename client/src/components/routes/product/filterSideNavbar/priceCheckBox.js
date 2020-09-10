import React from 'react';
import CheckboxList from '../../../ui/checkboxList';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_SELECTED_CATEGORY } from '../../../../actions/types';
import { NavBarHeader } from '../../../ui/headers';
import { Box } from '@material-ui/core';

export default function PriceCheckBox() {
  const TITLE = 'Price';
  const dispatch = useDispatch();
  const priceRangeList = useSelector((state) =>
    state.filterAttributesReducer ? state.filterAttributesReducer.prices : null,
  );
  const selectedPriceRanges = useSelector(
    (state) => state.selectedFilterAttributesReducer.prices,
  );

  if (!priceRangeList) {
    return null;
  }

  const handleCheckBoxChange = (id, value) => {
    dispatch({
      type: ADD_SELECTED_CATEGORY,
      payload: {
        prices: { id, value },
        newQuery: null,
      },
    });
  };

  return (
    <Box pb={2}>
      <Box pt={2.5} pb={1}>
        <NavBarHeader title="Price" />
      </Box>
      <CheckboxList
        attrList={priceRangeList}
        fontSize="0.9rem"
        title={TITLE}
        selectedAttrList={selectedPriceRanges}
        onChangeHandler={handleCheckBoxChange}
      />
    </Box>
  );
}
