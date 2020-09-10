import React, { useState } from 'react';
import CheckboxList from '../../../ui/checkboxList';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_SELECTED_CATEGORY } from '../../../../actions/types';
import CheckboxMoreButton from './checkboxMoreButton';
import CheckboxSearchBar from './checkboxSearchBar';

export default function BrandCheckBox() {
  const TITLE = 'Brand';
  const propName = 'brands';
  const dispatch = useDispatch();
  const brandList = useSelector((state) =>
    state.filterAttributesReducer ? state.filterAttributesReducer.brands : null,
  );
  const selectedBrands = useSelector(
    (state) => state.selectedFilterAttributesReducer.brands,
  );
  const [searchBrandList, setSearchBrandList] = useState(null);

  if (!brandList) {
    return null;
  }

  const getActiveBrandList = () => {
    return searchBrandList ? searchBrandList : brandList;
  };

  const handleSearchListChange = (searchList) => {
    setSearchBrandList(searchList);
  };

  const handleCheckBoxChange = (id, value) => {
    dispatch({
      type: ADD_SELECTED_CATEGORY,
      payload: {
        brands: {
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
        placeholderText="Search for Brands"
        checkboxList={brandList}
        searchListHandler={handleSearchListChange}
      />
      <CheckboxList
        attrList={getActiveBrandList()}
        title="Brand"
        maxItems={6}
        selectedAttrList={selectedBrands}
        onChangeHandler={handleCheckBoxChange}
      />
      <CheckboxMoreButton
        title={TITLE}
        propName={propName}
        checkboxList={brandList}
        size={9}
        selectedCheckboxList={selectedBrands}
        checkboxChangeHandler={handleCheckBoxChange}
      />
    </>
  );
}
