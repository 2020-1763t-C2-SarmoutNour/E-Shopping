import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { REMOVE_SELECTED_CATEGORY } from '../../../../actions/types';

function ClearAllButton() {
  const dispatch = useDispatch();
  const selectedFilterAttribute = useSelector(
    (state) => state.selectedFilterAttributesReducer,
  );

  if (
    selectedFilterAttribute.genders.length +
      selectedFilterAttribute.apparels.length +
      selectedFilterAttribute.brands.length +
      selectedFilterAttribute.prices.length ===
    0
  ) {
    return null;
  }

  const handleClearAllClick = () => {
    dispatch({
      type: REMOVE_SELECTED_CATEGORY,
      payload: {
        newQuery: null,
      },
    });
  };

  return (
    <>
      <div
        onClick={handleClearAllClick}
        style={{
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '0.9rem',
          height: 'inherit',
          color: 'red',
        }}
      >
        CLEAR ALL
      </div>
    </>
  );
}

export default ClearAllButton;
