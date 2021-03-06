import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SELECT_SORT_CATEGORY } from '../../../actions/types';
import DropdownSection from '../../ui/dropDown';
import { SORT_ATTRIBUTE } from '../../../constants/constants';

export default function FilterDropdown() {
  const dispatch = useDispatch();
  const sortList = useSelector((state) =>
    state.filterAttributesReducer
      ? state.filterAttributesReducer[SORT_ATTRIBUTE]
      : null,
  );
  const selectedSortValue = useSelector((state) => state.selectSortReducer);

  if (!sortList) {
    return null;
  }

  const onChangeHandler = (id, value) => {
    dispatch({
      type: SELECT_SORT_CATEGORY,
      payload: {
        id,
        value,
        isLoadedFromURL: false,
      },
    });
  };

  return (
    <DropdownSection
      attrList={sortList}
      selectedValue={selectedSortValue}
      appendText="Sort by:"
      title="sortby"
      size="lg"
      onChangeHandler={onChangeHandler}
    />
  );
}
