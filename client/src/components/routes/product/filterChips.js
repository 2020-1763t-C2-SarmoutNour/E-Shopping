import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import { ADD_SELECTED_CATEGORY } from '../../../actions/types';

const FilterChips = () => {
  const selectedGenders = useSelector(
    (state) => state.selectedFilterAttributesReducer.genders,
  );
  const selectedApparels = useSelector(
    (state) => state.selectedFilterAttributesReducer.apparels,
  );
  const selectedBrands = useSelector(
    (state) => state.selectedFilterAttributesReducer.brands,
  );
  const selectedPriceRanges = useSelector(
    (state) => state.selectedFilterAttributesReducer.prices,
  );
  const dispatch = useDispatch();

  if (
    selectedGenders.length +
      selectedApparels.length +
      selectedBrands.length +
      selectedPriceRanges.length ===
    0
  ) {
    return null;
  }

  const addChips = (selectedAttrList, categoryId) => {
    let chipBoxList = [];

    selectedAttrList.forEach(({ id, value }) => {
      chipBoxList.push(
        <Box
          key={`${categoryId}-${id}`}
          width="auto"
          display="inline-block"
          p={0.2}
        >
          <Chip
            label={value}
            color="primary"
            onDelete={handleDelete(`${categoryId}-${id}`)}
          />
        </Box>,
      );
    });

    return chipBoxList;
  };

  const renderChipBoxes = () => {
    let chipBoxList = [];
    if (selectedGenders.length > 0) {
      chipBoxList = chipBoxList.concat(addChips(selectedGenders, 'ge'));
    }
    if (selectedApparels.length > 0) {
      chipBoxList = chipBoxList.concat(addChips(selectedApparels, 'ap'));
    }
    if (selectedBrands.length > 0) {
      chipBoxList = chipBoxList.concat(addChips(selectedBrands, 'br'));
    }
    if (selectedPriceRanges.length > 0) {
      chipBoxList = chipBoxList.concat(addChips(selectedPriceRanges, 'pr'));
    }

    if (chipBoxList) {
      return chipBoxList;
    }

    return null;
  };

  const findValueAndDispatch = (id, selectedAttrList, attributeName) => {
    for (let i = 0; i < selectedAttrList.length; i++) {
      if (selectedAttrList[i].id === parseInt(id)) {
        dispatch({
          type: ADD_SELECTED_CATEGORY,
          payload: {
            [attributeName]: {
              id: selectedAttrList[i].id,
              value: selectedAttrList[i].value,
            },
            newQuery: null,
          },
        });
        return;
      }
    }
  };

  const handleDelete = (id) => () => {
    const splitId = id.split('-');

    if (selectedGenders.length > 0 && splitId[0].localeCompare('ge') === 0) {
      findValueAndDispatch(splitId[1], selectedGenders, 'genders');
    }
    if (selectedApparels.length > 0 && splitId[0].localeCompare('ap') === 0) {
      findValueAndDispatch(splitId[1], selectedApparels, 'apparels');
    }
    if (selectedBrands.length > 0 && splitId[0].localeCompare('br') === 0) {
      findValueAndDispatch(splitId[1], selectedBrands, 'brands');
    }
    if (
      selectedPriceRanges.length > 0 &&
      splitId[0].localeCompare('pr') === 0
    ) {
      findValueAndDispatch(splitId[1], selectedPriceRanges, 'prices');
    }
  };

  return <>{renderChipBoxes()}</>;
};
export default FilterChips;
