import React, { useState } from 'react';
import CheckboxList from '../../../ui/checkboxList';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_SELECTED_CATEGORY } from '../../../../actions/types';
import CheckboxMoreButton from './checkboxMoreButton';
import CheckboxSearchBar from './checkboxSearchBar';

export default function ApparelCheckBox() {
  const TITLE = 'Apparel';
  const propName = 'apparels';
  const dispatch = useDispatch();
  const apparelList = useSelector((state) =>
    state.filterAttributesReducer
      ? state.filterAttributesReducer.apparels
      : null,
  );
  const selectedApparels = useSelector(
    (state) => state.selectedFilterAttributesReducer.apparels,
  );
  const [searchApparelList, setSearchApparelList] = useState(null);

  if (!apparelList) {
    return null;
  }

  const getActiveApparelList = () => {
    return searchApparelList ? searchApparelList : apparelList;
  };

  const handleSearchListChange = (searchList) => {
    setSearchApparelList(searchList);
  };

  const handleCheckBoxChange = (id, value) => {
    dispatch({
      type: ADD_SELECTED_CATEGORY,
      payload: {
        apparels: {
          id,
          value,
        },
        newQuery: null,
      },
    });
  };

  return (
    <>
      <CheckboxSearchBar
        title={TITLE}
        placeholderText="Search for Apparels"
        checkboxList={apparelList}
        searchListHandler={handleSearchListChange}
      />
      <CheckboxList
        attrList={getActiveApparelList()}
        title={TITLE}
        maxItems={6}
        selectedAttrList={selectedApparels}
        onChangeHandler={handleCheckBoxChange}
      />
      <CheckboxMoreButton
        title={TITLE}
        checkboxList={apparelList}
        propName={propName}
        size={6}
        selectedCheckboxList={selectedApparels}
        checkboxChangeHandler={handleCheckBoxChange}
      />
    </>
  );
}
